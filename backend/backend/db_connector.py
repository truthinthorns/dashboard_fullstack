import motor.motor_asyncio
from beanie import init_beanie

from backend.models.todo import Todo
from backend.models.user import MongoUser
from settings import settings


async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(
        f"mongodb://{settings.mongo_username}:{settings.mongo_password}@mongo:27017"
    )
    await init_beanie(database=client["db"], document_models=[MongoUser, Todo])
