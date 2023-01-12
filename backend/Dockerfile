FROM tensorflow/tensorflow:latest

# Add non-root-user for later to not run container as root
RUN groupadd -r deamon && useradd -r -g deamon -m -s /bin/bash deamon 

WORKDIR /app
COPY meds_cloud ./meds_cloud
COPY setup.py ./
RUN --mount=type=cache,target=/root/.cache/pip pip install '.[prod]'

USER deamon
# Predownload Model and indexes
RUN python -c "from meds_cloud.backend.app import load_model; load_model()"

EXPOSE 8000
CMD ["gunicorn", "--workers=2", "--threads=4", "--worker-class=gthread", "-b", "0.0.0.0", "meds_cloud.backend.app:create_app()"]
