# Vitals Predictor Model

This directory should contain the TensorFlow.js model files for vitals risk prediction:

- `model.json` - The model architecture and weights manifest
- `group1-shard1of1.bin` - The binary weights file(s)

## Training Notes

For production use, train a model using:
- Historical patient vitals data
- Risk factors specific to Bangladesh population
- Age-adjusted risk calculations

## Model Architecture

Recommended:
- Input: Normalized vitals vector (6 features: systolic, diastolic, pulse, temperature, weight, age)
- Hidden layers: Dense(32, relu) -> Dense(16, relu)
- Output: Risk score (sigmoid, 0-1)

## Placeholder

The application includes a mock model for development. Replace with trained model for production.
