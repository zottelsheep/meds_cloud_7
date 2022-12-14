# Classifier Backend

Based on code of `https://medium.com/analytics-vidhya/deploy-your-first-deep-learning-model-on-kubernetes-with-python-keras-flask-and-docker-575dc07d9e76`

## TODO

- [ ] Use real WSGI-Server
  - [ ] Check if global object use is ok with multiple workers
- [ ] Try out using onnx?

## Installation

To install backend use:
```sh
pip install .
```

Or for dev install:
```sh
pip install -e .[dev]
```

## Usage

- Run backend localy with flask dev-server
  ```sh
  python -m meds_cloud.backend.app
  ```

- Predict an image using webapi (here using curl):
  ```sh
  curl \
    --request POST 'localhost:5000/predict' \
    --form 'image=@"../classifier_model/dog.jpg"'
  ```



## Docker

To build the image use:
```sh
DOCKER_BUILDKIT=1 docker build -t meds_cloud:backend-tf-latest .
```

Buildkit is necessary for caching pip packages. Possibly also for model-downloads

To run the container and expose on port `5000` use following:
```sh
docker run --rm -p 5000:5000 meds_cloud:backend-tf-latest
```

To inspect container from the inside:
```sh
docker run --rm -it meds_cloud:backend-tf-latest bash
```

for root access use flag `--user root`
