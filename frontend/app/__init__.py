import os

from flask import Flask

ASHLAR_API_URL = os.environ.get('ASHLAR_API_URL', 'localhost:8000/api')

application = Flask(__name__)

import app.views
