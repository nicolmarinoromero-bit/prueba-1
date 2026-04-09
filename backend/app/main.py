from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from .routers.auth import router as auth_router
from .routers.clientes import router as clientes_router
from .routers.usuarios import router as usuarios_router
from .routers.productos import router as productos_router

app = FastAPI(title="Neodomus API", version="1.0")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    return response

app.include_router(auth_router)
app.include_router(clientes_router)
app.include_router(usuarios_router)
app.include_router(productos_router)

@app.get("/")
def root():
    return {"message": "Bienvenido a la API de Neodomus"}