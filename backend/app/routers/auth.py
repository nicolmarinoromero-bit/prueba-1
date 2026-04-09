from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from ..database import get_db
from ..models import Cliente, Usuario, PasswordResetToken, RolUsuario
from ..schemas import LoginRequest, RegisterClienteRequest, ForgotPasswordRequest, ResetPasswordRequest, TokenResponse
from ..auth import verify_password, get_password_hash, create_access_token
from ..email_utils import send_reset_email
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.CORREO_CLIENTE == request.correo).first()
    if cliente and verify_password(request.contraseña, cliente.CONTRASEÑA_CLIENTE):
        token = create_access_token({
            "sub": cliente.CORREO_CLIENTE,
            "tipo": "cliente",
            "id": cliente.ID_CLIENTE
        })
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            rol="cliente",
            nombre=f"{cliente.NOMBRE_CLIENTE} {cliente.APELLIDO_CLIENTE}"
        )
    
    usuario = db.query(Usuario).filter(Usuario.CORREO_USUARIO == request.correo).first()
    if usuario and verify_password(request.contraseña, usuario.CONTRASEÑA_USUARIO):
        rol = db.query(RolUsuario).filter(RolUsuario.ID_ROL == usuario.ID_ROL_U).first()
        token = create_access_token({
            "sub": usuario.CORREO_USUARIO,
            "tipo": "usuario",
            "id": usuario.ID_USUARIO,
            "rol_id": usuario.ID_ROL_U
        })
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            rol=rol.NOMBRE_ROL if rol else "usuario",
            nombre=f"{usuario.NOMBRE_USUARIO} {usuario.APELLIDO_USUARIO}"
        )
    
    raise HTTPException(status_code=401, detail="Credenciales inválidas")

@router.post("/register/cliente", status_code=status.HTTP_201_CREATED)
def register_cliente(request: RegisterClienteRequest, db: Session = Depends(get_db)):
    if db.query(Cliente).filter(Cliente.CORREO_CLIENTE == request.correo).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    if db.query(Cliente).filter(Cliente.DOCUMENTO_CLIENTE == request.documento).first():
        raise HTTPException(status_code=400, detail="El documento ya está registrado")
    
    hashed = get_password_hash(request.contraseña)
    nuevo = Cliente(
        NOMBRE_CLIENTE=request.nombre.upper(),
        APELLIDO_CLIENTE=request.apellido.upper(),
        ID_TIPO_DOCUMENTO_C=request.tipo_documento,
        DOCUMENTO_CLIENTE=request.documento,
        TELEFONO_CLIENTE=request.telefono,
        CORREO_CLIENTE=request.correo.lower(),
        DIRECCION_CLIENTE=request.direccion,
        CONTRASEÑA_CLIENTE=hashed,
        is_active=True
    )
    db.add(nuevo)
    db.commit()
    return {"message": "Cliente registrado exitosamente"}

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = request.email
    cliente = db.query(Cliente).filter(Cliente.CORREO_CLIENTE == email).first()
    usuario = db.query(Usuario).filter(Usuario.CORREO_USUARIO == email).first()
    
    if not cliente and not usuario:
        return {"message": "Si el correo está registrado, recibirás un enlace de recuperación"}
    
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    existing = db.query(PasswordResetToken).filter(
        ((PasswordResetToken.email_usuario == email) | (PasswordResetToken.email_cliente == email)),
        PasswordResetToken.used == False
    ).first()
    
    if existing:
        existing.token = token
        existing.created_at = datetime.utcnow()
        existing.expires_at = expires_at
        existing.used = False
        existing.code = None
    else:
        new_token = PasswordResetToken(
            email_usuario=email if usuario else None,
            email_cliente=email if cliente else None,
            token=token,
            expires_at=expires_at
        )
        db.add(new_token)
    
    db.commit()
    
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    await send_reset_email(email, reset_link)
    return {"message": "Correo de recuperación enviado"}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == request.token,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()
    
    if not token_entry:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")
    
    if token_entry.email_cliente:
        cliente = db.query(Cliente).filter(Cliente.CORREO_CLIENTE == token_entry.email_cliente).first()
        if cliente:
            cliente.CONTRASEÑA_CLIENTE = get_password_hash(request.new_password)
    elif token_entry.email_usuario:
        usuario = db.query(Usuario).filter(Usuario.CORREO_USUARIO == token_entry.email_usuario).first()
        if usuario:
            usuario.CONTRASEÑA_USUARIO = get_password_hash(request.new_password)
    else:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")
    
    token_entry.used = True
    db.commit()
    return {"message": "Contraseña actualizada correctamente"}