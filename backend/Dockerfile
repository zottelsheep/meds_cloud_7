FROM tensorflow/tensorflow:latest

# Add non-root-user for later to not run container as root
RUN groupadd -r deamon && useradd -r -g deamon -m -s /bin/bash deamon 

WORKDIR /app
COPY meds_cloud ./meds_cloud
COPY setup.py ./
RUN --mount=type=cache,target=/root/.cache/pip pip install .

USER deamon
# Predownload Model and indexes
RUN python -c "from meds_cloud.backend.app import load_model; load_model()"

EXPOSE 5001
CMD ["python", "-m", "meds_cloud.backend.app"]
