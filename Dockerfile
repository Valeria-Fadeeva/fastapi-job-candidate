FROM python:latest as python-base
WORKDIR /code
COPY ./pyproject.toml /code
RUN pip3 install poetry
RUN poetry config virtualenvs.create false
RUN poetry install
COPY . .
CMD ["hypercorn", "candidate_db.main:app", "--reload", "--bind", "0.0.0.0:8001"]
