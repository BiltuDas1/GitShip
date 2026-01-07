from fastapi import FastAPI
from routers import authRoutes
from exceptions import validation, dbconnection
from core import settings

app = FastAPI(title="GitShip API", lifespan=settings.APILifespan)
app.include_router(authRoutes.router)

# Custom Exceptions
validation.setValidationException(app)
dbconnection.setDBConnectionError(app)

# Initialize Database
settings.InitializeORM(app)
