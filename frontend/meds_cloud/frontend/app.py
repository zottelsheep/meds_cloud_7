"""
RufusCatCM, 30-Nov-2022

Render the Frontend as a Flask Webapp
"""

import os
from flask import Flask, render_template

if "API_ENDPOINT" in os.environ:
    API_ENDPOINT = os.environ["API_ENDPOINT"]
else:
    API_ENDPOINT = "./api/predict"

app = Flask(__name__, static_folder='static')


@app.route('/')
def render_frontend():
    return render_template('index.html', api_endpoint=API_ENDPOINT)


if __name__ == "__main__":
    app.run(host='0.0.0.0',
            port=5000,
            debug=True)
