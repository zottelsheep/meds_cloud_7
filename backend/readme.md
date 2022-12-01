# Classifier Backend

## Installation

`pip install .`

or dev install

`pip install -e .[all]`

## Usage

```bash
python -m meds_cloud.backend.app
```

## Docker

To build the image use:
```
DOCKER_BUILDKIT=1 docker build -t meds_cloud:backend-tf-latest .
```

Buildkit is necessary for caching pip packages. Possibly also for model-downloads

To run the container and expose on port `5000` use following:
```
docker run --rm -p 5000:5000 meds_cloud:backend-tf-latest
```

To inspect container from the inside:
```
docker run --rm -it meds_cloud:backend-tf-latest bash
```

for root access use flag `--user root`
