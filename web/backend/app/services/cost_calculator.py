"""Cost calculation service with scaling algorithms"""
from typing import List, Dict, Any
from app.models.architecture import Scope, CostBreakdown
from app.data.components_data import get_component_by_id


class CostCalculator:
    """Calculate infrastructure costs based on scope"""
    
    # Traffic level multipliers (1-5)
    TRAFFIC_MULTIPLIERS = {
        1: 1.0,    # Low traffic
        2: 1.5,    # Medium-low traffic
        3: 2.0,    # Medium traffic
        4: 3.0,    # High traffic
        5: 5.0,    # Very high traffic
    }
    
    # User count scaling tiers
    USER_TIERS = [
        (1000, 1.0),
        (10000, 1.5),
        (100000, 2.5),
        (1000000, 4.0),
        (float('inf'), 6.0),
    ]
    
    # Data volume cost per GB
    DATA_COST_PER_GB = 0.023  # AWS S3 standard pricing
    
    # Regional multipliers
    REGION_MULTIPLIERS = {
        1: 1.0,
        2: 1.3,
        3: 1.5,
        4: 1.8,
    }
    
    # Availability tier multipliers
    AVAILABILITY_MULTIPLIERS = {
        99.0: 1.0,
        99.9: 1.2,
        99.95: 1.4,
        99.99: 1.7,
        99.999: 2.5,
    }
    
    @staticmethod
    def get_user_multiplier(users: int) -> float:
        """Get scaling multiplier based on user count"""
        for threshold, multiplier in CostCalculator.USER_TIERS:
            if users <= threshold:
                return multiplier
        return 6.0
    
    @staticmethod
    def get_traffic_multiplier(traffic_level: int) -> float:
        """Get multiplier for traffic level (1-5)"""
        return CostCalculator.TRAFFIC_MULTIPLIERS.get(traffic_level, 2.0)
    
    @staticmethod
    def get_region_multiplier(regions: int) -> float:
        """Get multiplier for multi-region deployment"""
        if regions >= 4:
            return 1.8
        return CostCalculator.REGION_MULTIPLIERS.get(regions, 1.0)
    
    @staticmethod
    def get_availability_multiplier(availability: float) -> float:
        """Get multiplier for availability SLA"""
        # Find closest availability tier
        for tier, multiplier in CostCalculator.AVAILABILITY_MULTIPLIERS.items():
            if availability <= tier:
                return multiplier
        return 2.5
    
    @staticmethod
    def calculate_component_cost(
        component_id: str,
        scope: Scope
    ) -> tuple[float, float]:
        """
        Calculate cost for a single component
        Returns: (base_cost, scaled_cost)
        """
        component = get_component_by_id(component_id)
        if not component:
            return (0.0, 0.0)
        
        base_cost = component["base_cost"]
        
        # Free tier components
        if base_cost == 0:
            return (0.0, 0.0)
        
        # Apply scaling factors
        user_mult = CostCalculator.get_user_multiplier(scope.users)
        traffic_mult = CostCalculator.get_traffic_multiplier(scope.trafficLevel)
        region_mult = CostCalculator.get_region_multiplier(scope.regions)
        availability_mult = CostCalculator.get_availability_multiplier(scope.availability)
        
        # Category-specific scaling
        category = component["category"]
        
        if category in ["database", "storage"]:
            # Database and storage scale heavily with data volume
            data_cost = scope.dataVolumeGB * CostCalculator.DATA_COST_PER_GB
            scaled_cost = (
                base_cost * user_mult * traffic_mult * region_mult * availability_mult
                + data_cost
            )
        elif category in ["hosting", "infrastructure"]:
            # Compute resources scale with traffic and users
            scaled_cost = base_cost * user_mult * traffic_mult * region_mult * availability_mult
        elif category in ["ai_ml", "search"]:
            # AI/ML and search scale primarily with usage
            scaled_cost = base_cost * user_mult * traffic_mult
        elif category in ["monitoring", "analytics"]:
            # Monitoring scales with infrastructure size
            scaled_cost = base_cost * region_mult * availability_mult
        else:
            # Default scaling for other categories
            scaled_cost = base_cost * user_mult * traffic_mult
        
        return (base_cost, round(scaled_cost, 2))
    
    @staticmethod
    def calculate_architecture_cost(
        component_ids: List[str],
        scope: Scope
    ) -> Dict[str, Any]:
        """
        Calculate total cost for architecture
        Returns: {total: float, breakdown: List[CostBreakdown]}
        """
        breakdown = []
        total = 0.0
        
        for component_id in component_ids:
            component = get_component_by_id(component_id)
            if not component:
                continue
            
            base_cost, scaled_cost = CostCalculator.calculate_component_cost(
                component_id, scope
            )
            
            breakdown.append(CostBreakdown(
                category=component["category"],
                component=component["name"],
                componentId=component_id,
                baseCost=base_cost,
                scaledCost=scaled_cost
            ))
            
            total += scaled_cost
        
        return {
            "total": round(total, 2),
            "breakdown": breakdown
        }
