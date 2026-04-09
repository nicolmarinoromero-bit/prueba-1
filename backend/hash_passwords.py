import pymysql
import bcrypt

def hash_password(pwd: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd.encode('utf-8'), salt).decode('utf-8')

print("Conectando a la base de datos...")

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='123456789.',
    database='neodomus'
)
cursor = conn.cursor()

cursor.execute("SELECT id_cliente, contraseña_cliente FROM clientes")
for id_cli, pwd in cursor.fetchall():
    if pwd and not pwd.startswith('$2b$'):
        hashed = hash_password(pwd)
        cursor.execute("UPDATE clientes SET contraseña_cliente = %s WHERE id_cliente = %s", (hashed, id_cli))
        print(f"Cliente ID {id_cli} actualizado")

cursor.execute("SELECT id_usuario, contraseña_usuario FROM usuarios")
for id_usr, pwd in cursor.fetchall():
    if pwd and not pwd.startswith('$2b$'):
        hashed = hash_password(pwd)
        cursor.execute("UPDATE usuarios SET contraseña_usuario = %s WHERE id_usuario = %s", (hashed, id_usr))
        print(f"Usuario ID {id_usr} actualizado")

conn.commit()
cursor.close()
conn.close()
print("Listo. Todas las contraseñas ahora son hashes bcrypt.")