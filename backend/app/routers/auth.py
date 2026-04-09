from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
import random
import string
from ..database import get_db
from ..models import Cliente, Usuario, PasswordResetToken, RolUsuario
from ..schemas import (
    LoginRequest, RegisterClienteRequest, ForgotPasswordRequest,
    VerifyCodeRequest, ResetPasswordRequest, TokenResponse
)
from ..auth import verify_password, get_password_hash, create_access_token
from ..email_utils import send_reset_code_email
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.correo_cliente == request.correo).first()
    if cliente and verify_password(request.contraseña, cliente.contraseña_cliente):
        token = create_access_token({
            "sub": cliente.correo_cliente,
            "tipo": "cliente",
            "id": cliente.id_cliente
        })
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            rol="cliente",
            nombre=f"{cliente.nombre_cliente} {cliente.apellido_cliente}"
        )
    
    usuario = db.query(Usuario).filter(Usuario.correo_usuario == request.correo).first()
    if usuario and verify_password(request.contraseña, usuario.contraseña_usuario):
        rol = db.query(RolUsuario).filter(RolUsuario.id_rol == usuario.id_rol_u).first()
        rol_nombre = rol.nombre_rol if rol else "tecnico"
        token = create_access_token({
            "sub": usuario.correo_usuario,
            "tipo": "usuario",
            "id": usuario.id_usuario,
            "rol_id": usuario.id_rol_u
        })
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            rol=rol_nombre,
            nombre=f"{usuario.nombre_usuario} {usuario.apellido_usuario}"
        )
    
    raise HTTPException(status_code=401, detail="Credenciales inválidas")

@router.post("/register/cliente", status_code=status.HTTP_201_CREATED)
def register_cliente(request: RegisterClienteRequest, db: Session = Depends(get_db)):
    if db.query(Cliente).filter(Cliente.correo_cliente == request.correo).first():
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    if db.query(Cliente).filter(Cliente.documento_cliente == request.documento).first():
        raise HTTPException(status_code=400, detail="El documento ya está registrado")
    
    hashed = get_password_hash(request.contraseña)
    nuevo = Cliente(
        nombre_cliente=request.nombre.upper(),
        apellido_cliente=request.apellido.upper(),
        id_tipo_documento_c=request.tipo_documento,
        documento_cliente=request.documento,
        telefono_cliente=request.telefono,
        correo_cliente=request.correo.lower(),
        direccion_cliente=request.direccion,
        contraseña_cliente=hashed,
        is_active=True
    )
    db.add(nuevo)
    db.commit()
    return {"message": "Cliente registrado exitosamente"}

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = request.email
    cliente = db.query(Cliente).filter(Cliente.correo_cliente == email).first()
    usuario = db.query(Usuario).filter(Usuario.correo_usuario == email).first()
    
    if not cliente and not usuario:
        return {"message": "Si el correo está registrado, recibirás un código de verificación."}
    
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    existing = db.query(PasswordResetToken).filter(
        ((PasswordResetToken.email_usuario == email) | (PasswordResetToken.email_cliente == email)),
        PasswordResetToken.used == False
    ).first()
    
    if existing:
        existing.code = code
        existing.created_at = datetime.utcnow()
        existing.expires_at = expires_at
        existing.token = None
        existing.used = False
    else:
        new_token = PasswordResetToken(
            email_usuario=email if usuario else None,
            email_cliente=email if cliente else None,
            code=code,
            expires_at=expires_at
        )
        db.add(new_token)
    
    db.commit()
    await send_reset_code_email(email, code)
    return {"message": "Se ha enviado un código de verificación a tu correo."}

@router.post("/verify-code")
def verify_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    email = request.email
    token_entry = db.query(PasswordResetToken).filter(
        ((PasswordResetToken.email_usuario == email) | (PasswordResetToken.email_cliente == email)),
        PasswordResetToken.code == request.code,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()
    
    if not token_entry:
        raise HTTPException(status_code=400, detail="Código inválido o expirado")
    
    return {"message": "Código verificado correctamente"}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_entry = db.query(PasswordResetToken).filter(
        ((PasswordResetToken.email_usuario == request.email) | (PasswordResetToken.email_cliente == request.email)),
        PasswordResetToken.code == request.code,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > datetime.utcnow()
    ).first()
    
    if not token_entry:
        raise HTTPException(status_code=400, detail="Código inválido o expirado")
    
    hashed_password = get_password_hash(request.new_password)
    
    if token_entry.email_cliente:
        cliente = db.query(Cliente).filter(Cliente.correo_cliente == token_entry.email_cliente).first()
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        cliente.contraseña_cliente = hashed_password
    elif token_entry.email_usuario:
        usuario = db.query(Usuario).filter(Usuario.correo_usuario == token_entry.email_usuario).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        usuario.contraseña_usuario = hashed_password
    else:
        raise HTTPException(status_code=400, detail="No se encontró el usuario asociado")
    
    token_entry.used = True
    db.commit()
    return {"message": "Contraseña actualizada correctamente"}