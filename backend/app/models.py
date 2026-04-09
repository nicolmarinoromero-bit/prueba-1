from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger
from sqlalchemy.sql import func
from .database import Base

class TipoDocumento(Base):
    __tablename__ = "TIPOS_DOCUMENTO"
    ID_TIPO_DOCUMENTO = Column(Integer, primary_key=True)
    NOMBRE_TIPO = Column(String(2))

class RolUsuario(Base):
    __tablename__ = "ROLES_USUARIO"
    ID_ROL = Column(Integer, primary_key=True)
    NOMBRE_ROL = Column(String(50))

class Cliente(Base):
    __tablename__ = "CLIENTES"
    ID_CLIENTE = Column(Integer, primary_key=True, index=True)
    NOMBRE_CLIENTE = Column(String(100))
    APELLIDO_CLIENTE = Column(String(100))
    ID_TIPO_DOCUMENTO_C = Column(Integer, ForeignKey("TIPOS_DOCUMENTO.ID_TIPO_DOCUMENTO"))
    DOCUMENTO_CLIENTE = Column(BigInteger, unique=True)
    TELEFONO_CLIENTE = Column(BigInteger)
    CORREO_CLIENTE = Column(String(100), unique=True)
    DIRECCION_CLIENTE = Column(String(150))
    CONTRASEÑA_CLIENTE = Column(String(100))
    is_active = Column(Boolean, default=False)
    verification_token = Column(String(100), unique=True, nullable=True)

class Usuario(Base):
    __tablename__ = "USUARIOS"
    ID_USUARIO = Column(Integer, primary_key=True, index=True)
    NOMBRE_USUARIO = Column(String(100))
    APELLIDO_USUARIO = Column(String(100))
    ID_TIPO_DOCUMENTO_U = Column(Integer, ForeignKey("TIPOS_DOCUMENTO.ID_TIPO_DOCUMENTO"))
    DOCUMENTO_USUARIO = Column(BigInteger, unique=True)
    TELEFONO_USUARIO = Column(BigInteger)
    CORREO_USUARIO = Column(String(100), unique=True)
    CONTRASEÑA_USUARIO = Column(String(100))
    ID_ROL_U = Column(Integer, ForeignKey("ROLES_USUARIO.ID_ROL"))

class PasswordResetToken(Base):
    __tablename__ = "PASSWORD_RESET_TOKENS"
    id = Column(Integer, primary_key=True, index=True)
    email_usuario = Column(String(100), nullable=True)
    email_cliente = Column(String(100), nullable=True)
    token = Column(String(100), nullable=True)
    code = Column(String(6), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)