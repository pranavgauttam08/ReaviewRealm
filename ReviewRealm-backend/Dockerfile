FROM python:3.10-alpine

ENV HOST 0.0.0.0
ENV PORT 8100
ENV DEBUG true

COPY . /api
WORKDIR /api

RUN pip install -U setuptools pip
RUN pip install -r requirements.txt


EXPOSE 8100

RUN pip install uvicorn
RUN python3 initial-nlp-libraries.py
# run the app server in production with gunicorn
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "8100", "--workers", "3", "app:app"]
