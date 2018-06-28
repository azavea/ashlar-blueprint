import json

from flask import render_template
from flask.json import jsonify

from app import application, ASHLAR_API_URL


@application.route('/')
def index():
    '''
    Index view for the reference implementation frontend.
    '''
    context = {'ASHLAR_API_URL': ASHLAR_API_URL}
    return render_template('index.html', **context)
