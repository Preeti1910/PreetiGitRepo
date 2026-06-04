from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import PromptAgentDefinition

# Format: "https://resource_name.ai.azure.com/api/projects/project_name"
PROJECT_ENDPOINT = "https://foundry-capstone-for-preeti.services.ai.azure.com/api/projects/proj-capstone"
AGENT_NAME = "my-prompt-agent"

# Create project client to call Foundry API
project = AIProjectClient(
    endpoint=PROJECT_ENDPOINT,
    credential=DefaultAzureCredential(),
)

openai = project.get_openai_client()

# Create a conversation for multi-turn chat
conversation = openai.conversations.create()

# Chat with the agent to answer questions
response = openai.responses.create(
    conversation=conversation.id,
    extra_body={"agent_reference": {"name": AGENT_NAME, "type": "agent_reference"}},
    input="What is the size of France in square miles?",
)
print(response.output_text)

# Ask a follow-up question in the same conversation
response = openai.responses.create(
    conversation=conversation.id,
    extra_body={"agent_reference": {"name": AGENT_NAME, "type": "agent_reference"}},
    input="And what is the capital city?",
)
print(response.output_text)