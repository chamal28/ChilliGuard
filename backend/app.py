from flask import Flask, request, jsonify, g
from flask_cors import CORS
from functools import wraps
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import json
import uuid
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from database.db_models import (
    get_db,
    close_db,
    init_db,
    insert_user,
    get_user_by_email,
    insert_prediction,
    get_user_predictions
)
from disease_knowledge import (
    DISEASE_INFO,
    RECOMMENDATION_SCOPE_NOTE,
    RECOMMENDATION_SCOPE_NOTE_SI
)


app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Model file locations (relative to the backend directory)
MODEL_DIR = os.path.join(BASE_DIR, 'models')

BINARY_MODEL_PATH = os.path.join(
    MODEL_DIR,
    'binary_model',
    'mobilenetv2_binary_v2_best.keras'
)

DISEASE_MODEL_PATH = os.path.join(
    MODEL_DIR,
    'disease_model',
    'chilliguard_disease_best.keras'
)

SEVERITY_MODEL_PATH = os.path.join(
    MODEL_DIR,
    'severity_model',
    'final_severity_model.keras'
)

THRESHOLD_PATH = os.path.join(
    MODEL_DIR,
    'disease_model',
    'class_thresholds.json'
)

# Create a secret key for login tokens
SECRET_KEY_PATH = os.path.join(BASE_DIR, '.chilliguard_secret')
secret_key = os.environ.get('CHILLIGUARD_SECRET_KEY')

if not secret_key:
    try:
        with open(SECRET_KEY_PATH, 'r') as secret_file:
            secret_key = secret_file.read().strip()

    except FileNotFoundError:
        secret_key = os.urandom(32).hex()

        try:
            fd = os.open(
                SECRET_KEY_PATH,
                os.O_WRONLY | os.O_CREAT | os.O_EXCL,
                0o600
            )

            with os.fdopen(fd, 'w') as secret_file:
                secret_file.write(secret_key)

        except FileExistsError:
            with open(SECRET_KEY_PATH, 'r') as secret_file:
                secret_key = secret_file.read().strip()

app.config['SECRET_KEY'] = secret_key

token_serializer = URLSafeTimedSerializer(
    app.config['SECRET_KEY'],
    salt='chilliguard-auth-v1'
)


def create_auth_token(user_id):
    return token_serializer.dumps({
        'user_id': int(user_id)
    })


def auth_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):

        auth_header = request.headers.get('Authorization', '')

        token = (
            auth_header[7:].strip()
            if auth_header.startswith('Bearer ')
            else ''
        )

        if not token:
            return jsonify({
                'success': False,
                'message': 'Authentication required. Please log in.'
            }), 401

        try:
            token_data = token_serializer.loads(
                token,
                max_age=86400
            )

            g.auth_user_id = int(token_data['user_id'])

        except (
            BadSignature,
            SignatureExpired,
            TypeError,
            ValueError,
            KeyError
        ):
            return jsonify({
                'success': False,
                'message': 'Your session is invalid or expired. Please log in again.'
            }), 401

        return view_function(*args, **kwargs)

    return wrapped_view


# Load the trained models
required_files = [
    BINARY_MODEL_PATH,
    DISEASE_MODEL_PATH,
    SEVERITY_MODEL_PATH,
    THRESHOLD_PATH
]

for file_path in required_files:
    if not os.path.isfile(file_path):
        raise FileNotFoundError(
            f'Required model file not found: {file_path}'
        )

print("Loading binary validation model...")

binary_model = tf.keras.models.load_model(
    BINARY_MODEL_PATH,
    compile=False
)

print("Binary validation model loaded.")


print("Loading disease classification model...")

model = tf.keras.models.load_model(
    DISEASE_MODEL_PATH,
    compile=False
)

print("Disease classification model loaded.")


print("Loading severity estimation model...")

severity_model = tf.keras.models.load_model(
    SEVERITY_MODEL_PATH,
    compile=False
)

print("Severity estimation model loaded.")


# Load the disease classification thresholds
with open(THRESHOLD_PATH, 'r') as threshold_file:
    DISEASE_THRESHOLDS = json.load(threshold_file)


CLASS_NAMES = [
    'Bacterial_Leaf_Spot',
    'Cercospora_Spot',
    'Healthy',
    'Leaf_Curl',
    'Powdery_Mildew'
]

VALID_THRESHOLD = 0.5

# These diseases were included in severity model training
SEVERITY_SUPPORTED_DISEASES = [
    'Bacterial_Leaf_Spot',
    'Leaf_Curl',
    'Powdery_Mildew'
]

