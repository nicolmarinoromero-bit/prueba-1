from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Cliente
from ..middlewares.auth_middleware import get_current_user

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.get("/me")
def get_my_profile(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user["tipo"] != "cliente":
        raise HTTPException(status_code=403, detail="Acceso no autorizado")
    
    cliente = db.query(Cliente).filter(Cliente.ID_CLIENTE == current_user["id"]).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    return {
        "id": cliente.ID_CLIENTE,
        "nombre": cliente.NOMBRE_CLIENTE,
        "apellido": cliente.APELLIDO_CLIENTE,
        "correo": cliente.CORREO_CLIENTE,
        "telefono": cliente.TELEFONO_CLIENTE,
        "direccion": cliente.DIRECCION_CLIENTE
    }