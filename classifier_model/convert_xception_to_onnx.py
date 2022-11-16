# -*- coding: utf-8 -*-
"""
Created on Fri Nov 11 17:43:58 2022

@author: Elias
"""

from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import Xception 
import tf2onnx
from keras import applications
import onnxruntime as ort

# Convert Model
print('Convert Model Xception to onnx...')
mdl = Xception(weights='imagenet')
spec = (tf.TensorSpec((None, 299, 299, 3), tf.float32, name="input"),)
output_path = Path(f'{mdl.name}.onnx')
mdl_onnx, _ = tf2onnx.convert.from_keras(mdl, 
                                         input_signature=spec, 
                                         opset=13, 
                                         output_path=output_path)

print(f'Output Graph: {[n.name for n in mdl_onnx.graph.output]}')
print('Done!')

# Test Model
print('Testing Model...')

# Load dog image
raw_image = tf.keras.utils.load_img(Path("dog.jpg"),target_size=[299,299])
#Transform image into array:
image_as_array = np.array([tf.keras.utils.img_to_array(raw_image)])
image = applications.xception.preprocess_input(image_as_array)
#Test original keras model predictions
preds = mdl.predict(image)
decoded_predictions = tf.keras.applications.imagenet_utils.decode_predictions(preds, top=3)[0]
print(f'Original (keras) Prediction: {decoded_predictions}')
#Test onnx model predicitons

# WIP
#onnx_mdl = ort.InferenceSession("xception.onnx", providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
#input_shape = onnx_mdl.get_inputs()[0].shape
#print(input_shape, image_as_array.shape)
#label = onnx_mdl.run(['label'],
#                     {'features': image_as_array})

#TODO: @Elias check onnx model-prediction against normal prediction









