from flask import Flask, request, redirect, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import random
import string
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

load_dotenv()

# Configuration for Aiven DB (MySQL)
database_url = os.getenv("DATABASE_URL")
if database_url:
    # Convert mysql:// to mysql+pymysql:// for better compatibility
    if database_url.startswith("mysql://"):
        database_url = "mysql+pymysql://" + database_url[8:]
    # Remove any query parameters that pymysql doesn't support
    if "?" in database_url:
        database_url = database_url.split("?")[0]
    
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Base URL for shortened links
app.config["BASE_URL"] = os.getenv("BASE_URL", "http://127.0.0.1:5000")

db = SQLAlchemy(app)

class URL (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    long_url = db.Column(db.Text, nullable=False)
    short_url = db.Column(db.String(10), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

# Generating short code
def generate_code(length=6):
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for _ in range(length))

@app.get("/")
def index():
    return render_template('index.html')

@app.post("/shorten")
def shorten():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid request body"}), 400
            
        long_url = data.get("url")

        if not long_url or not long_url.startswith("http"):
            return jsonify({"error": "Invalid URL"}), 400
        
        # Checking Duplicates
        while True:
            short_url = generate_code()
            if not URL.query.filter_by(short_url=short_url).first():
                break
        
        new_url = URL(long_url=long_url, short_url=short_url)
        db.session.add(new_url)
        db.session.commit()

        base_url = app.config["BASE_URL"]
        shortened_url = f"{base_url}/{short_url}"
        return jsonify({"short_url": short_url, "shortened_url": shortened_url}), 201
    except Exception as e:
        print(f"Error in shorten(): {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@app.get("/<code>")
def redirect_url(code):
    url = URL.query.filter_by(short_url=code).first()

    if url:
        return redirect(url.long_url)
    
    return jsonify({"error": "URL not found"}), 404


@app.get("/health")
def health():
    return "OK"

@app.get("/init")
def init_db():
    db.create_all()
    return "DB Initialized"

if __name__ == "__main__":
    app.run(debug=True)
