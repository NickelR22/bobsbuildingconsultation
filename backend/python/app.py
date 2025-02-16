from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# Ensure the 'static' directory exists for storing images
STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)

# Store detected images and timestamps
detections = []

@app.route('/upload-screenshot', methods=['POST'])
def upload_screenshot():
    """Receives a screenshot from detector.py and saves it."""
    if "file" not in request.files or "timestamp" not in request.form:
        return jsonify({"error": "Invalid request"}), 400

    file = request.files["file"]
    timestamp = request.form["timestamp"]

    # Save file with a unique name
    filename = f"person_detected_{timestamp}.jpg"
    file_path = os.path.join(STATIC_DIR, filename)
    file.save(file_path)

    # Store detection info
    detections.append({"image": filename, "timestamp": timestamp})

    return jsonify({
        "message": "Screenshot received",
        "screenshot_url": f"http://localhost:5000/static/{filename}",
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
    app.run(debug=True, port=5000)