"""
RufusCatCM, 30-Nov-2022

Render the Frontend as a Flask Webapp
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def render_frontend():
    return render_template('index.html')


if __name__ == "__main__":
    app.run()
