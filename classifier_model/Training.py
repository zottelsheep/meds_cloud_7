# -*- coding: utf-8 -*-
"""
Created on Fri Nov 11 17:43:58 2022

@author: Elias
"""

from pathlib import Path

import numpy
import tensorflow as tf
from tensorflow.keras.applications import Xception 
import tf2onnx


raw_image = tf.keras.utils.load_img(Path("./dog.jpg"),target_size=[299,299])
#Transform image into array:
array_image =  tf.keras.utils.img_to_array(raw_image)
#push image into vector:
image = numpy.array([array_image])
print('Bild in Array konvertiert')
model = Xception(weights='imagenet')

preds = model.predict(image)
print('Keras Predicted:', tf.keras.applications.imagenet_utils.decode_predictions(preds, top=3)[0])
model.save(Path("./tmp") / model.name)
print('Model gespeichert')

spec = (tf.TensorSpec((None, 299, 299, 3), tf.float32, name="input"),)
output_path = Path(model.name) / ".onnx"

model_proto, _ = tf2onnx.convert.from_keras(model, input_signature=spec, opset=13, output_path=output_path)
output_names = [n.name for n in model_proto.graph.output]

print('FERTIG')








