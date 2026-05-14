FROM python:3.14-slim-bookworm
RUN pip install poetry
WORKDIR /app
COPY pyproject.toml .
RUN poetry install --without dev --no-root
COPY . .
ARG MONGO_USERNAME
ENV MONGO_USERNAME=$MONGO_USERNAME
ARG MONGO_PASSWORD
ENV MONGO_PASSWORD=$MONGO_PASSWORD
EXPOSE 5000
CMD ["poetry", "run", "start"]