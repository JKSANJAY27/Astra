"""Architecture generation service for creating node layouts and edges"""
from typing import List, Dict, Set
import secrets
import logging

from app.models.architecture import (
    Node, Edge, NodeData, NodePosition, Scope,
    ArchitectureJson, CostEstimate
)
from app.data.components_data import get_component_by_id
from app.services.connection_validator import ConnectionValidator
from app.services.cost_calculator import CostCalculator

logger = logging.getLogger(__name__)


class ArchitectureService:
    """Generate architecture diagrams from component lists"""
    
    # Layout constants
    HORIZONTAL_SPACING = 300
    VERTICAL_SPACING = 150
    START_X = 100
    START_Y = 100
    
    # Category layers (left to right flow)
    CATEGORY_LAYERS = {
        "frontend": 0,
        "infrastructure": 1,
        "backend": 2,
        "authentication": 2,
        "database": 3,
        "storage": 3,
        "messaging": 3,
        "search": 3,
        "ai_ml": 3,
        "email": 3,
        "payment": 3,
        "hosting": 4,
        "monitoring": 5,
        "analytics": 5,
        "cicd": 6,
    }
    
    @staticmethod
    def generate_node_id(component_id: str) -> str:
        """Generate unique node ID: {componentId}-{8char-uuid}"""
        random_suffix = secrets.token_urlsafe(6)[:8]
        return f"{component_id}-{random_suffix}"
    
    @staticmethod
    def calculate_node_position(
        layer: int,
        index_in_layer: int
    ) -> NodePosition:
        """Calculate node position based on layer and index"""
        x = ArchitectureService.START_X + (layer * ArchitectureService.HORIZONTAL_SPACING)
        y = ArchitectureService.START_Y + (index_in_layer * ArchitectureService.VERTICAL_SPACING)
        return NodePosition(x=x, y=y)
    
    @staticmethod
    def create_node_from_component(
        component_id: str,
        position: NodePosition
    ) -> Node:
        """Create a Node from component ID"""
        component = get_component_by_id(component_id)
        if not component:
            logger.warning(f"Component not found: {component_id}")
            return None
        
        node_id = ArchitectureService.generate_node_id(component_id)
        
        # Get icon URL (using SimpleIcons CDN)
        icon_name = component_id.replace("_", "").replace("-", "")
        icon_color = "000000"  # Default black
        icon_url = f"https://cdn.simpleicons.org/{icon_name}/{icon_color}"
        
        node_data = NodeData(
            label=component["name"],
            componentId=component_id,
            category=component["category"],
            icon=icon_url,
            color="#3b82f6",  # Default blue
            config={}
        )
        
        return Node(
            id=node_id,
            type="custom",
            position=position,
            data=node_data
        )
    
    @staticmethod
    def generate_edges(nodes: List[Node]) -> List[Edge]:
        """Generate edges between nodes based on category relationships"""
        edges = []
        node_by_id = {node.id: node for node in nodes}
        
        # Group nodes by category
        nodes_by_category: Dict[str, List[Node]] = {}
        for node in nodes:
            category = node.data.category
            if category not in nodes_by_category:
                nodes_by_category[category] = []
            nodes_by_category[category].append(node)
        
        # Create edges based on valid connections
        for source_node in nodes:
            source_category = source_node.data.category
            valid_targets = ConnectionValidator.get_valid_targets(source_category)
            
            for target_category in valid_targets:
                if target_category not in nodes_by_category:
                    continue
                
                # Connect to first matching node in target category
                target_nodes = nodes_by_category[target_category]
                if target_nodes:
                    target_node = target_nodes[0]
                    
                    # Avoid duplicate edges
                    edge_id = f"e{secrets.token_urlsafe(6)[:8]}"
                    
                    # Determine handle positions based on node positions
                    source_handle = "right" if source_node.position.x < target_node.position.x else "bottom"
                    target_handle = "left" if source_node.position.x < target_node.position.x else "top"
                    
                    edge = Edge(
                        id=edge_id,
                        source=source_node.id,
                        target=target_node.id,
                        sourceHandle=source_handle,
                        targetHandle=target_handle,
                        type="custom"
                    )
                    edges.append(edge)
        
        return edges
    
    @staticmethod
    def generate_architecture_from_components(
        component_ids: List[str],
        scope: Scope
    ) -> ArchitectureJson:
        """
        Generate complete architecture from component IDs
        
        Args:
            component_ids: List of component IDs to include
            scope: Project scope for cost calculation
        
        Returns:
            Complete ArchitectureJson with nodes, edges, and costs
        """
        # Group components by layer
        layers: Dict[int, List[str]] = {}
        for comp_id in component_ids:
            component = get_component_by_id(comp_id)
            if not component:
                continue
            
            category = component["category"]
            layer = ArchitectureService.CATEGORY_LAYERS.get(category, 3)
            
            if layer not in layers:
                layers[layer] = []
            layers[layer].append(comp_id)
        
        # Create nodes with positions
        nodes = []
        for layer_num in sorted(layers.keys()):
            components_in_layer = layers[layer_num]
            for idx, comp_id in enumerate(components_in_layer):
                position = ArchitectureService.calculate_node_position(layer_num, idx)
                node = ArchitectureService.create_node_from_component(comp_id, position)
                if node:
                    nodes.append(node)
        
        # Generate edges
        edges = ArchitectureService.generate_edges(nodes)
        
        # Calculate costs
        cost_data = CostCalculator.calculate_architecture_cost(component_ids, scope)
        cost_estimate = CostEstimate(
            total=cost_data["total"],
            breakdown=cost_data["breakdown"]
        )
        
        # Build architecture JSON
        architecture = ArchitectureJson(
            nodes=nodes,
            edges=edges,
            scope=scope,
            costEstimate=cost_estimate,
            timestamp=None  # Will be set by frontend
        )
        
        logger.info(f"Generated architecture with {len(nodes)} nodes and {len(edges)} edges")
        return architecture


# Singleton instance
_architecture_service: ArchitectureService = None


def get_architecture_service() -> ArchitectureService:
    """Get or create Architecture service singleton"""
    global _architecture_service
    if _architecture_service is None:
        _architecture_service = ArchitectureService()
    return _architecture_service
