# ChilliGuard
### Lightweight AI System for Real-Field Chilli Leaf Disease Detection under Sri Lankan Conditions

ChilliGuard is an AI-powered chilli leaf disease detection system developed to support the identification of chilli leaf diseases using real-field images captured under Sri Lankan agricultural conditions.

The system focuses on *Capsicum frutescens* (Nai Miris / Kochchi / Bird's Eye Chili) and uses lightweight MobileNetV2-based deep learning models to validate chilli leaf images, identify disease categories, and estimate disease severity for selected diseases.

---

## Project Overview

ChilliGuard addresses the challenges of chilli leaf disease identification in real agricultural environments, where variations in lighting, backgrounds, and image quality can affect automated disease recognition.

The research focuses on real-field chilli leaf images collected under Sri Lankan conditions. The system integrates AI-based leaf validation, multi-label disease classification, severity estimation, and farmer-oriented recommendations into a web-based application.

## Research Objectives

1. To critically review the problem domain of chilli leaf disease detection under Sri Lankan agricultural conditions.
2. To critically study relevant technologies and deep learning approaches for lightweight image-based disease detection.
3. To design and develop an AI-based system for real-field chilli leaf disease detection and severity estimation.
4. To evaluate the proposed system using appropriate model performance metrics and functional testing.
5. To prepare the final project documentation.

## Key Features

- Farmer registration and login.
- Upload chilli leaf images for AI-based analysis.
- Automatic chilli leaf image validation.
- Multi-label chilli leaf disease classification.
- Disease confidence scores and threshold-based predictions.
- Severity estimation for supported disease categories.
- Sinhala-language disease recommendations.
- Prediction history management.
- Farmer dashboard with prediction statistics.
- Responsive web interface.

## Supported Disease Categories

| Category | Description |
|---|---|
| Bacterial Leaf Spot | Bacterial leaf infection |
| Cercospora Spot | Fungal leaf spot disease |
| Healthy | Healthy chilli leaf |
| Leaf Curl | Chilli leaf curl disease |
| Powdery Mildew | Powdery mildew infection |

The classification component supports multi-label predictions, allowing more than one disease category to be identified when the corresponding thresholds are satisfied.

**Severity estimation:** The severity estimation component is implemented for Bacterial Leaf Spot, Leaf Curl, and Powdery Mildew. It is not applied to Healthy or Cercospora Spot predictions.

## System Architecture

ChilliGuard consists of a frontend, Flask backend, SQLite database, and three AI model components.

1. **Binary Leaf Validation Model** – checks whether the uploaded image is a valid chilli leaf image.
2. **Disease Classification Model** – identifies supported disease categories using multi-label classification.
3. **Severity Estimation Model** – estimates severity for supported disease categories.

The backend manages image preprocessing, model inference, database operations, and API communication.

## Technologies Used

| Component | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Backend | Python, Flask, Flask-CORS |
| Deep Learning | TensorFlow, Keras, MobileNetV2 |
| Image Processing | OpenCV |
| Database | SQLite |
| Development | Visual Studio Code, WAMP Server |
| Version Control | Git and GitHub |

## Model Evaluation Results

The following results were obtained from the reported model evaluation experiments.

### Disease Classification Model

| Metric | Result |
|---|---:|
| Macro Precision | 54.35% |
| Macro Recall | 73.86% |
| Macro F1-score | 62.53% |
| Micro Precision | 60.31% |
| Micro Recall | 81.82% |
| Micro F1-score | 69.44% |

### Severity Estimation Model – Phase 1

| Metric | Result |
|---|---:|
| Accuracy | 86.27% |
| Precision | 92.59% |
| Recall | 83.33% |
| F1-score | 87.72% |
| ROC-AUC | 88.29% |

### Binary Leaf Validation Model

The binary validation model achieved 100% on the reported test metrics.

*Note: These results represent the reported experimental evaluations. They should not be interpreted as a guarantee of performance on all unseen field conditions.*

## Dataset Information

The research uses real-field chilli leaf images collected under Sri Lankan conditions, focusing on Nai Miris / Kochchi chilli plants.

The dataset includes five classification categories:

- Bacterial Leaf Spot
- Cercospora Spot
- Healthy
- Leaf Curl
- Powdery Mildew

The dataset underwent duplicate identification and data cleaning before the final model training and evaluation process.

**Dataset availability:** The original dataset is not included in this GitHub repository because of its large size. The repository contains the application source code and selected trained model files.

## Project Structure

```text
ChilliGuard/
│
├── backend/
│   ├── api/
│   ├── core/
│   ├── database/
│   ├── models/
│   │   ├── binary_model/
│   │   ├── disease_model/
│   │   └── severity_model/
│   ├── app.py
│   ├── disease_knowledge.py
│   └── requirements.txt
│
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   ├── pages/
│   └── index.html
│
├── docs/
│   └── testing_evidence/
│
├── project_structure.txt
└── .gitignore
```

## Installation and Setup

### Prerequisites

- Python environment compatible with the listed dependencies.
- WAMP Server or another local web server.
- Git.
- A supported environment for TensorFlow 2.15.

### 1. Clone the Repository

```bash
git clone https://github.com/chamal28/ChilliGuard.git
cd ChilliGuard
```

### 2. Create a Python Virtual Environment

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\\Scripts\\activate
```

Activate it on Linux / WSL:

```bash
source .venv/bin/activate
```

### 3. Install Backend Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Configure the Backend

Ensure that the trained model files are available in the corresponding directories under:

```text
backend/models/
```

Configure the required environment variables and application secrets according to the backend configuration.

### 5. Start the Backend

```bash
python backend/app.py
```

The Flask backend is configured to run locally on:

```text
http://localhost:5000
```

### 6. Run the Frontend

Place or access the project frontend through your local web server.

For a WAMP setup, the frontend can be accessed through:

```text
http://localhost/ChilliGuard/frontend/
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User authentication |
| POST | `/api/predict` | AI-based image prediction |
| GET | `/api/history` | Retrieve prediction history |
| GET | `/api/dashboard` | Retrieve dashboard information |
| GET | `/api/health` | Backend health check |

## Testing and Verification

The project includes testing evidence covering:

- API testing
- User interface testing
- AI prediction testing
- Integration testing
- Database design evidence
- System design diagrams
- Responsive interface testing

Testing screenshots and supporting evidence are available under:

```text
docs/testing_evidence/
```

## Research Contribution

The main research contribution of ChilliGuard is its focus on lightweight AI-based chilli leaf disease detection using real-field images collected under Sri Lankan conditions.

The system combines image validation, multi-label disease classification, and severity estimation within a single farmer-oriented application.

The research also considers the challenges of real-world image variation and the practical use of AI-based disease identification in local chilli cultivation.

## Limitations

- The model is developed using a specific real-field dataset and supported chilli disease categories.
- Prediction performance may vary with image quality, lighting, background, and unseen field conditions.
- Severity estimation is limited to the supported disease categories.
- The system is a decision-support tool and does not replace professional agricultural diagnosis.

## Future Improvements

- Expand the real-field dataset with additional samples and cultivation conditions.
- Improve disease classification performance through further experimentation.
- Evaluate the system across more diverse field environments.
- Explore deployment options for low-resource mobile devices.
- Conduct broader real-world evaluation with farmers.

## Author

**Chamalka Ranathunga**

BSc (Hons) Computing – Software Engineering Top-up

Research Project: ChilliGuard

## Repository

GitHub: https://github.com/chamal28/ChilliGuard
