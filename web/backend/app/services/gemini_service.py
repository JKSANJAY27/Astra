"""Google Gemini API service wrapper"""
import google.generativeai as genai
from typing import List, Dict, Optional
import re
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class GeminiService:
    """Wrapper for Google Gemini API"""
    
    def __init__(self):
        """Initialize Gemini with API key"""
        try:
            genai.configure(api_key=settings.google_gemini_api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
            self.enabled = True
            logger.info("Initialized Gemini service")
        except Exception as e:
            logger.warning(f"Gemini API unavailable (will use demo mode): {e}")
            self.model = None
            self.enabled = False
    
    def generate_response(
        self,
        user_message: str,
        context: str = "",
        conversation_history: Optional[List[Dict[str, str]]] = None,
        chat_width: int = 600,
        scope: Optional[Dict] = None
    ) -> str:
        """
        Generate AI response with RAG context
        
        Args:
            user_message: Current user message
            context: RAG-retrieved context from knowledge base
            conversation_history: Previous messages
            chat_width: Chat panel width (for response formatting)
            scope: Current project scope parameters
        
        Returns:
            AI-generated response text
        """
        # Fallback response if Gemini is not available
        if not self.enabled:
            return f"""🤖 **Astra is running in Demo Mode**

To enable full AI-powered architecture recommendations:

1. Get a **free API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to `backend/.env`:
   ```
   GOOGLE_GEMINI_API_KEY=your-key-here
   ```
3. Restart the backend server

You asked: "{user_message}"

For now, you can still use the visual canvas to manually design architectures!"""
        # Build system prompt
        system_prompt = self._build_system_prompt(chat_width, scope, context)
        
        # Build conversation for context
        messages = []
        if conversation_history:
            for msg in conversation_history[-10:]:  # Last 10 messages
                messages.append(f"{msg['role'].upper()}: {msg['content']}")
        
        # Add current message
        messages.append(f"USER: {user_message}")
        
        # Combine into full prompt
        full_prompt = f"{system_prompt}\n\n{''.join(messages)}\n\nASSISTANT:"
        
        try:
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return "I apologize, but I encountered an error processing your request. Please try again."
    
    def _build_system_prompt(
        self,
        chat_width: int,
        scope: Optional[Dict],
        context: str
    ) -> str:
        """Build system prompt with role definition and context"""
        
        scope_info = ""
        if scope:
            scope_info = f"""
Current Project Scope:
- Users: {scope.get('users', 'Not set')}
- Traffic Level: {scope.get('trafficLevel', 'Not set')}/5
- Data Volume: {scope.get('dataVolumeGB', 'Not set')} GB
- Regions: {scope.get('regions', 'Not set')}
- Availability: {scope.get('availability', 'Not set')}%
"""
        
        context_section = ""
        if context:
            context_section = f"""
### Knowledge Base Context
{context}
"""
        
        return f"""You are an expert cloud architect and software engineering consultant specializing in modern full-stack architectures, microservices, cloud platforms (AWS, GCP, Azure), and DevOps best practices.

Your role is to:
1. Provide technical guidance on architecture design
2. Recommend appropriate technologies and components
3. Explain cost-benefit tradeoffs
4. Suggest scalability and reliability improvements
5. Answer questions about cloud platforms and best practices

{scope_info}

{context_section}

Guidelines:
- Be concise and technical
- Recommend specific technologies from the available component library
- Consider the project scope when making recommendations
- Explain WHY you recommend certain technologies
- If asked to create/design/visualize architecture, mention specific component names
- When you detect scope parameters (user count, traffic, data volume, regions, availability) in the conversation, you MUST output them in a JSON code block like this:

```json
{{
  "scope_analysis": {{
    "users": 50000,
    "trafficLevel": 4,
    "dataVolumeGB": 2000,
    "regions": 3,
    "availability": 99.95
  }}
}}
```

Chat width: {chat_width}px (keep responses readable)
"""
    
    def extract_component_ids_from_text(self, text: str) -> List[str]:
        """
        Extract component IDs mentioned in text
        Uses fuzzy matching against component names
        """
        from app.data.components_data import get_all_components
        
        text_lower = text.lower()
        mentioned = []
        
        for component in get_all_components():
            # Check if component name appears in text
            name_lower = component["name"].lower()
            component_id = component["id"]
            
            # Direct name match
            if name_lower in text_lower:
                mentioned.append(component_id)
                continue
            
            # Check ID variations (e.g., "next.js" vs "nextjs")
            if component_id.replace("-", "").replace("_", "") in text_lower.replace(".", "").replace(" ", ""):
                mentioned.append(component_id)
                continue
        
        # Remove duplicates while preserving order
        seen = set()
        result = []
        for comp_id in mentioned:
            if comp_id not in seen:
                seen.add(comp_id)
                result.append(comp_id)
        
        return result


# Singleton instance
_gemini_service: Optional[GeminiService] = None


def get_gemini_service() -> GeminiService:
    """Get or create Gemini service singleton"""
    global _gemini_service
    if _gemini_service is None:
        _gemini_service = GeminiService()
    return _gemini_service
