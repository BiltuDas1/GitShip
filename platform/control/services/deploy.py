from tortoise.transactions import in_transaction
from tortoise.exceptions import IntegrityError
from uuid import UUID
from models import Image
from utils.rabbitmq import RabbitMQ
from . import exceptions

DOCKER_HUB = ("docker.io", "index.docker.io", "registry-1.docker.io")


def image_reference(image_name: str, hub_url: str) -> str:
  """
  Builds the Docker image reference the deployer can pull

  The registry url is stripped of its scheme, and Docker Hub is omitted
  because the Docker CLI resolves a bare repository to docker.io/library.
  """
  registry = hub_url.strip().rstrip("/")
  for scheme in ("https://", "http://"):
    if registry.lower().startswith(scheme):
      registry = registry[len(scheme) :]

  repository = image_name.strip().strip("/")
  if not registry or registry.lower() in DOCKER_HUB:
    return repository

  return f"{registry}/{repository}"


async def create_deployment(
  user_id: UUID,
  image_name: str,
  hub_url: str,
  mq: RabbitMQ,
) -> Image:
  """
  Stores the deployment record in the database and publishes the job to the
  message queue inside a single database transaction.

  The message is published before the transaction commits, so if the broker
  rejects it the database changes are rolled back and no deployment record
  can exist without its job.
  """
  try:
    async with in_transaction() as connection:
      deployment = await Image.create(
        user_id=user_id,
        image_name=image_name,
        hub_url=hub_url,
        using_db=connection,
      )

      await mq.publish(
        {
          "deployment_id": str(deployment.id),
          "image": image_reference(image_name, hub_url),
          "environments": {},
          "port": 0,
          "cmd": "",
        }
      )

  except IntegrityError as err:
    raise exceptions.DeploymentFailed(
      "user does not exist or the deployment is invalid"
    ) from err

  except exceptions.MessageQueueUnavailable:
    raise

  except Exception as err:
    raise exceptions.MessageQueueUnavailable(
      "failed to queue the deployment"
    ) from err

  return deployment
