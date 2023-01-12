FROM python:3.10-alpine

# Add non-root-user for later to not run container as root
RUN addgroup -S deamon && adduser -S -g deamon -s /bin/bash deamon

WORKDIR /app
COPY meds_cloud ./meds_cloud
COPY setup.py ./
RUN --mount=type=cache,target=/root/.cache/pip pip install '.[prod]'

USER deamon

EXPOSE 8000
CMD ["gunicorn", "--workers=2", "--threads=4", "--worker-class=gthread", "-b", "0.0.0.0", "meds_cloud.frontend.app:app"]
