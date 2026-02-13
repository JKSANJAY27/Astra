# Astra Backend

FastAPI-based backend for Astra cloud architecture design platform with AI-powered chat assistant.

## Features

- 🤖 **AI Chat Assistant**: Google Gemini 2.0 Flash for architecture recommendations
- 🔍 **RAG Pipeline**: FAISS vector store with cloud architecture knowledge base
- 🏗️ **Architecture Generation**: Auto-layout algorithms for component diagrams
- 💰 **Cost Estimation**: Multi-factor cost calculation with scaling
- 📦 **Sandboxes**: MongoDB persistence for architecture gallery
- 🔄 **Real-time Updates**: WebSocket-ready architecture

## Tech Stack

- **Framework**: FastAPI 0.104+
- **AI/RAG**: LangChain + Google Gemini + FAISS
- **Database**: MongoDB Atlas (Motor async driver)
- **Vector Store**: FAISS (CPU)
- **Deployment**: Docker + Uvicorn

## Setup

### Prerequisites

- Python 3.10+
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

5. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Chat
- `POST /api/chat` - Send message to AI assistant
- `POST /api/chat/implement` - Modify architecture (placeholder)
- `GET /api/chat/sessions/{session_id}` - Get session history
- `DELETE /api/chat/sessions/{session_id}` - Delete session

### Sandboxes
- `POST /api/sandboxes` - Publish architecture
- `GET /api/sandboxes/{sandbox_id}` - Get sandbox by ID
- `GET /api/sandboxes` - List sandboxes with filters

## Docker Deployment

```bash
docker build -t astra-backend .
docker run -p 8000:8000 --env-file .env astra-backend
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings management
│   ├── models/              # Pydantic models
│   ├── routers/             # API endpoints
│   ├── services/            # Business logic
│   ├── data/                # Static data (components)
│   └── db/                  # Database connections
├── requirements.txt
├── Dockerfile
└── .env
```

## Environment Variables

```env
MONGODB_URI=mongodb+srv://...
GOOGLE_GEMINI_API_KEY=your_key
FAISS_INDEX_PATH=./faiss_index
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

## License

MIT