if not all(name in DISEASE_THRESHOLDS for name in CLASS_NAMES):
    raise ValueError('Disease threshold configuration is incomplete.')


# Initialise the database
with app.app_context():
    init_db()


@app.teardown_appcontext
def teardown_db(exception):
    close_db(exception)


# Register a new user
@app.route('/api/register', methods=['POST'])
def register():

    data = request.get_json(silent=True) or {}

    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not full_name or not email or not password:
        return jsonify({
            'success': False,
            'message': 'All required fields must be completed.'
        }), 400

    if len(password) < 8:
        return jsonify({
            'success': False,
            'message': 'Password must contain at least 8 characters.'
        }), 400

    user_id = insert_user(
        full_name=full_name,
        email=email,
        password_hash=generate_password_hash(password),
        phone=data.get('phone', ''),
        location=data.get('location', '')
    )

    if user_id:
        return jsonify({
            'success': True,
            'message': 'Registration successful!',
            'user_id': user_id
        }), 201

    return jsonify({
        'success': False,
        'message': 'Email already exists.'
    }), 400


# Log in an existing user
@app.route('/api/login', methods=['POST'])
def login():

    data = request.get_json(silent=True) or {}

    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({
            'success': False,
            'message': 'Email and password are required.'
        }), 400

    user = get_user_by_email(email)

    if user and check_password_hash(user['password_hash'], password):

        token = create_auth_token(user['user_id'])

        return jsonify({
            'success': True,
            'message': 'Login successful!',
            'token': token,
            'user': {
                'user_id': user['user_id'],
                'full_name': user['full_name'],
                'email': user['email'],
                'location': user['location']
            }
        }), 200

    return jsonify({
        'success': False,
        'message': 'Invalid email or password.'
    }), 401


# Validate an uploaded image
def validate_leaf_image(img_rgb):

    binary_img = cv2.resize(
        img_rgb,
        (224, 224)
    )

    binary_img = np.array(
        binary_img,
        dtype=np.float32
    )

    binary_img = np.expand_dims(
        binary_img,
        axis=0
    )

    binary_input = preprocess_input(binary_img)

    prediction = binary_model.predict(
        binary_input,
        verbose=0
    )

    valid_probability = float(
        np.asarray(prediction).reshape(-1)[0]
    )

    return valid_probability



# Classify diseases using the trained multi-label model
def classify_diseases(img_rgb):

    disease_img = cv2.resize(
        img_rgb,
        (256, 256)
    )

    # Create augmented images for prediction
    img_original = disease_img.copy()

    img_flipped = cv2.flip(
        disease_img,
        1
    )

    img_rotated = cv2.rotate(
        disease_img,
        cv2.ROTATE_90_CLOCKWISE
    )

    img_array = np.array(
        [
            img_original,
            img_flipped,
            img_rotated
        ],
        dtype=np.float32
    )

    # Apply MobileNetV2 preprocessing
    img_array = preprocess_input(img_array)

    # Predict disease probabilities
    predictions = model.predict(
        img_array,
        verbose=0
    )

    # Average predictions from all augmented images
    final_prediction = np.mean(
        predictions,
        axis=0
    )

    final_prediction = np.asarray(
        final_prediction
    ).reshape(-1)

    results = []

    # Check each disease against its optimized threshold
    for index, class_name in enumerate(CLASS_NAMES):

        confidence = float(final_prediction[index])

        threshold = float(
            DISEASE_THRESHOLDS[class_name]
        )

        if confidence >= threshold:

            disease_info = DISEASE_INFO[class_name]

            results.append({

                # Disease identification
                'class_name': class_name,

                # English information
                'disease_name': disease_info['display_name'],
                'is_curable': disease_info['curable'],
                'treatment': disease_info['action'],
                'prevention': disease_info['prevention'],

                # Sinhala information
                'disease_name_si': disease_info['display_name_si'],
                'is_curable_si': disease_info['curable_si'],
                'treatment_si': disease_info['action_si'],
                'prevention_si': disease_info['prevention_si'],

                # Prediction information
                'confidence_score': round(
                    confidence * 100,
                    2
                ),

                'threshold': threshold,

                # Severity is estimated separately
                'severity': None,

                # Recommendation source
                'source': disease_info['source'],
                'source_url': disease_info['source_url']
            })

    return results, final_prediction



