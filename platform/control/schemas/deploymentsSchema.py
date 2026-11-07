from pydantic import BaseModel, Field


class DeploySchema(BaseModel):
  """
  Schema for a new deployment request
  """

  image_name: str = Field(..., min_length=1, max_length=255)
  hub_url: str = Field(default="https://docker.io", min_length=1, max_length=255)
