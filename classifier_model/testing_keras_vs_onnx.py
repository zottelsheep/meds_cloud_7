# -*- coding: utf-8 -*-
"""
Created on Fri Nov 11 17:43:58 2022

@author: Elias
"""

from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import Xception 
from keras import applications
import onnxruntime as rt

def image_preprocessing(imagename):
    """
    Preprocessing for both models
    """
    raw_image = tf.keras.utils.load_img(Path(imagename),target_size=[299,299])
    image_as_array = np.array([tf.keras.utils.img_to_array(raw_image)])
    image = applications.xception.preprocess_input(image_as_array)

    return image

def keras_infer(image):
    mdl = Xception(weights='imagenet')
    preds = mdl.predict(image)
    decoded_predictions = tf.keras.applications.imagenet_utils.decode_predictions(preds, top=1)[0]
    print(f'\nOriginal (keras) Prediction: {decoded_predictions[0][1]} with prediction value {decoded_predictions[0][2]}')

def onnx_infer(modelname, X_test):
    sess = rt.InferenceSession(modelname)
    input_name = sess.get_inputs()[0].name
    label_name = sess.get_outputs()[0].name
    pred = sess.run([label_name], {input_name: X_test.astype(np.float32)})[0]
    decoded_predictions = tf.keras.applications.imagenet_utils.decode_predictions(pred, top=1)[0]
    print(f'Onnx-Model Prediction:\t     {decoded_predictions[0][1]} with prediction value {decoded_predictions[0][2]}\n')

#Test Model
#Image preprocessing
image = image_preprocessing('dog.jpg')
#Test original keras model predictions
keras_infer(image)
#Test onnx model predicitons
onnx_infer('xception.onnx', image)