# Estimate disease severity
def estimate_severity(img_rgb):

    severity_img = cv2.resize(
        img_rgb,
        (224, 224)
    )

    severity_img = np.array(
        severity_img,
        dtype=np.float32
    )

    severity_img = np.expand_dims(
        severity_img,
        axis=0
    )

    # The severity model has its own Rescaling layer
    prediction = severity_model.predict(
        severity_img,
        verbose=0
    )

    advanced_probability = float(
        np.asarray(prediction).reshape(-1)[0]
    )

    if advanced_probability >= 0.5:

        stage = 'Advanced'
        stage_confidence = advanced_probability

    else:

        stage = 'Early'
        stage_confidence = 1 - advanced_probability

    return {
        'stage': stage,
        'advanced_probability': round(
            advanced_probability * 100,
            2
        ),
        'confidence_score': round(
            stage_confidence * 100,
            2
        )
    }


# Predict the disease from an uploaded leaf image
@app.route('/api/predict', methods=['POST'])
@auth_required
def predict():

    if 'image' not in request.files:
        return jsonify({
            'success': False,
            'message': 'No image uploaded.'
        }), 400

    file = request.files['image']

    user_id = g.auth_user_id

    if file.filename == '':
        return jsonify({
            'success': False,
            'message': 'No image selected.'
        }), 400

    allowed_extensions = {
        'jpg',
        'jpeg',
        'png'
    }

    safe_filename = secure_filename(file.filename)

    extension = safe_filename.rsplit(
        '.',
        1
    )[-1].lower() if '.' in safe_filename else ''

    if extension not in allowed_extensions:
        return jsonify({
            'success': False,
            'message': 'Only JPG, JPEG and PNG images are allowed.'
        }), 400

    unique_filename = (
        f'{uuid.uuid4().hex}.{extension}'
    )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        unique_filename
    )

    file.save(file_path)

    img_check = cv2.imread(file_path)

    if img_check is None:

        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({
            'success': False,
            'message': 'Invalid image file. Please upload a valid image.'
        }), 400

    img_rgb = cv2.cvtColor(
        img_check,
        cv2.COLOR_BGR2RGB
    )

    # Validate the uploaded chilli leaf image
    valid_probability = validate_leaf_image(img_rgb)

    if valid_probability < VALID_THRESHOLD:

        return jsonify({
            'success': False,
            'message': 'Please upload a valid Nai Miris chilli leaf image.',
            'validation': {
                'is_valid': False,
                'valid_probability': round(
                    valid_probability * 100,
                    2
                )
            }
        }), 400

    # Predict all diseases that pass their thresholds
    detected_diseases, probabilities = classify_diseases(img_rgb)

    uncertain_candidate = None

    # Handle images where no disease passes its threshold
    if not detected_diseases:

        best_index = int(
            np.argmax(probabilities)
        )

        candidate_class = CLASS_NAMES[best_index]
        candidate_info = DISEASE_INFO[candidate_class]

        uncertain_candidate = {
            'class_name': candidate_class,

            # English and Sinhala disease names
            'disease_name': candidate_info['display_name'],
            'disease_name_si': candidate_info['display_name_si'],

            'confidence_score': round(
                float(probabilities[best_index]) * 100,
                2
            ),

            # Uncertain prediction messages
            'message': (
                'This is an uncertain prediction and is not a confirmed diagnosis.'
            ),
            'message_si': (
                'මෙය නිශ්චිත රෝග විනිශ්චයක් නොවේ. '
                'මෙම ප්‍රතිඵලය තහවුරු කළ රෝගයක් ලෙස නොසලකන්න.'
            )
        }

    # Estimate severity for supported diseases
    severity_result = None

    severity_diseases = [
        disease for disease in detected_diseases
        if disease['class_name'] in SEVERITY_SUPPORTED_DISEASES
    ]

    if severity_diseases:

        severity_result = estimate_severity(img_rgb)

        for disease in severity_diseases:
            disease['severity'] = severity_result

    # Prepare the result
    if detected_diseases:

        result_status = 'detected'

        result_message = (
            'Disease classification completed.'
        )

        result_message_si = (
            'රෝග වර්ගීකරණය සම්පූර්ණයි.'
        )

        primary_disease = max(
            detected_diseases,
            key=lambda item: item['confidence_score']
        )

        database_disease_name = ', '.join(
            item['disease_name']
            for item in detected_diseases
        )

        database_confidence = primary_disease['confidence_score']

        database_severity = (
            severity_result['stage']
            if severity_result
            else 'Not applicable'
        )

        database_recommendation = ' '.join(
            item['treatment']
            for item in detected_diseases
        )

    else:

        result_status = 'uncertain'

        result_message = (
            'No disease passed its classification threshold. '
            'Please upload another clear image or consult an agricultural expert.'
        )

        result_message_si = (
            'කිසිදු රෝගයක් එහි වර්ගීකරණ සීමාව ඉක්මවා හඳුනාගෙන නොමැත. '
            'වඩාත් පැහැදිලි පත්‍ර ඡායාරූපයක් නැවත උඩුගත කරන්න '
            'හෝ කෘෂිකර්ම නිලධාරියෙකුගෙන් උපදෙස් ලබාගන්න.'
        )

        database_disease_name = (
            'Uncertain: ' + uncertain_candidate['disease_name']
        )

        database_confidence = uncertain_candidate['confidence_score']

        database_severity = 'Not assessed'

        database_recommendation = (
            'The prediction is uncertain. '
            'Please consult an agricultural expert.'
        )

    result = {
        'status': result_status,

        # Result messages in both languages
        'message': result_message,
        'message_si': result_message_si,

        # Disease predictions
        'detected_diseases': detected_diseases,
        'uncertain_candidate': uncertain_candidate,

        # Severity information
        'severity': severity_result,

        # Recommendation source and scope notes
        'recommendation_scope_note': RECOMMENDATION_SCOPE_NOTE,
        'recommendation_scope_note_si': RECOMMENDATION_SCOPE_NOTE_SI
    }

    # Save the prediction for the logged-in user
    pred_id = insert_prediction(
        user_id=user_id,
        image_path=file_path,
        disease_name=database_disease_name,
        confidence_score=database_confidence,
        severity_level=database_severity,
        recommendation=database_recommendation
    )

    return jsonify({
        'success': True,
        'prediction_id': pred_id,
        'validation': {
            'is_valid': True,
            'valid_probability': round(
                valid_probability * 100,
                2
            )
        },
        'result': result
    }), 200


