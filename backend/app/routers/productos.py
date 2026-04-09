from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Producto
from ..schemas import ProductoResponse

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=list[ProductoResponse])
def listar_productos(
    skip: int = Query(0, ge=0),
    limit: int = Query(1000, ge=1, le=1000),   # ← aquí
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Producto)
    if search:
        query = query.filter(Producto.nombre_producto.ilike(f"%{search}%"))
    productos = query.offset(skip).limit(limit).all()
    return productos