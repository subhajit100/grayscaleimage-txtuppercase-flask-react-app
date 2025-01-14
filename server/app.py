from flask import Flask, request, jsonify, send_file, send_from_directory, make_response
from PIL import Image
from io import BytesIO
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies
from flask_sqlalchemy import SQLAlchemy
from config import Config
import os

db = SQLAlchemy()
app = Flask(__name__, static_folder="../client/build", static_url_path="")
app.url_map.strict_slashes = False

# take environment variables from config file
app.config.from_object(Config)

jwt = JWTManager(app)
CORS(app, supports_credentials=True)

# initialize the app with the extension
db.init_app(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

# # Middleware 1: Logging
# @app.before_request
# def log_request():
#     print(f"Request: {request.method} {request.url}")
#     # Log additional details like headers or IP if needed
#     print(f"Headers: {request.headers}")    

# 1. Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists!"}), 400

    # Add user to the database
    # TODO:- encrypt the password before storing to db for security
    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

# 2. Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Verify user credentials
    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:
        return jsonify({"message": "Invalid credentials!"}), 401

    # Create JWT token
    access_token = create_access_token(identity=email)
    # return jsonify(access_token=access_token), 200
    
    # Set token in a cookie
    response = make_response(jsonify({"message": "Login successful!"}), 200)
    # response.set_cookie(
    #     "access_token", access_token, httponly=True, secure=False, max_age=60
    # )
    set_access_cookies(response, access_token, max_age=60*10)
    return response

# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully!"}), 200)
    response.delete_cookie("access_token")
    response.delete_cookie("csrf_access_token")
    return response
    

@app.route('/upload-image', methods=['POST'])
@jwt_required(locations=['cookies'])
def upload_image():
    current_user = get_jwt_identity()
    print(f"Welcome {current_user}! This is a protected route.")
    """Receive the image, convert it to grayscale, and send it back."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    # Get the uploaded image
    uploaded_file = request.files['image']

    try:
        # Open the image and convert it to grayscale
        img = Image.open(uploaded_file)
        grayscale_img = img.convert('L')  # Convert to grayscale (L mode)

        # Save the grayscale image to a BytesIO object
        img_io = BytesIO()
        grayscale_img.save(img_io, 'JPEG')
        img_io.seek(0)

        # Send the grayscale image back to the frontend
        return send_file(img_io, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/upload-text', methods=['POST'])
@jwt_required(locations=['cookies'])
def upload_text():
    # Check if a file is uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Read file content and transform to uppercase
        content = file.read().decode('utf-8').upper()

        # Save the transformed content to a temporary in-memory file
        transformed_file = BytesIO()
        transformed_file.write(content.encode('utf-8'))
        transformed_file.seek(0)  # Move the pointer to the start of the file

        # Send the file back as a downloadable attachment
        return send_file(
            transformed_file,
            as_attachment=True,
            download_name=f"uppercase_{file.filename}",
            mimetype='text/plain'
        ) 
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Frontend React App will be served at /
@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")    

def create_db():
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    create_db()
    app.run(debug=True)
    ## For docker deployments
    # create_db()
    # port = int(os.environ.get("PORT", 5000))
    # app.run(host="0.0.0.0", port=port, debug=True)
