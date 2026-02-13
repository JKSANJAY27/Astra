"""Cloud components library with 74 components across categories"""
from typing import List, Dict, Any

# Component structure: id, name, category, pricing_tier, base_cost, description
COMPONENTS: List[Dict[str, Any]] = [
    # ==================== FRONTEND ====================
    {
        "id": "nextjs",
        "name": "Next.js",
        "category": "frontend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "React framework for production"
    },
    {
        "id": "react",
        "name": "React",
        "category": "frontend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "JavaScript library for building UIs"
    },
    {
        "id": "vue",
        "name": "Vue.js",
        "category": "frontend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Progressive JavaScript framework"
    },
    {
        "id": "angular",
        "name": "Angular",
        "category": "frontend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Platform for building web applications"
    },
    {
        "id": "svelte",
        "name": "Svelte",
        "category": "frontend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Cybernetically enhanced web apps"
    },
    
    # ==================== BACKEND ====================
    {
        "id": "fastapi",
        "name": "FastAPI",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Modern Python web framework"
    },
    {
        "id": "django",
        "name": "Django",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Python web framework"
    },
    {
        "id": "flask",
        "name": "Flask",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Lightweight Python framework"
    },
    {
        "id": "nodejs",
        "name": "Node.js",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "JavaScript runtime"
    },
    {
        "id": "express",
        "name": "Express.js",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Node.js web framework"
    },
    {
        "id": "nestjs",
        "name": "NestJS",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Progressive Node.js framework"
    },
    {
        "id": "springboot",
        "name": "Spring Boot",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Java application framework"
    },
    {
        "id": "golang",
        "name": "Go/Gin",
        "category": "backend",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Go web framework"
    },
    
    # ==================== DATABASES ====================
    {
        "id": "postgresql",
        "name": "PostgreSQL",
        "category": "database",
        "pricing_tier": "managed",
        "base_cost": 25,
        "description": "Relational database"
    },
    {
        "id": "mongodb",
        "name": "MongoDB",
        "category": "database",
        "pricing_tier": "managed",
        "base_cost": 25,
        "description": "NoSQL document database"
    },
    {
        "id": "mysql",
        "name": "MySQL",
        "category": "database",
        "pricing_tier": "managed",
        "base_cost": 20,
        "description": "Relational database"
    },
    {
        "id": "redis",
        "name": "Redis",
        "category": "database",
        "pricing_tier": "managed",
        "base_cost": 15,
        "description": "In-memory data structure store"
    },
    {
        "id": "elasticsearch",
        "name": "Elasticsearch",
        "category": "database",
        "pricing_tier": "managed",
        "base_cost": 40,
        "description": "Search and analytics engine"
    },
    {
        "id": "cassandra",
        "name": "Cassandra",
        "category": "database",
        "pricing_tier": "managed",
        "base_cost": 35,
        "description": "Distributed NoSQL database"
    },
    
    # ==================== HOSTING/DEPLOYMENT ====================
    {
        "id": "vercel",
        "name": "Vercel",
        "category": "hosting",
        "pricing_tier": "serverless",
        "base_cost": 20,
        "description": "Frontend cloud platform"
    },
    {
        "id": "netlify",
        "name": "Netlify",
        "category": "hosting",
        "pricing_tier": "serverless",
        "base_cost": 19,
        "description": "Web hosting platform"
    },
    {
        "id": "aws_ec2",
        "name": "AWS EC2",
        "category": "hosting",
        "pricing_tier": "compute",
        "base_cost": 50,
        "description": "Virtual servers"
    },
    {
        "id": "aws_lambda",
        "name": "AWS Lambda",
        "category": "hosting",
        "pricing_tier": "serverless",
        "base_cost": 10,
        "description": "Serverless compute"
    },
    {
        "id": "gcp_compute",
        "name": "GCP Compute Engine",
        "category": "hosting",
        "pricing_tier": "compute",
        "base_cost": 48,
        "description": "Virtual machines on GCP"
    },
    {
        "id": "gcp_cloud_run",
        "name": "Google Cloud Run",
        "category": "hosting",
        "pricing_tier": "serverless",
        "base_cost": 12,
        "description": "Serverless containers"
    },
    {
        "id": "azure_vm",
        "name": "Azure VM",
        "category": "hosting",
        "pricing_tier": "compute",
        "base_cost": 52,
        "description": "Virtual machines on Azure"
    },
    {
        "id": "heroku",
        "name": "Heroku",
        "category": "hosting",
        "pricing_tier": "platform",
        "base_cost": 25,
        "description": "Cloud application platform"
    },
    {
        "id": "digitalocean",
        "name": "DigitalOcean",
        "category": "hosting",
        "pricing_tier": "compute",
        "base_cost": 30,
        "description": "Cloud infrastructure provider"
    },
    
    # ==================== STORAGE ====================
    {
        "id": "aws_s3",
        "name": "AWS S3",
        "category": "storage",
        "pricing_tier": "object_storage",
        "base_cost": 5,
        "description": "Object storage"
    },
    {
        "id": "gcp_storage",
        "name": "Google Cloud Storage",
        "category": "storage",
        "pricing_tier": "object_storage",
        "base_cost": 5,
        "description": "Object storage on GCP"
    },
    {
        "id": "azure_blob",
        "name": "Azure Blob Storage",
        "category": "storage",
        "pricing_tier": "object_storage",
        "base_cost": 5,
        "description": "Object storage on Azure"
    },
    {
        "id": "cloudinary",
        "name": "Cloudinary",
        "category": "storage",
        "pricing_tier": "media_storage",
        "base_cost": 15,
        "description": "Media management platform"
    },
    
    # ==================== API GATEWAY / LOAD BALANCER ====================
    {
        "id": "nginx",
        "name": "Nginx",
        "category": "infrastructure",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Web server and reverse proxy"
    },
    {
        "id": "kong",
        "name": "Kong",
        "category": "infrastructure",
        "pricing_tier": "enterprise",
        "base_cost": 50,
        "description": "API gateway"
    },
    {
        "id": "aws_alb",
        "name": "AWS Application Load Balancer",
        "category": "infrastructure",
        "pricing_tier": "managed",
        "base_cost": 25,
        "description": "Load balancing service"
    },
    {
        "id": "cloudflare",
        "name": "Cloudflare",
        "category": "infrastructure",
        "pricing_tier": "cdn",
        "base_cost": 20,
        "description": "CDN and DDoS protection"
    },
    
    # ==================== AUTHENTICATION ====================
    {
        "id": "auth0",
        "name": "Auth0",
        "category": "authentication",
        "pricing_tier": "managed",
        "base_cost": 30,
        "description": "Authentication platform"
    },
    {
        "id": "firebase_auth",
        "name": "Firebase Auth",
        "category": "authentication",
        "pricing_tier": "managed",
        "base_cost": 10,
        "description": "Google authentication service"
    },
    {
        "id": "cognito",
        "name": "AWS Cognito",
        "category": "authentication",
        "pricing_tier": "managed",
        "base_cost": 15,
        "description": "User authentication service"
    },
    {
        "id": "clerk",
        "name": "Clerk",
        "category": "authentication",
        "pricing_tier": "managed",
        "base_cost": 25,
        "description": "Complete user management"
    },
    
    # ==================== AI/ML SERVICES ====================
    {
        "id": "openai",
        "name": "OpenAI API",
        "category": "ai_ml",
        "pricing_tier": "api",
        "base_cost": 50,
        "description": "GPT and AI models"
    },
    {
        "id": "gemini",
        "name": "Google Gemini",
        "category": "ai_ml",
        "pricing_tier": "api",
        "base_cost": 30,
        "description": "Google's AI model"
    },
    {
        "id": "anthropic",
        "name": "Anthropic Claude",
        "category": "ai_ml",
        "pricing_tier": "api",
        "base_cost": 45,
        "description": "Claude AI model"
    },
    {
        "id": "huggingface",
        "name": "Hugging Face",
        "category": "ai_ml",
        "pricing_tier": "api",
        "base_cost": 25,
        "description": "ML model hosting"
    },
    {
        "id": "aws_sagemaker",
        "name": "AWS SageMaker",
        "category": "ai_ml",
        "pricing_tier": "managed",
        "base_cost": 100,
        "description": "ML platform"
    },
    
    # ==================== MESSAGE QUEUES ====================
    {
        "id": "rabbitmq",
        "name": "RabbitMQ",
        "category": "messaging",
        "pricing_tier": "managed",
        "base_cost": 20,
        "description": "Message broker"
    },
    {
        "id": "kafka",
        "name": "Apache Kafka",
        "category": "messaging",
        "pricing_tier": "managed",
        "base_cost": 40,
        "description": "Event streaming platform"
    },
    {
        "id": "aws_sqs",
        "name": "AWS SQS",
        "category": "messaging",
        "pricing_tier": "managed",
        "base_cost": 10,
        "description": "Message queue service"
    },
    {
        "id": "pubsub",
        "name": "Google Pub/Sub",
        "category": "messaging",
        "pricing_tier": "managed",
        "base_cost": 12,
        "description": "Messaging service"
    },
    
    # ==================== MONITORING & ANALYTICS ====================
    {
        "id": "datadog",
        "name": "Datadog",
        "category": "monitoring",
        "pricing_tier": "enterprise",
        "base_cost": 60,
        "description": "Monitoring and analytics"
    },
    {
        "id": "newrelic",
        "name": "New Relic",
        "category": "monitoring",
        "pricing_tier": "enterprise",
        "base_cost": 55,
        "description": "Observability platform"
    },
    {
        "id": "prometheus",
        "name": "Prometheus",
        "category": "monitoring",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Monitoring system"
    },
    {
        "id": "grafana",
        "name": "Grafana",
        "category": "monitoring",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Analytics and visualization"
    },
    {
        "id": "google_analytics",
        "name": "Google Analytics",
        "category": "analytics",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Web analytics"
    },
    {
        "id": "mixpanel",
        "name": "Mixpanel",
        "category": "analytics",
        "pricing_tier": "managed",
        "base_cost": 35,
        "description": "Product analytics"
    },
    {
        "id": "amplitude",
        "name": "Amplitude",
        "category": "analytics",
        "pricing_tier": "managed",
        "base_cost": 40,
        "description": "Product analytics platform"
    },
    
    # ==================== CI/CD ====================
    {
        "id": "github_actions",
        "name": "GitHub Actions",
        "category": "cicd",
        "pricing_tier": "managed",
        "base_cost": 10,
        "description": "Automation platform"
    },
    {
        "id": "jenkins",
        "name": "Jenkins",
        "category": "cicd",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Automation server"
    },
    {
        "id": "circleci",
        "name": "CircleCI",
        "category": "cicd",
        "pricing_tier": "managed",
        "base_cost": 15,
        "description": "CI/CD platform"
    },
    {
        "id": "gitlab_ci",
        "name": "GitLab CI",
        "category": "cicd",
        "pricing_tier": "managed",
        "base_cost": 12,
        "description": "DevOps platform"
    },
    
    # ==================== EMAIL SERVICES ====================
    {
        "id": "sendgrid",
        "name": "SendGrid",
        "category": "email",
        "pricing_tier": "managed",
        "base_cost": 20,
        "description": "Email delivery service"
    },
    {
        "id": "mailgun",
        "name": "Mailgun",
        "category": "email",
        "pricing_tier": "managed",
        "base_cost": 18,
        "description": "Email automation"
    },
    {
        "id": "ses",
        "name": "AWS SES",
        "category": "email",
        "pricing_tier": "managed",
        "base_cost": 5,
        "description": "Email sending service"
    },
    
    # ==================== PAYMENT PROCESSING ====================
    {
        "id": "stripe",
        "name": "Stripe",
        "category": "payment",
        "pricing_tier": "transaction_fee",
        "base_cost": 0,
        "description": "Payment processing"
    },
    {
        "id": "paypal",
        "name": "PayPal",
        "category": "payment",
        "pricing_tier": "transaction_fee",
        "base_cost": 0,
        "description": "Payment platform"
    },
    {
        "id": "square",
        "name": "Square",
        "category": "payment",
        "pricing_tier": "transaction_fee",
        "base_cost": 0,
        "description": "Payment processing"
    },
    
    # ==================== SEARCH SERVICES ====================
    {
        "id": "algolia",
        "name": "Algolia",
        "category": "search",
        "pricing_tier": "managed",
        "base_cost": 30,
        "description": "Search and discovery API"
    },
    {
        "id": "meilisearch",
        "name": "Meilisearch",
        "category": "search",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Open-source search engine"
    },
    
    # ==================== CONTAINER ORCHESTRATION ====================
    {
        "id": "kubernetes",
        "name": "Kubernetes",
        "category": "infrastructure",
        "pricing_tier": "managed",
        "base_cost": 70,
        "description": "Container orchestration"
    },
    {
        "id": "docker",
        "name": "Docker",
        "category": "infrastructure",
        "pricing_tier": "free",
        "base_cost": 0,
        "description": "Containerization platform"
    },
]


def get_component_by_id(component_id: str) -> Dict[str, Any] | None:
    """Get component details by ID"""
    for component in COMPONENTS:
        if component["id"] == component_id:
            return component
    return None


def get_components_by_category(category: str) -> List[Dict[str, Any]]:
    """Get all components in a category"""
    return [c for c in COMPONENTS if c["category"] == category]


def get_all_components() -> List[Dict[str, Any]]:
    """Get all components"""
    return COMPONENTS
