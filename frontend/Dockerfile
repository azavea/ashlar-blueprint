FROM quay.io/azavea/flask:0.12-python2.7-alpine

COPY requirements.txt /tmp/app_requirements.txt
RUN pip install -r /tmp/app_requirements.txt
RUN rm -f /tmp/tmp/app_requirements.txt

COPY . /opt/frontend
WORKDIR /opt/frontend
