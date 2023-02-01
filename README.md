# Image-Classifier with Kubernetes Deployment
As part of a Cloud and Distributed Systems lecture, we developed a scalable application in the form of an image classifier meant for deployment on Kubernetes. We also created our own Kubernetes infrastructure bare metal server, complete with loadbalancing and ingress-support.

## Image-Classifier Serivce

### Create and activate venv
```bash
python -m venv .venv
./.venv/bin/activate
```
### Installation of frontend and backend

To install backend use:
```bash
pip install -e ./backend -e ./frontend
```

Or for dev install:
```bash
pip install -e "./backend[dev]" -e "./frontend[dev]"
```

### Backend-Usage

- Run backend locally with flask dev-server
  ```bash
  python -m meds_cloud.backend.app
  ```

- Predict an image using webapi (here using curl):
  ```bash
  curl \
    --request POST 'localhost:5000/predict' \
    --form 'image=@"../classifier_model/dog.jpg"'
  ```

### Frontend-Usage

- Run backend locally with flask dev-server
  ```bash
  python -m meds_cloud.backend.app
  ```
- Run frontend locally with flask dev-server
  ```bash
  python -m meds_cloud.frontend.app
  ```
- Navigate to frontend-webendpoint


### Building Docker Images

Buildkit is necessary for caching pip packages. To build the image use:
```bash
DOCKER_BUILDKIT=1 docker build -t meds_cloud:backend-latest ./backend/ 
DOCKER_BUILDKIT=1 docker build -t meds_cloud:frontend-latest ./frontend/ 
```

### Kubernetes Deployment

In the folder deployments there are three kubectl-files for the frontend-service, the backend-service, and an ingress. You can use these files to install the complete application to a Kubernetes cluster. Mind you need to change the image-url for frontend and backend if you want to use your own images

## Building the documentation

You can use `latexmk -pdf main.tex` to build the documentation pdf. The documentation contains detailed explanations on how to build a Kubernetes cluster from the ground up, as well as deploying the service into said cluster.
