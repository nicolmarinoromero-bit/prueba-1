import aiosmtplib
from email.message import EmailMessage
from .config import settings

async def send_reset_code_email(to_email: str, code: str):
    message = EmailMessage()
    message["From"] = settings.SMTP_USER
    message["To"] = to_email
    message["Subject"] = "Código de verificación - Neodomus"
    message.set_content(f"""
Hola,

Has solicitado restablecer tu contraseña.

Tu código de verificación es: {code}

Este código expirará en 10 minutos.

Si no solicitaste este cambio, ignora este mensaje.

Saludos,
Equipo Neodomus
""")
    
    await aiosmtplib.send(
        message,
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        username=settings.SMTP_USER,
        password=settings.SMTP_PASSWORD,
        start_tls=True,
    )