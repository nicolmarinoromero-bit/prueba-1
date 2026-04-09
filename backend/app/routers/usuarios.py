from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Usuario, RolUsuario
from ..middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/me")
def get_my_user_profile(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user["tipo"] != "usuario":
        raise HTTPException(status_code=403, detail="Acceso no autorizado. Solo para empleados.")
    
    usuario = db.query(Usuario).filter(Usuario.ID_USUARIO == current_user["id"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    rol = db.query(RolUsuario).filter(RolUsuario.ID_ROL == usuario.ID_ROL_U).first()
    
    return {
        "id": usuario.ID_USUARIO,
        "nombre": usuario.NOMBRE_USUARIO,
        "apellido": usuario.APELLIDO_USUARIO,
        "correo": usuario.CORREO_USUARIO,
        "documento": usuario.DOCUMENTO_USUARIO,
        "telefono": usuario.TELEFONO_USUARIO,
        "rol_id": usuario.ID_ROL_U,
        "rol_nombre": rol.NOMBRE_ROL if rol else None
    }