import * as functions from 'firebase-functions';
import * as tf from '@tensorflow/tfjs-node';
import { HeartAttackPredictionInput } from './types';

// Load pre-trained model
let model: tf.LayersModel;

async function loadModel() {
  if (!model) {
    model = await tf.loadLayersModel('file://./model/heart_attack_model.h5');
  }
  return model;
}

// Initialize model loading
loadModel().catch(console.error);

export const predictHeartAttack = functions.https.onCall(async (data: HeartAttackPredictionInput, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }

    const model = await loadModel();
    
    // Convert input data to tensor
    const inputTensor = tf.tensor2d([
      [
        data.age,
        data.sex,
        data.chestPainType,
        data.restingBP,
        data.cholesterol,
        data.fastingBS,
        data.restingECG,
        data.maxHR,
        data.exerciseAngina,
        data.oldpeak,
        data.stSlope
      ]
    ]);

    // Make prediction
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const probabilityArray = await prediction.array();
    
    // Cleanup tensors
    inputTensor.dispose();
    prediction.dispose();

    return {
      probability: probabilityArray[0][0],
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Heart attack prediction error:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred during prediction.'
    );
  }
}); 