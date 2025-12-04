from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, generate

app = FastAPI(
    title="Grama-AI Backend",
    version="1.0.0",
    description="AI-powered rural planning backend"
)

# Allow frontend (React) to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(generate.router)

@app.get("/")
def root():
    return {"message": "Grama-AI backend is running"}
