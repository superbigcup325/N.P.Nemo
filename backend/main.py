from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.error_handler import setup_error_handlers
from routers import game

app = FastAPI(
    title="N.P.Nemo API",
    description="Backend API for N.P.Nemo card game",
    version="0.1.0"
)

setup_error_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game.router, prefix="/game", tags=["game"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}
