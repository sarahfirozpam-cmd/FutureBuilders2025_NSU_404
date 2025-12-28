"""
Download pre-trained MobileNet model in TensorFlow.js format
This provides a working AI model for the Visual Scanner demo
"""
import os
import urllib.request
import json

OUTPUT_DIR = "public/models/skin-disease"

print("📦 Setting up AI model for Visual Scanner...")

# Create directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Download MobileNet model files from TensorFlow.js
MODEL_URL = "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"

print("\n⏬ Downloading model architecture...")

try:
    # Download model.json
    urllib.request.urlretrieve(MODEL_URL, os.path.join(OUTPUT_DIR, "model.json"))
    print("✓ model.json downloaded")
    
    # Read model.json to get weight files
    with open(os.path.join(OUTPUT_DIR, "model.json"), 'r') as f:
        model_data = json.load(f)
    
    # Download weight files
    base_url = "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/"
    
    if 'weightsManifest' in model_data:
        print("\n⏬ Downloading model weights...")
        for manifest in model_data['weightsManifest']:
            for weight_file in manifest['paths']:
                print(f"  Downloading {weight_file}...")
                weight_url = base_url + weight_file
                urllib.request.urlretrieve(weight_url, os.path.join(OUTPUT_DIR, weight_file))
                print(f"  ✓ {weight_file}")
    
    print("\n✅ Model successfully downloaded!")
    print(f"\n📁 Model files saved in: {OUTPUT_DIR}")
    print("\nFiles created:")
    for file in os.listdir(OUTPUT_DIR):
        print(f"  - {file}")
    
    print("\n⚠️  NOTE: This is MobileNet trained on general images.")
    print("For medical accuracy, it would need fine-tuning on skin disease data.")
    print("However, it demonstrates the full AI workflow for your hackathon demo!")
    
    print("\n🚀 Your Visual Scanner will now use real AI predictions!")
    
except Exception as e:
    print(f"\n❌ Error downloading model: {e}")
    print("\n💡 The mock model will continue working for your demo.")
    print("For production, consider using a medically-trained model.")
