from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import base64

app = Flask(__name__)
CORS(app)
# Ensure the 'static' directory exists for storing images
STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)

CLEAN_ON_START = True

# Store detected images and timestamps
detections = []

if CLEAN_ON_START:
    for fname in os.listdir(STATIC_DIR):
        if not fname.endswith(".jpg"):
            continue

        fpath = os.path.join(STATIC_DIR, fname)
        os.remove(fpath)

@app.route('/upload-screenshot', methods=['POST'])
def upload_screenshot():
    """Receives a screenshot from detector.py and saves it."""
    if "file" not in request.files or "timestamp" not in request.form:
        return jsonify({"error": "Invalid request"}), 400

    file = request.files["file"]
    timestamp = request.form["timestamp"]

    # Save file with a unique name
    filename = f"person_detected_{timestamp}.jpg"
    #file_path = os.path.join(STATIC_DIR, filename)
    #file.save(file_path)
    image = base64.b64encode(file.read()).decode('utf-8')

    # Store detection info
    detections.append({"image": image, "timestamp": timestamp})

    return jsonify({
        "message": "Screenshot received",
        "screenshot_url": f"http://localhost:8080/static/{filename}",
        "timestamp": timestamp
    })

@app.route('/get-detections', methods=['GET'])
def get_detections():
    """Returns a list of detected images and timestamps."""
    return jsonify(detections)

@app.route('/static/<filename>', methods=['GET'])
def serve_image(filename):
    """Serves saved images."""
    return send_from_directory(STATIC_DIR, filename)

if __name__ == "__main__":
    app.run(debug=True, port=8080, threaded=True)
