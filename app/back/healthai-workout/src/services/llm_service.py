import os
import json
import httpx
from typing import Dict, Any

# Variables d'environnement avec les fallbacks calés sur ton docker-compose
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://healthai-ollama-workout:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")

async def generate_llm_prediction(system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    """
    Interroge le conteneur Ollama local, gère le formatage JSON strict 
    et survit aux lenteurs de chargement du CPU grâce à un timeout étendu.
    """
    url = f"{OLLAMA_BASE_URL}/api/generate"
    
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"System: {system_prompt}\nUser: {user_prompt}",
        "format": "json",
        "stream": False
    }
    
    # Sécurité CPU : 180 secondes pour laisser le temps au modèle de s'activer
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        
        result = response.json()
        raw_text = result.get("response", "").strip()
        
        # Nettoyage des balises Markdown (```json ... ```) si le LLM triche
        if raw_text.startswith("```"):
            lines = raw_text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            raw_text = "\n".join(lines).strip()
            
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Le LLM n'a pas renvoyé un JSON valide. Texte brut : {raw_text}") from e