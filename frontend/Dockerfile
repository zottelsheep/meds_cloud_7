FROM python:3.10-alpine

# Add non-root-user for later to not run container as root
RUN addgroup -S deamon && adduser -S -g deamon -s /bin/bash deamon

WORKDIR /app
COPY meds_cloud ./meds_cloud
COPY setup.py ./
RUN --mount=type=cache,target=/root/.cache/pip pip install .

USER deamon

CMD ["python", "-m", "meds_cloud.frontend.app"]
