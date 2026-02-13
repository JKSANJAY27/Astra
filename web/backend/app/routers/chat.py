"""Chat API router with AI integration and architecture generation"""
from fastapi import APIRouter, HTTPException
from typing import Dict, List
import uuid
import re
import json
import logging

from app.models.chat import ChatRequest, ChatResponse, ImplementRequest, ImplementResponse
from app.services.gemini_service import get_gemini_service
from app.services.rag_service import get_rag_service
from app.services.architecture_service import get_architecture_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

# In-memory session storage
sessions: Dict[str, List[Dict[str, str]]] = {}


def get_or_create_session(session_id: str | None) -> str:
    """Get existing session or create new one"""
    if session_id and session_id in sessions:
        return session_id
    
    new_session_id = str(uuid.uuid4())
    sessions[new_session_id] = []
    return new_session_id


def detect_canvas_intent(message: str) -> bool:
    """Detect if user wants to see architecture on canvas"""
    message_lower = message.lower()
    
    # Direct triggers
    direct_triggers = ["canvas", "diagram", "visualize", "visualization", "draw", "sure", "show"]
    if any(trigger in message_lower for trigger in direct_triggers):
        return True
    
    # Architecture terms
    architecture_terms = ["architecture", "system", "stack", "setup", "infrastructure"]
    
    # Action words
    action_words = ["create", "design", "build", "make", "show", "implement", "set up", "add", "sure"]
    
    # Check for combination
    has_architecture = any(term in message_lower for term in architecture_terms)
    has_action = any(action in message_lower for action in action_words)
    
    return has_architecture and has_action


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint with RAG context and architecture generation
    
    Processing flow:
    1. Get or create session
    2. Retrieve RAG context from FAISS
    3. Generate AI response with Gemini
    4. Update session history
    5. Detect canvas intent
    6. Generate architecture if applicable
    7. Extract scope updates from JSON blocks
    8. Return response
    """
    # Step 1: Session management
    session_id = get_or_create_session(request.session_id)
    session_history = sessions[session_id]
    
    # Step 2: RAG context retrieval (vector search - no API call)
    rag_service = get_rag_service()
    context = rag_service.retrieve_context(request.message)
    
    # Step 3: Prepare scope dictionary
    scope_dict = {
        "users": request.architecture_json.scope.users,
        "trafficLevel": request.architecture_json.scope.trafficLevel,
        "dataVolumeGB": request.architecture_json.scope.dataVolumeGB,
        "regions": request.architecture_json.scope.regions,
        "availability": request.architecture_json.scope.availability,
    }
    
    # Step 4: Generate AI response (single Gemini API call)
    gemini_service = get_gemini_service()
    response_text = gemini_service.generate_response(
        user_message=request.message,
        context=context,
        conversation_history=session_history,
        chat_width=request.chat_width,
        scope=scope_dict
    )
    
    # Step 5: Update session history
    session_history.append({"role": "user", "content": request.message})
    session_history.append({"role": "assistant", "content": response_text})
    
    # Step 6: Canvas intent detection
    canvas_intent = detect_canvas_intent(request.message)
    
    # Step 7: Architecture generation (if applicable)
    updated_architecture = None
    canvas_action = "none"
    
    if canvas_intent:
        # Extract component IDs from user message + AI response
        combined_text = request.message + " " + response_text
        mentioned_components = gemini_service.extract_component_ids_from_text(combined_text)
        
        if mentioned_components and len(mentioned_components) > 0:
            logger.info(f"Generating architecture from components: {mentioned_components}")
            arch_service = get_architecture_service()
            updated_architecture = arch_service.generate_architecture_from_components(
                component_ids=mentioned_components,
                scope=request.architecture_json.scope
            )
            canvas_action = "update"
    
    # Step 8: Scope extraction from JSON blocks
    updated_scope = None
    json_match = re.search(r"```json\s*(\{.*?\})\s*```", response_text, re.DOTALL)
    if json_match:
        try:
            data = json.loads(json_match.group(1))
            if "scope_analysis" in data:
                analysis = data["scope_analysis"]
                updated_scope = {
                    "users": analysis.get("users"),
                    "trafficLevel": analysis.get("trafficLevel"),
                    "dataVolumeGB": analysis.get("dataVolumeGB"),
                    "regions": analysis.get("regions"),
                    "availability": analysis.get("availability")
                }
                # Filter out None values
                updated_scope = {k: v for k, v in updated_scope.items() if v is not None}
                
                # Remove JSON block from visible response
                response_text = response_text.replace(json_match.group(0), "").strip()
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse JSON from response: {e}")
    
    # Step 9: Legacy implementation suggestion
    suggest_implementation = any(
        keyword in request.message.lower()
        for keyword in ["implement", "create", "build", "design", "set up", "add"]
    )
    
    # Step 10: Return response
    return ChatResponse(
        message=response_text,
        session_id=session_id,
        suggest_implementation=suggest_implementation,
        updated_architecture=updated_architecture,
        canvas_action=canvas_action,
        updated_scope=updated_scope
    )


@router.post("/implement", response_model=ImplementResponse)
async def implement(request: ImplementRequest) -> ImplementResponse:
    """
    Architecture modification endpoint (placeholder for future implementation)
    """
    # TODO: Implement architecture modification logic
    # For now, return architecture as-is with explanation
    return ImplementResponse(
        updated_architecture=request.architecture_json,
        explanation="Architecture implementation is coming soon. For now, you can manually modify the architecture on the canvas."
    )


@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """
    Get session history
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session_id,
        "messages": sessions[session_id]
    }


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """
    Delete session and clear history
    """
    if session_id in sessions:
        del sessions[session_id]
        return {"message": "Session deleted"}
    
    raise HTTPException(status_code=404, detail="Session not found")
