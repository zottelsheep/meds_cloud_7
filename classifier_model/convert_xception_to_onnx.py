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