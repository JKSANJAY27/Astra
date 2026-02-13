"""MongoDB async client connection management"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    """MongoDB singleton client"""
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(settings.mongodb_uri)
            # Test connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Create indexes
            await cls.create_indexes()
        except Exception as e:
            logger.warning(f"MongoDB unavailable (sandboxes gallery will be disabled): {e}")
            cls.client = None  # Set to None instead of raising
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("Closed MongoDB connection")
    
    @classmethod
    async def create_indexes(cls):
        """Create indexes for collections"""
        db = cls.get_database()
        sandboxes = db["sandboxes"]
        
        # Unique index on sandboxId
        await sandboxes.create_index("sandboxId", unique=True)
        
        # Compound index for listing
        await sandboxes.create_index([("isPublic", 1), ("createdAt", -1)])
        
        # Tech stack index
        await sandboxes.create_index("techStack")
        
        # Cost index
        await sandboxes.create_index("totalCost")
        
        # Text index for project name search
        await sandboxes.create_index([("projectName", "text")])
        
        logger.info("Created MongoDB indexes")
    
    @classmethod
    def get_database(cls):
        """Get database instance"""
        if not cls.client:
            logger.warning("MongoDB not connected")
            return None
        return cls.client["astra-sandbox"]
    
    @classmethod
    def get_sandboxes_collection(cls):
        """Get sandboxes collection"""
        return cls.get_database()["sandboxes"]


# Convenience functions
async def get_database():
    """Get database instance"""
    return MongoDB.get_database()


async def get_sandboxes_collection():
    """Get sandboxes collection"""
    return MongoDB.get_sandboxes_collection()
