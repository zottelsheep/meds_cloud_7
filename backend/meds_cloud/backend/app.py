# USAGE
# Start the server:
#   python app.py
# Submit a request via cURL:
#   curl -X POST -F image=@dog.jpg 'http://localhost:5000/predict'

# import the necessary packages
from pathlib import Path
from typing import Any, Dict
from PIL import Image

import numpy as np

from keras.applications import Xception, xception, imagenet_utils
from keras.utils import load_img, img_to_array

import flask
import io

# initialize our Flask application and the Keras model
app = flask.Flask(__name__)

def load_model():
    # load the pre-trained Keras model (here we are using a model
    # pre-trained on ImageNet and provided by Keras, but you can
    # substitute in your own networks just as easily)
    global model
    model = Xception(weights='imagenet')

    # Load decodings for imagenet (bit hacky ':D')
    imagenet_utils.decode_predictions(np.zeros((2,1000)))


def image_preprocessing(image:Image.Image,
                        target_size):
    """
    Preprocessing for both models
    """
    image = image.resize(target_size)
    image_array = img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)
    image = xception.preprocess_input(image_array)

    return image

@app.route("/predict", methods=["POST"])
def predict():
    # initialize the data dictionary that will be returned from the
    # view
    data: Dict[str,Any] = {"success": False}

    # ensure an image was properly uploaded to our endpoint
    if flask.request.method == "POST":
        if flask.request.files.get("image"):
            # read the image in PIL format
            image = flask.request.files["image"].read()
            image = Image.open(io.BytesIO(image))

            # preprocess the image and prepare it for classification
            image = image_preprocessing(image, target_size=(299,299))

            # classify the input image and then initialize the list
            # of predictions to return to the client
            preds = model.predict(image)

            results = imagenet_utils.decode_predictions(preds)

            data["predictions"] = []

            # loop over the results and add them to the list of
            # returned predictions
            for (imagenetID, label, prob) in results[0]:
                r = {"label": label, "probability": float(prob)}
                data["predictions"].append(r)

            # indicate that the request was a success
            data["success"] = True

    # return the data dictionary as a JSON response
    return flask.jsonify(data)

@app.after_request
def after_request(response):
    white_origin = ['http://localhost:5000']
    if flask.request.headers.get('Origin', None) in white_origin:
        response.headers['Access-Control-Allow-Origin'] = flask.request.headers['Origin'] 
        response.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return response

def main():
    print(("* Loading Keras model and Flask starting server..."
           "please wait until server has fully started"))
    load_model()
    app.run(host='0.0.0.0',
            port=5001)


# if this is the main thread of execution first load the model and
# then start the server
if __name__ == "__main__":
    main()
