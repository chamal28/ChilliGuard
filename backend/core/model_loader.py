import os
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_ROOT = os.environ.get(
    "CHILLIGUARD_MODEL_DIR",
    os.path.join(BASE_DIR, "models")
)

# Prevent unnecessary GPU memory allocation
for gpu in tf.config.list_physical_devices("GPU"):
    try:
        tf.config.experimental.set_memory_growth(gpu, True)
    except RuntimeError:
        pass

BINARY_MODEL_PATH = os.path.join(
    MODEL_ROOT, "binary_model",
    "mobilenetv2_binary_v2_best.keras"
)

DISEASE_MODEL_PATH = os.path.join(
    MODEL_ROOT, "disease_model",
    "chilliguard_disease_best.keras"
)

SEVERITY_MODEL_PATH = os.path.join(
    MODEL_ROOT, "severity_model",
    "final_severity_model.keras"
)

def load_chilliguard_models():
    paths = {
        "binary": BINARY_MODEL_PATH,
        "disease": DISEASE_MODEL_PATH,
        "severity": SEVERITY_MODEL_PATH
    }

    for name, path in paths.items():
        if not os.path.isfile(path):
            raise FileNotFoundError(
                f"{name} model not found: {path}"
            )

    print("Loading ChilliGuard Binary Validation Model...")
    binary_model = tf.keras.models.load_model(
        BINARY_MODEL_PATH, compile=False
    )

    print("Loading ChilliGuard Disease Detection Model...")
    disease_model = tf.keras.models.load_model(
        DISEASE_MODEL_PATH, compile=False
    )

    print("Loading ChilliGuard Severity Detection Model...")
    severity_model = tf.keras.models.load_model(
        SEVERITY_MODEL_PATH, compile=False
    )

    print("All three ChilliGuard models loaded successfully.")

    return {
        "binary": binary_model,
        "disease": disease_model,
        "severity": severity_model
    }
