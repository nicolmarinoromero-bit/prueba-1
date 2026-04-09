import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.email_utils import send_reset_email
from app.config import settings

async def test():
    print("=" * 50)
    print("Prueba de envío de correo - Neodomus")
    print("=" * 50)
    print(f"SMTP Host: {settings.SMTP_HOST}")
    print(f"SMTP User: {settings.SMTP_USER}")
    print("=" * 50)
    
    correo_destino = input("Ingresa tu correo para recibir la prueba: ")
    
    print(f"\nEnviando correo de prueba a: {correo_destino}")
    
    try:
        await send_reset_email(
            to_email=correo_destino,
            reset_link=f"{settings.FRONTEND_URL}/reset-password?token=test_token_123456"
        )
        print("\n✅ ¡Correo enviado exitosamente!")
        print(f"Revisa la bandeja de entrada o spam de {correo_destino}")
    except Exception as e:
        print(f"\n❌ Error al enviar el correo: {e}")
        print("\nPosibles soluciones:")
        print("1. Verifica que la contraseña de aplicación de Gmail sea correcta")
        print("2. Asegúrate de que la verificación en dos pasos esté activada")
        print("3. Revisa tu conexión a internet")

if __name__ == "__main__":
    asyncio.run(test())