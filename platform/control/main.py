from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import usersRouter, authRouter
from exceptions import validation, dbconnection
from core import settings
from utils import email
import db


app = FastAPI(title="GitShip API", lifespan=settings.APILifespan)
app.include_router(usersRouter.router)
app.include_router(authRouter.router)

# Custom Exceptions
validation.setValidationException(app)
dbconnection.setDBConnectionError(app)

# Initialize Database
db.InitializeORM(app, settings.DB_URI)

# Initialize Cache Database
_ = db.CACHE

# Initialize Email Server
_ = email.EMAIL

# Initialize CORS Middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=[settings.FRONTEND_URL],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
