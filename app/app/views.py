from flask import render_template

from app import application


@application.route('/')
def index():
    '''
    Index view for the schema editor application.
    '''
    return render_template('index.html')


@application.route('/recordtypes/', methods=['GET'])
def type_list():
    '''
    List all RecordTypes stored in Ashlar.
    '''
    return render_template('recordtype/list.html')


@application.route('/recordtypes/<uuid:uuid>', methods=['GET'])
def type_detail(uuid):
    '''
    Display a detail view for a RecordType.
    '''
    return render_template('recordtype/detail.html', uuid=uuid)


@application.route('/records/', methods=['GET'])
def record_list():
    '''
    Display all Records stored in Ashlar.
    '''
    return render_template('record/list.html')


@application.route('/records/<uuid:uuid>')
def record_detail():
    '''
    Display a detail view and an editor for a Record.
    '''
    return render_template('record/detail.html', uuid=uuid)
