from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginRequest(BaseModel):
    correo: EmailStr
    contraseña: str

class RegisterClienteRequest(BaseModel):
    nombre: str
    apellido: str
    tipo_documento: int
    documento: int
    telefono: int
    correo: EmailStr
    direccion: str
    contraseña: str = Field(..., min_length=6)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: Optional[str] = None
    nombre: Optional[str] = None