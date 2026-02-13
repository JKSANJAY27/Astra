"""Sandboxes API router for publishing and retrieving architectures"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import secrets
import logging

from app.models.sandbox import SandboxCreate, SandboxResponse
from app.db.mongodb import get_sandboxes_collection

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/sandboxes", tags=["sandboxes"])


@router.post("", response_model=SandboxResponse, status_code=201)
async def publish_sandbox(sandbox: SandboxCreate) -> SandboxResponse:
    """
    Publish architecture to sandboxes gallery
    
    Processing:
    1. Generate unique 8-character sandbox ID
    2. Extract tech stack from nodes
    3. Calculate total cost from architecture
    4. Create MongoDB document
    5. Return sandbox response
    """
    collection = get_sandboxes_collection()
    
    # Step 1: Generate unique 8-character ID
    sandbox_id = secrets.token_urlsafe(6)[:8]
    
    # Ensure uniqueness (retry if collision)
    max_retries = 5
    for _ in range(max_retries):
        existing = await collection.find_one({"sandboxId": sandbox_id})
        if not existing:
            break
        sandbox_id = secrets.token_urlsafe(6)[:8]
    else:
        raise HTTPException(500, "Failed to generate unique sandbox ID")
    
    # Step 2: Extract tech stack from nodes
    arch_json = sandbox.architectureJson.model_dump()
    tech_stack = []
    for node in arch_json.get("nodes", []):
        component_name = node.get("data", {}).get("label", "")
        if component_name:
            tech_stack.append(component_name)
    tech_stack = sorted(list(set(tech_stack)))  # Remove duplicates and sort
    
    # Step 3: Extract total cost
    total_cost = arch_json.get("costEstimate", {}).get("total", 0.0) if arch_json.get("costEstimate") else 0.0
    
    # Step 4: Create document
    now = datetime.utcnow()
    document = {
        "sandboxId": sandbox_id,
        "projectName": sandbox.projectName,
        "description": sandbox.description,
        "architectureJson": arch_json,
        "techStack": tech_stack,
        "totalCost": total_cost,
        "createdAt": now,
        "updatedAt": now,
        "isPublic": True,
        "views": 0
    }
    
    # Step 5: Insert into MongoDB
    try:
        result = await collection.insert_one(document)
        logger.info(f"Created sandbox: {sandbox_id}")
    except Exception as e:
        logger.error(f"Failed to insert sandbox: {e}")
        raise HTTPException(500, "Failed to create sandbox")
    
    # Return response
    return SandboxResponse(
        sandboxId=sandbox_id,
        projectName=document["projectName"],
        description=document["description"],
        architectureJson=document["architectureJson"],
        techStack=document["techStack"],
        totalCost=document["totalCost"],
        createdAt=document["createdAt"],
        updatedAt=document["updatedAt"],
        isPublic=document["isPublic"],
        views=document["views"]
    )


@router.get("/{sandbox_id}", response_model=SandboxResponse)
async def get_sandbox(sandbox_id: str) -> SandboxResponse:
    """
    Get sandbox by ID and increment view counter
    """
    collection = get_sandboxes_collection()
    
    # Find and increment views atomically
    document = await collection.find_one_and_update(
        {"sandboxId": sandbox_id},
        {"$inc": {"views": 1}},
        return_document=True  # Return updated document
    )
    
    if not document:
        raise HTTPException(404, "Sandbox not found")
    
    # Remove MongoDB _id field
    document.pop("_id", None)
    
    return SandboxResponse(**document)


@router.get("", response_model=List[SandboxResponse])
async def list_sandboxes(
    search: Optional[str] = Query(None, description="Search project names"),
    tech_stack: Optional[str] = Query(None, description="Comma-separated tech stack filter"),
    min_cost: Optional[float] = Query(None, description="Minimum cost filter"),
    max_cost: Optional[float] = Query(None, description="Maximum cost filter"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    skip: int = Query(0, ge=0, description="Pagination offset")
) -> List[SandboxResponse]:
    """
    List sandboxes with filters and pagination
    
    Query parameters:
    - search: Regex search on project name (case-insensitive)
    - tech_stack: Filter by technologies (comma-separated)
    - min_cost/max_cost: Cost range filter
    - limit: Results per page (1-100, default 20)
    - skip: Pagination offset
    """
    collection = get_sandboxes_collection()
    
    # Build query
    query = {"isPublic": True}
    
    if search:
        query["projectName"] = {"$regex": search, "$options": "i"}
    
    if tech_stack:
        tech_list = [t.strip() for t in tech_stack.split(",")]
        query["techStack"] = {"$in": tech_list}
    
    if min_cost is not None or max_cost is not None:
        cost_query = {}
        if min_cost is not None:
            cost_query["$gte"] = min_cost
        if max_cost is not None:
            cost_query["$lte"] = max_cost
        query["totalCost"] = cost_query
    
    # Execute query with pagination
    cursor = collection.find(query).sort("createdAt", -1).skip(skip).limit(limit)
    documents = await cursor.to_list(length=limit)
    
    # Remove MongoDB _id fields
    for doc in documents:
        doc.pop("_id", None)
    
    return [SandboxResponse(**doc) for doc in documents]
