import json

from flask import render_template
from flask.json import jsonify

from app import application


@application.route('/')
def index():
    '''
    Index view for the reference implementation frontend.
    '''
    return render_template('index.html')
