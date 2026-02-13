"""Connection validation rules for architecture components"""
from typing import Set, Tuple


class ConnectionValidator:
    """Validate connections between architecture components"""
    
    # Valid connection patterns: (source_category, target_category)
    VALID_CONNECTIONS: Set[Tuple[str, str]] = {
        # Frontend can connect to backend and APIs
        ("frontend", "backend"),
        ("frontend", "authentication"),
        ("frontend", "hosting"),
        ("frontend", "infrastructure"),  # CDN
        
        # Backend can connect to databases, storage, services
        ("backend", "database"),
        ("backend", "storage"),
        ("backend", "authentication"),
        ("backend", "ai_ml"),
        ("backend", "messaging"),
        ("backend", "email"),
        ("backend", "payment"),
        ("backend", "search"),
        ("backend", "hosting"),
        
        # Infrastructure connections
        ("infrastructure", "frontend"),
        ("infrastructure", "backend"),
        ("infrastructure", "database"),
        
        # Backend to backend (microservices)
        ("backend", "backend"),
        
        # Hosting to compute
        ("hosting", "backend"),
        ("hosting", "frontend"),
        
        # Database to storage (backups)
        ("database", "storage"),
        
        # Monitoring can monitor anything
        ("monitoring", "frontend"),
        ("monitoring", "backend"),
        ("monitoring", "database"),
        ("monitoring", "infrastructure"),
        ("monitoring", "hosting"),
        
        # Analytics can track frontend
        ("analytics", "frontend"),
        ("analytics", "backend"),
        
        # CI/CD can deploy to hosting
        ("cicd", "hosting"),
        ("cicd", "infrastructure"),
        
        # Messaging connections
        ("backend", "messaging"),
        ("messaging", "backend"),
    }
    
    @staticmethod
    def is_valid_connection(source_category: str, target_category: str) -> bool:
        """Check if a connection between two categories is valid"""
        return (source_category, target_category) in ConnectionValidator.VALID_CONNECTIONS
    
    @staticmethod
    def get_valid_targets(source_category: str) -> Set[str]:
        """Get all valid target categories for a source category"""
        return {
            target for (src, target) in ConnectionValidator.VALID_CONNECTIONS
            if src == source_category
        }
    
    @staticmethod
    def get_valid_sources(target_category: str) -> Set[str]:
        """Get all valid source categories for a target category"""
        return {
            source for (source, tgt) in ConnectionValidator.VALID_CONNECTIONS
            if tgt == target_category
        }
