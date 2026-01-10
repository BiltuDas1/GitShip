from fastapi import FastAPI
from routers import usersRouter
from exceptions import validation, dbconnection
from core import settings
from utils import email
import db


app = FastAPI(title="GitShip API", lifespan=settings.APILifespan)
app.include_router(usersRouter.router)

# Custom Exceptions
validation.setValidationException(app)
dbconnection.setDBConnectionError(app)

# Initialize Database
settings.InitializeORM(app)

# Initialize Cache Database
_ = db.CACHE

# Initialize Email Server
_ = email.EMAIL
