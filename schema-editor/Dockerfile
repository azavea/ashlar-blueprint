FROM quay.io/azavea/flask:0.12-python2.7-alpine

COPY requirements.txt /tmp/schema_editor_requirements.txt
RUN pip install -r /tmp/schema_editor_requirements.txt
RUN rm -f /tmp/tmp/schema_editor_requirements.txt

COPY . /opt/schema-editor
WORKDIR /opt/schema-editor
