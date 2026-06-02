from typing import List, Dict
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def _mock_completion(prompt: str) -> str:
    prompt_lower = prompt.lower()
    if "vendor" in prompt_lower and "risk" not in prompt_lower:
        return (
            "Mock LLM response: Based on price, rating, and delivery, Vendor A is the best overall balance. "
            "Vendor B is cheaper but has a lower rating. Vendor C has the strongest rating but highest risk and slower delivery."
        )
    if "contract" in prompt_lower:
        return (
            "Mock LLM response: This contract covers laptop procurement, uses Net 30 payment terms, renews annually, "
            "and allows termination for material breach."
        )
    if "risk" in prompt_lower:
        return (
            "Mock LLM response: Vendor C appears highest risk in the sample data because it is marked high risk_level. "
            "Vendor A appears lowest risk."
        )
    return "Mock LLM response: I can help with vendor recommendation, contract summarization, and supplier risk assessment."


def complete(prompt: str) -> Dict[str, str]:
    endpoint = settings.azure_openai_endpoint
    key = settings.azure_openai_api_key
    deployment = settings.azure_openai_deployment

    if not (endpoint and key and deployment):
        logger.info("Azure OpenAI not configured. Falling back to mock mode.")
        return {"text": _mock_completion(prompt), "mode": "mock"}

    try:
        from openai import AzureOpenAI

        client = AzureOpenAI(
            api_key=key,
            azure_endpoint=endpoint,
            api_version=settings.azure_openai_api_version,
        )
        response = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": "You are a procurement assistant agent."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )
        text = response.choices[0].message.content or ""
        return {"text": text, "mode": "azure-openai"}
    except Exception as ex:
        logger.exception("Azure OpenAI call failed. Falling back to mock mode.")
        return {"text": _mock_completion(prompt) + f" [Fallback due to: {ex}]", "mode": "mock"}
