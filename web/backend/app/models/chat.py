"""Pydantic models for chat API"""
from typing import Optional, Literal
from pydantic import BaseModel
from app.models.architecture import ArchitectureJson


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str
    session_id: Optional[str] = None
    architecture_json: ArchitectureJson
    chat_width: Optional[int] = 600


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    message: str
    session_id: str
    suggest_implementation: bool = False
    updated_architecture: Optional[ArchitectureJson] = None
    canvas_action: Literal["update", "clear", "none"] = "none"
    updated_scope: Optional[dict] = None


class ImplementRequest(BaseModel):
    """Request model for implementation endpoint"""
    implementation_request: str
    session_id: str
    architecture_json: ArchitectureJson


class ImplementResponse(BaseModel):
    """Response model for implementation endpoint"""
    updated_architecture: ArchitectureJson
    explanation: str
