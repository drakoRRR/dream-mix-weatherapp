FROM python:3.11-slim-buster

ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .

RUN pip install --upgrade -r requirements.txt

COPY ./weatherapp /code

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]