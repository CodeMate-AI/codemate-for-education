import os
import json
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv(override=True)



client = AzureOpenAI(
  api_key = os.environ.get("AOAI_KEY"),  
  api_version = os.environ.get("AOAI_VERSION"),
  azure_endpoint=os.environ.get("AOAI_ENDPOINT")
)