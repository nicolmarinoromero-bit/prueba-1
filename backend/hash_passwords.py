import pymysql
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def safe_hash(password):
    """Trunca la contraseña a 72 bytes si es necesario (límite de bcrypt)"""
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            password = password_bytes[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

print("Conectando a la base de datos...")

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='123456789.',
    database='neodomus'
)
cursor = conn.cursor()

# Actualizar clientes
cursor.execute("SELECT id_cliente, contraseña_cliente FROM clientes")
for id_cli, pwd in cursor.fetchall():
    if pwd and not pwd.startswith('$2b$'):
        try:
            hashed = safe_hash(pwd)
            cursor.execute("UPDATE clientes SET contraseña_cliente = %s WHERE id_cliente = %s", (hashed, id_cli))
            print(f"Cliente ID {id_cli} actualizado")
        except Exception as e:
            print(f"Error con cliente {id_cli}: {e}")

# Actualizar usuarios
cursor.execute("SELECT id_usuario, contraseña_usuario FROM usuarios")
for id_usr, pwd in cursor.fetchall():
    if pwd and not pwd.startswith('$2b$'):
        try:
            hashed = safe_hash(pwd)
            cursor.execute("UPDATE usuarios SET contraseña_usuario = %s WHERE id_usuario = %s", (hashed, id_usr))
            print(f"Usuario ID {id_usr} actualizado")
        except Exception as e:
            print(f"Error con usuario {id_usr}: {e}")

conn.commit()
cursor.close()
conn.close()
print("Listo. Todas las contraseñas ahora son hashes bcrypt.")