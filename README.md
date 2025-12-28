# GramSheba AI: Offline Primary Healthcare MVP

**GramSheba AI** is a Progressive Web Application (PWA) designed to provide critical primary healthcare support to users in rural Bangladesh. Built with an "Offline-First" philosophy, it leverages on-device machine learning to provide symptom analysis and health triage even in areas with zero internet connectivity.

## 🌟 Key Features

* **Offline AI Symptom Checker:** Uses TensorFlow.js to run lightweight ML models locally for instant triage.
* **Voice-First Interface:** Integrated Web Speech API for Bengali voice input, assisting users with low literacy.
* **Vital Signs Monitoring:** Track blood pressure, pulse, and glucose with AI-driven risk prediction.
* **Bilingual Support:** Full localization in **Bengali (Bangla)** and English via `i18next`.
* **Hybrid Telemedicine:** Queue doctor consultation requests while offline; automatic synchronization when a connection is detected.
* **Health Library:** Pre-cached educational content (articles and videos) stored in IndexedDB.

---

## 🛠️ Tech Stack (2025 Standards)

| Category | Technology | Version |
| --- | --- | --- |
| **Frontend Framework** | React.js | 19.x |
| **Build Tool** | Vite | 6.x |
| **AI/ML Engine** | TensorFlow.js | 4.x |
| **State Management** | Zustand | 5.x |
| **Local Database** | Dexie.js (IndexedDB) | 4.x |
| **Offline/PWA** | Workbox | 8.x |
| **UI Library** | Material-UI (MUI) | 6.x |
| **Localization** | i18next | 24.x |

---

## 📂 Project Structure

```text
src/
├── assets/             # Pre-loaded images and local model files
├── components/         # Shared UI components (Layout, Header, VoiceInput)
├── features/
│   ├── ai-engine/      # TensorFlow.js models and prediction logic
│   ├── symptom-checker/ # Symptom forms and triage logic
│   ├── vitals/         # Vital signs tracking and risk analysis
│   └── education/      # Content delivery and offline caching
├── hooks/              # Custom hooks (useOffline, useSpeech)
├── i18n/               # Bengali/English translation files
├── services/           # Dexie.js DB config and Axios API sync
└── store/              # Zustand state for global app data

```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 22.x or higher
* npm 10.x+

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/ruralcare-ai.git
cd ruralcare-ai

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure the ML Model:**
Place your pre-trained `model.json` and binary weights in `public/models/symptom_checker/`.
4. **Run Development Server:**
```bash
npm run dev

```



### Building for Production (PWA)

To test offline capabilities and service worker registration:

```bash
npm run build
npm run preview

```

---

## 🧠 AI & Offline Integration

### On-Device Inference

The application avoids server-side inference to ensure reliability.

```javascript
// Example: src/features/ai-engine/triageModel.js
import * as tf from '@tensorflow/tfjs';

export const runInference = async (inputData) => {
  const model = await tf.loadLayersModel('indexeddb://symptom-model');
  const prediction = model.predict(tf.tensor([inputData]));
  return prediction;
};

```

### Data Synchronization

All user inputs are saved to **Dexie.js** first. The `Background Sync` API (via Workbox) detects when the user regains 4G/Edge connectivity and pushes the telemedicine queue to the backend.

---

## ♿ Accessibility & Localization

* **Voice Search:** Click the microphone icon to describe symptoms in Bengali.
* **Screen Readers:** Fully compliant with ARIA labels for accessibility.
* **Low-Bandwidth Mode:** Images and videos are lazily loaded and cached only upon user request to save data.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.