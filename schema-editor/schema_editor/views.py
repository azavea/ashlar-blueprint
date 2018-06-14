from schema_editor import app


@app.route('/')
def hello_world():
    return "<h1>Hello World!</h1>"
