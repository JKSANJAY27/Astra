"""Pydantic models for architecture components"""
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class NodeData(BaseModel):
    """Data payload for a canvas node"""
    label: str
    componentId: str
    category: str
    icon: Optional[str] = None
    color: Optional[str] = None
    config: Optional[Dict[str, Any]] = Field(default_factory=dict)


class NodePosition(BaseModel):
    """Position coordinates for a node"""
    x: float
    y: float


class Node(BaseModel):
    """Canvas node representing a component"""
    id: str
    type: str = "custom"
    position: NodePosition
    data: NodeData


class Edge(BaseModel):
    """Connection between two nodes"""
    id: str
    source: str
    target: str
    sourceHandle: Optional[Literal["top", "right", "bottom", "left"]] = None
    targetHandle: Optional[Literal["top", "right", "bottom", "left"]] = None
    type: str = "custom"


class Scope(BaseModel):
    """Project scope parameters for cost calculation"""
    users: int = 1000
    trafficLevel: int = Field(default=3, ge=1, le=5)
    dataVolumeGB: float = 100.0
    regions: int = 1
    availability: float = 99.9


class CostBreakdown(BaseModel):
    """Individual component cost breakdown"""
    category: str
    component: str
    componentId: str
    baseCost: float
    scaledCost: float


class CostEstimate(BaseModel):
    """Total cost estimation with breakdown"""
    total: float
    breakdown: List[CostBreakdown]


class ArchitectureJson(BaseModel):
    """Complete architecture state"""
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
    scope: Scope = Field(default_factory=Scope)
    costEstimate: Optional[CostEstimate] = None
    timestamp: Optional[int] = None
