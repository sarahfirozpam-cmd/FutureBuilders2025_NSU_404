# Skin Disease Classification Model

## Model Information

**Source**: Falconsai/skin-disease-classification (Hugging Face)
**Type**: Image Classification
**Classes**: 10 skin conditions
**Input**: 224x224 RGB images
**Framework**: TensorFlow.js (converted from PyTorch)

## Classes Detected

1. Eczema
2. Melanoma
3. Atopic Dermatitis
4. Basal Cell Carcinoma
5. Benign Keratosis
6. Psoriasis
7. Seborrheic Keratosis
8. Tinea Ringworm
9. Acne
10. Warts

## Installation Instructions

### Option 1: Use Pre-trained Model (Recommended for MVP)

The app currently uses a mock model for development. To use a real model:

1. Download the model from Hugging Face:
   ```
   https://huggingface.co/Falconsai/skin-disease-classification
   ```

2. Convert to TensorFlow.js format:
   ```bash
   pip install tensorflowjs
   tensorflowjs_converter \
     --input_format=tf_saved_model \
     --output_format=tfjs_graph_model \
     path/to/saved_model \
     public/models/skin-disease/
   ```

3. The converter will create:
   - `model.json` (model architecture)
   - `group1-shard*.bin` (model weights)

### Option 2: Use Mock Model (Current Implementation)

The app automatically falls back to a mock model if `model.json` is not found. This is useful for:
- Development and testing
- Demos without network access
- Prototyping UI/UX

The mock model generates random but realistic-looking predictions for testing purposes.

## Usage

The model is automatically loaded by `src/ai/skinAnalyzer.js` when the Visual Scanner is first accessed.

## Performance

- Model size: ~50MB (varies by architecture)
- Inference time: 1-3 seconds (device-dependent)
- Requires: WebGL support for GPU acceleration

## Privacy

All image processing happens on-device. No data is sent to servers.
