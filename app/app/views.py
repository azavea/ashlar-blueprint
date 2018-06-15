import json

from flask import render_template
from flask.json import jsonify

from app import application


@application.route('/')
def index():
    '''
    Index view for the reference implementation.
    '''
    return render_template('index.html')


@application.route('/back/types/', methods=['GET'])
def type_list():
    '''
    List all RecordTypes stored in Ashlar.
    '''
    return render_template('back/types/list.html')


@application.route('/back/types/<uuid:uuid>', methods=['GET'])
def type_detail(uuid):
    '''
    Display a detail view for a RecordType.
    '''
    return render_template('back/types/detail.html', uuid=uuid)


@application.route('/back/schemas/edit/<uuid:uuid>', methods=['GET'])
def schema_edit(uuid):
    '''
    Display an editor for a RecordSchema.
    '''
    return render_template('back/schemas/edit.html', uuid=uuid)


@application.route('/back/records/', methods=['GET'])
def record_list():
    '''
    Display all Records stored in Ashlar.
    '''
    return render_template('back/records/list.html')


@application.route('/back/records/<uuid:uuid>')
def record_detail(uuid):
    '''
    Display a detail view and an editor for a Record.
    '''
    return render_template('back/records/detail.html', uuid=uuid)


@application.route('/front')
def frontend():
    '''
    Display the frontend to the reference implementation -- browse data
    from a user's perspective.
    '''
    return render_template('front/index.html')
