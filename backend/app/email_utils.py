import aiosmtplib
from email.message import EmailMessage
from .config import settings

async def send_reset_email(to_email: str, reset_link: str):
    message = EmailMessage()
    message["From"] = settings.SMTP_USER
    message["To"] = to_email
    message["Subject"] = "Recuperación de contraseña - Neodomus"
    message.set_content(f"""
Hola,

Has solicitado restablecer tu contraseña.

Haz clic en el siguiente enlace para crear una nueva contraseña:
{reset_link}

Si no solicitaste este cambio, ignora este mensaje.

El enlace expirará en 1 hora.

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