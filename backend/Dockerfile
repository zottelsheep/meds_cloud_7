FROM tensorflow/tensorflow:latest

WORKDIR /app

COPY meds_cloud ./meds_cloud
COPY setup.py ./


RUN --mount=type=cache,target=/root/.cache/pip pip install .
RUN python -c "from meds_cloud.backend.app import load_model; load_model()"

EXPOSE 5000
CMD ["python", "-m", "meds_cloud.backend.app"]
