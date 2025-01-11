from flask import Flask, request, jsonify, send_file, send_from_directory
from PIL import Image
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__, static_folder="../client/build", static_url_path="")
app.url_map.strict_slashes = False
CORS(app)

@app.route('/upload-image', methods=['POST'])
def upload_image():
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

if __name__ == '__main__':
    app.run(debug=True)
