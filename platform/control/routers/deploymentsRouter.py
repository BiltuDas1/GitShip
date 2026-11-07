from fastapi import APIRouter, Depends
from schemas import deploymentsSchema
from services.deploy import create_deployment
from middleware import get_current_user
from models import User
from services import exceptions
from utils.status import Response, HTTPStatus
import db


router = APIRouter(prefix="/deployments", tags=["Deployments"])


@router.post("/new")
async def deploy(
  data: deploymentsSchema.DeploySchema,
  user: User = Depends(get_current_user),
):
  """
  Deployment Handler
  """
  try:
    deployment = await create_deployment(
      user_id=user.id,
      image_name=data.image_name,
      hub_url=data.hub_url,
      mq=db.MQ,
    )

    return Response(
      status=True,
      message="deployment queued successfully",
      data={
        "id": str(deployment.id),
        "image_name": deployment.image_name,
        "hub_url": deployment.hub_url,
      },
    ).status(HTTPStatus.HTTP_200_OK)

  except exceptions.MessageQueueUnavailable as err:
    return Response(status=False, message=str(err)).status(
      HTTPStatus.HTTP_503_SERVICE_UNAVAILABLE
    )

  except exceptions.DeploymentFailed as err:
    return Response(status=False, message=str(err)).status(
      HTTPStatus.HTTP_400_BAD_REQUEST
    )
