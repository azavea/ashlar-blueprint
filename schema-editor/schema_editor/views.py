from flask import render_template

from schema_editor import app


@app.route('/')
def index():
    '''
    Index view for the schema editor app.
    '''
    return render_template('index.html')


@app.route('/recordtypes/', methods=['GET'])
def type_list():
    '''
    List all RecordTypes stored in Ashlar.
    '''
    return render_template('recordtype/list.html')


@app.route('/recordtypes/<uuid:uuid>', methods=['GET'])
def type_detail(uuid):
    '''
    Display a detail view for a RecordType.
    '''
    return render_template('recordtype/detail.html', uuid=uuid)


@app.route('/records/', methods=['GET'])
def record_list():
    '''
    Display all Records stored in Ashlar.
    '''
    return render_template('record/list.html')


@app.route('/records/<uuid:uuid>')
def record_detail():
    '''
    Display a detail view and an editor for a Record.
    '''
    return render_template('record/detail.html', uuid=uuid)
