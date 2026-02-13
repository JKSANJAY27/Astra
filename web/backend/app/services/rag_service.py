"""RAG (Retrieval-Augmented Generation) service with FAISS vector store"""
import os
import pickle
from typing import List, Optional
import logging

# LangChain imports
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from app.config import settings

logger = logging.getLogger(__name__)


class RAGService:
    """RAG service for context retrieval using FAISS"""
    
    def __init__(self):
        """Initialize RAG service with FAISS vector store"""
        self.index_path = settings.faiss_index_path
        self.vectorstore: Optional[FAISS] = None
        
        try:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=settings.google_gemini_api_key
            )
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len,
            )
            
            # Load or create vector store
            self._load_or_create_vectorstore()
            logger.info("RAG service initialized successfully")
        except Exception as e:
            logger.warning(f"RAG service initialization failed (will use fallback): {e}")
            self.embeddings = None
            self.text_splitter = None
    
    def _load_or_create_vectorstore(self):
        """Load existing FAISS index or create new one"""
        index_file = os.path.join(self.index_path, "index.faiss")
        
        if os.path.exists(index_file):
            try:
                self.vectorstore = FAISS.load_local(
                    self.index_path,
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                logger.info("Loaded existing FAISS index")
            except Exception as e:
                logger.warning(f"Failed to load FAISS index: {e}. Creating new one.")
                self._create_default_vectorstore()
        else:
            self._create_default_vectorstore()
    
    def _create_default_vectorstore(self):
        """Create vector store with default cloud architecture knowledge"""
        os.makedirs(self.index_path, exist_ok=True)
        
        # Default knowledge base documents
        knowledge_docs = [
            """
            Microservices Architecture Best Practices:
            - Use API Gateway (Kong, Nginx) as single entry point
            - Implement service discovery
            - Use message queues (RabbitMQ, Kafka) for async communication
            - Deploy to container orchestration (Kubernetes)
            - Implement circuit breakers and retry logic
            - Use distributed tracing (Datadog, New Relic)
            - Database per service pattern
            """,
            """
            E-commerce Architecture Components:
            - Frontend: Next.js or React for web, React Native for mobile
            - Backend: FastAPI, Django, or Node.js/Express
            - Database: PostgreSQL for transactions, MongoDB for product catalog
            - Cache: Redis for session management and caching
            - Search: Elasticsearch or Algolia for product search
            - Payment: Stripe or PayPal integration
            - Storage: AWS S3 or Cloudinary for product images
            - CDN: Cloudflare for static asset delivery
            - Queue: RabbitMQ for order processing
            """,
            """
            Cloud Platform Selection Guide:
            - AWS: Best for enterprise, most mature services, widest adoption
            - Google Cloud: Best for AI/ML, BigQuery for analytics, competitive pricing
            - Azure: Best for Microsoft ecosystem integration
            - Vercel: Best for Next.js and frontend deployments
            - Heroku: Best for rapid prototyping and simple deployments
            - DigitalOcean: Best for cost-effective VPS hosting
            """,
            """
            Database Selection Guide:
            - PostgreSQL: ACID compliance, complex queries, relationships
            - MongoDB: Flexible schema, horizontal scaling, document storage
            - MySQL: Compatible with most applications, good performance
            - Redis: In-memory caching, session storage, pub/sub
            - Elasticsearch: Full-text search, log analytics
            - Cassandra: High write throughput, massive scale
            """,
            """
            Scalability Patterns:
            - Horizontal scaling: Add more servers behind load balancer
            - Vertical scaling: Increase server resources (CPU, RAM)
            - Database sharding: Partition data across multiple databases
            - Read replicas: Separate read and write database instances
            - Caching: Redis or Memcached for frequently accessed data
            - CDN: Cloudflare or CloudFront for static assets
            - Asynchronous processing: Use queues for background jobs
            """,
            """
            High Availability Architecture:
            - Multi-region deployment for disaster recovery
            - Load balancers for traffic distribution
            - Auto-scaling groups for dynamic capacity
            - Database replication (master-slave or multi-master)
            - Health checks and automatic failover
            - 99.9% availability: Single region, load balancers
            - 99.99% availability: Multi-region, active-active
            - 99.999% availability: Global distribution, chaos engineering
            """,
            """
            Authentication & Authorization:
            - Auth0: Enterprise-grade, social login, MFA
            - Firebase Auth: Google ecosystem, quick setup
            - AWS Cognito: AWS integration, user pools
            - Clerk: Modern UI/UX, built-in components
            - JWT tokens for stateless authentication
            - OAuth2 for third-party integrations
            - RBAC (Role-Based Access Control) for permissions
            """,
            """
            AI/ML Integration:
            - OpenAI API: GPT models, embeddings, chat completions
            - Google Gemini: Multimodal AI, competitive pricing
            - Anthropic Claude: Long context, safety-focused
            - Hugging Face: Open-source models, custom deployments
            - AWS SageMaker: Full ML platform, training and inference
            - Use RAG (Retrieval-Augmented Generation) for context
            - Vector databases: FAISS, Pinecone, Weaviate
            """,
            """
            Cost Optimization Strategies:
            - Use serverless for variable workloads (AWS Lambda, Cloud Run)
            - Reserved instances for predictable workloads
            - Spot instances for batch processing
            - Auto-scaling to match demand
            - Database query optimization and indexing
            - CDN to reduce bandwidth costs
            - S3 Intelligent-Tiering for storage
            - Right-sizing: Monitor and adjust instance sizes
            """,
            """
            DevOps Best Practices:
            - CI/CD: GitHub Actions, GitLab CI, CircleCI
            - Infrastructure as Code: Terraform, CloudFormation
            - Container orchestration: Kubernetes, Docker Swarm
            - Monitoring: Datadog, New Relic, Prometheus + Grafana
            - Log aggregation: ELK stack, CloudWatch
            - Secret management: Vault, AWS Secrets Manager
            - Blue-green deployments for zero downtime
            - Feature flags for gradual rollouts
            """
        ]
        
        # Create documents
        documents = [
            Document(page_content=doc.strip(), metadata={"source": "default_kb"})
            for doc in knowledge_docs
        ]
        
        # Split documents into chunks
        split_docs = self.text_splitter.split_documents(documents)
        
        # Create vector store
        self.vectorstore = FAISS.from_documents(split_docs, self.embeddings)
        
        # Save to disk
        self.vectorstore.save_local(self.index_path)
        logger.info(f"Created new FAISS index with {len(split_docs)} chunks")
    
    def retrieve_context(self, query: str, k: int = 3) -> str:
        """
        Retrieve relevant context from knowledge base
        
        Args:
            query: User's question or message
            k: Number of top results to return
        
        Returns:
            Concatenated context from top-k similar documents
        """
        if not self.vectorstore:
            return ""
        
        try:
            # Perform similarity search
            docs = self.vectorstore.similarity_search(query, k=k)
            
            # Combine results
            context = "\n\n".join([doc.page_content for doc in docs])
            return context
        except Exception as e:
            logger.error(f"Error retrieving context: {e}")
            return ""
    
    def add_documents(self, texts: List[str], metadatas: Optional[List[dict]] = None):
        """Add new documents to the knowledge base"""
        documents = [
            Document(page_content=text, metadata=meta or {})
            for text, meta in zip(texts, metadatas or [{}] * len(texts))
        ]
        
        split_docs = self.text_splitter.split_documents(documents)
        
        if self.vectorstore:
            self.vectorstore.add_documents(split_docs)
            self.vectorstore.save_local(self.index_path)
            logger.info(f"Added {len(split_docs)} document chunks to vector store")


# Singleton instance
_rag_service: Optional[RAGService] = None


def get_rag_service() -> RAGService:
    """Get or create RAG service singleton"""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service
