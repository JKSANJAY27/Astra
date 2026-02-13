"""Pydantic models for sandbox persistence"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.models.architecture import ArchitectureJson


class SandboxCreate(BaseModel):
    """Request model for creating a sandbox"""
    projectName: str
    description: Optional[str] = None
    architectureJson: ArchitectureJson


class SandboxResponse(BaseModel):
    """Response model for sandbox document"""
    sandboxId: str
    projectName: str
    description: Optional[str] = None
    architectureJson: dict
    techStack: List[str]
    totalCost: float
    createdAt: datetime
    updatedAt: datetime
    isPublic: bool = True
    views: int = 0
