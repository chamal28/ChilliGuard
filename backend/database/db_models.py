
# DB_MODELS.PY - SQLite Database Configuration & Models


import sqlite3
import os
from flask import g

# Database file path
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'chilli_guard.db')

def get_db():
    """Get database connection - one per request"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE_PATH)
        db.row_factory = sqlite3.Row  # Allows column access by name
    return db

def init_db():
    """Create tables if they don't exist"""
    db = get_db()
    cursor = db.cursor()
    
    # Create User Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            phone VARCHAR(15),
            location VARCHAR(50),
            registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create Prediction Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prediction (
            prediction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            image_path VARCHAR(255) NOT NULL,
            disease_name VARCHAR(100) NOT NULL,
            confidence_score FLOAT NOT NULL,
            severity_level VARCHAR(20) NOT NULL,
            recommendation TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
        )
    ''')
    
    # Create indexes for faster queries
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_prediction_user_id ON prediction(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_prediction_timestamp ON prediction(timestamp)')
    
    db.commit()
    print("✅ Database initialized successfully!")

def close_db(exception=None):
    """Close database connection at end of request"""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# ============================================================
# Database Helper Functions (CRUD Operations)
# ============================================================

def insert_user(full_name, email, password_hash, phone, location):
    """Insert a new user into database"""
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute('''
            INSERT INTO user (full_name, email, password_hash, phone, location)
            VALUES (?, ?, ?, ?, ?)
        ''', (full_name, email, password_hash, phone, location))
        db.commit()
        return cursor.lastrowid  # Return new user_id
    except sqlite3.IntegrityError:
        return None  # Email already exists

def get_user_by_email(email):
    """Get user by email"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user WHERE email = ?', (email,))
    return cursor.fetchone()

def insert_prediction(user_id, image_path, disease_name, confidence_score, severity_level, recommendation):
    """Insert a prediction record"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO prediction (user_id, image_path, disease_name, confidence_score, severity_level, recommendation)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, image_path, disease_name, confidence_score, severity_level, recommendation))
    db.commit()
    return cursor.lastrowid

def get_user_predictions(user_id, limit=10):
    """Get user's prediction history"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT * FROM prediction 
        WHERE user_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ?
    ''', (user_id, limit))
    return cursor.fetchall()
