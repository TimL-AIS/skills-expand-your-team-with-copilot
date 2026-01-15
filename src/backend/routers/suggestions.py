"""
Endpoints for class suggestions
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
import re

from ..database import suggestions_collection

router = APIRouter(
    prefix="/suggestions",
    tags=["suggestions"]
)

class SuggestionCreate(BaseModel):
    class_name: str
    description: str
    category: str
    email: str

@router.post("")
def create_suggestion(suggestion: SuggestionCreate) -> Dict[str, Any]:
    """
    Submit a new class suggestion
    """
    # Validate required fields
    if not suggestion.class_name.strip():
        raise HTTPException(status_code=400, detail="Class name is required")
    
    if not suggestion.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")
    
    if not suggestion.category:
        raise HTTPException(status_code=400, detail="Category is required")
    
    # Validate email format (consistent with frontend validation)
    email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_pattern, suggestion.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Create the suggestion document
    suggestion_doc = {
        "class_name": suggestion.class_name.strip(),
        "description": suggestion.description.strip(),
        "category": suggestion.category,
        "email": suggestion.email.strip().lower(),
        "status": "pending"
    }
    
    # Insert into database
    result = suggestions_collection.insert_one(suggestion_doc)
    
    return {
        "message": "Thank you for your suggestion! We'll review it soon.",
        "suggestion_id": str(result.inserted_id)
    }
