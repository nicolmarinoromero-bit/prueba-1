from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger, Text
from sqlalchemy.sql import func
from .database import Base

class TipoDocumento(Base):
    __tablename__ = "tipos_documento"
    id_tipo_documento = Column(Integer, primary_key=True)
    nombre_tipo = Column(String(2))

class RolUsuario(Base):
    __tablename__ = "roles_usuario"
    id_rol = Column(Integer, primary_key=True)
    nombre_rol = Column(String(50))

class Usuario(Base):
    __tablename__ = "usuarios"
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre_usuario = Column(String(100))
    apellido_usuario = Column(String(100))
    id_tipo_documento_u = Column(Integer, ForeignKey("tipos_documento.id_tipo_documento"))
    documento_usuario = Column(BigInteger, unique=True)
    telefono_usuario = Column(BigInteger)
    correo_usuario = Column(String(100), unique=True)
    contraseña_usuario = Column(String(100))
    id_rol_u = Column(Integer, ForeignKey("roles_usuario.id_rol"))

class Cliente(Base):
    __tablename__ = "clientes"
    id_cliente = Column(Integer, primary_key=True, index=True)
    nombre_cliente = Column(String(100))
    apellido_cliente = Column(String(100))
    id_tipo_documento_c = Column(Integer, ForeignKey("tipos_documento.id_tipo_documento"))
    documento_cliente = Column(BigInteger, unique=True)
    telefono_cliente = Column(BigInteger)
    correo_cliente = Column(String(100), unique=True)
    direccion_cliente = Column(String(150))
    contraseña_cliente = Column(String(100))
    is_active = Column(Boolean, default=False)
    verification_token = Column(String(100), unique=True, nullable=True)

    
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    id = Column(Integer, primary_key=True, index=True)
    email_usuario = Column(String(100), nullable=True)
    email_cliente = Column(String(100), nullable=True)
    token = Column(String(100), nullable=True)
    code = Column(String(6), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)

class Producto(Base):
    __tablename__ = "productos"
    id_producto = Column(Integer, primary_key=True)
    nombre_producto = Column(String(100))
    referencia_producto = Column(String(50), unique=True)
    id_proveedor_pr = Column(Integer, ForeignKey("proveedores.id_proveedor"))
    precio_compra_producto = Column(Integer)
    precio_venta_producto = Column(Integer)
    fecha_registro_producto = Column(DateTime)
    imagen_url = Column(String(255), nullable=True)
    