# Get the logged-in user's prediction history
@app.route('/api/history', methods=['GET'])
@auth_required
def get_history():

    user_id = g.auth_user_id

    predictions = get_user_predictions(user_id)

    results = []

    for pred in predictions:

        results.append({
            'prediction_id': pred['prediction_id'],
            'disease_name': pred['disease_name'],
            'confidence_score': pred['confidence_score'],
            'severity_level': pred['severity_level'],
            'timestamp': pred['timestamp']
        })

    return jsonify({
        'success': True,
        'history': results
    }), 200


# Get dashboard statistics for the logged-in user
@app.route('/api/dashboard', methods=['GET'])
@auth_required
def dashboard():

    user_id = g.auth_user_id

    db = get_db()
    cursor = db.cursor()

    cursor.execute('''
        SELECT
            COUNT(*) AS total_scans,

            SUM(
                CASE
                    WHEN LOWER(disease_name) LIKE '%healthy%'
                    THEN 1
                    ELSE 0
                END
            ) AS healthy_scans,

            SUM(
                CASE
                    WHEN LOWER(disease_name) LIKE '%healthy%'
                    THEN 0
                    ELSE 1
                END
            ) AS disease_scans,

            SUM(
                CASE
                    WHEN strftime('%Y-%m', timestamp) =
                         strftime('%Y-%m', 'now', 'localtime')
                    THEN 1
                    ELSE 0
                END
            ) AS monthly_scans,

            SUM(
                CASE
                    WHEN strftime('%Y-%m', timestamp) =
                         strftime('%Y-%m', 'now', 'localtime')
                         AND LOWER(disease_name) NOT LIKE '%healthy%'
                    THEN 1
                    ELSE 0
                END
            ) AS monthly_disease_scans

        FROM prediction
        WHERE user_id = ?
    ''', (user_id,))

    stats = cursor.fetchone()

    cursor.execute('''
        SELECT
            prediction_id,
            disease_name,
            confidence_score,
            severity_level,
            timestamp
        FROM prediction
        WHERE user_id = ?
        ORDER BY timestamp DESC
        LIMIT 5
    ''', (user_id,))

    recent_predictions = cursor.fetchall()

    return jsonify({
        'success': True,
        'statistics': {
            'total_scans': stats['total_scans'] or 0,
            'disease_scans': stats['disease_scans'] or 0,
            'healthy_scans': stats['healthy_scans'] or 0,
            'monthly_scans': stats['monthly_scans'] or 0,
            'monthly_disease_scans': stats['monthly_disease_scans'] or 0
        },
        'recent_predictions': [
            {
                'prediction_id': item['prediction_id'],
                'disease_name': item['disease_name'],
                'confidence_score': item['confidence_score'],
                'severity_level': item['severity_level'],
                'timestamp': item['timestamp']
            }
            for item in recent_predictions
        ]
    }), 200


# Check whether the API is running
@app.route('/api/health', methods=['GET'])
def health_check():

    return jsonify({
        'status': 'OK',
        'message': 'ChilliGuard API is running.'
    }), 200


if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
