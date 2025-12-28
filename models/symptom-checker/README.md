# Symptom Checker Model

This directory should contain the TensorFlow.js model files for the symptom checker:

- `model.json` - The model architecture and weights manifest
- `group1-shard1of1.bin` - The binary weights file(s)

## Training Notes

For production use, train a model using:
- Bangladesh-specific health data
- Common symptoms and conditions prevalent in rural areas
- Multi-language support (Bengali/English)

## Model Architecture

Recommended:
- Input: Symptom feature vector (15 features)
- Hidden layers: Dense(64, relu) -> Dense(32, relu)
- Output: Disease probability distribution

## Placeholder

The application includes a mock model for development. Replace with trained model for production.
