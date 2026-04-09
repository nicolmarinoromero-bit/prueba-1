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
    usuario = db.query(Usuario).filter(Usuario.id_usuario == current_user["id"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    rol = db.query(RolUsuario).filter(RolUsuario.id_rol == usuario.id_rol_u).first()
    return {
        "id": usuario.id_usuario,
        "nombre": usuario.nombre_usuario,
        "apellido": usuario.apellido_usuario,
        "correo": usuario.correo_usuario,
        "documento": usuario.documento_usuario,
        "telefono": usuario.telefono_usuario,
        "rol_id": usuario.id_rol_u,
        "rol_nombre": rol.nombre_rol if rol else None
    }