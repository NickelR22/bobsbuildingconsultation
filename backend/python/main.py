from flask import Flask, request, jsonify, send_file
import cv2
import numpy as np
import os
from detector import detect_people

app = Flask(__name__)

# Directory for saving screenshots
SCREENSHOT_PATH = "static/screenshot.jpg"
os.makedirs("static", exist_ok=True)  # Ensure directory exists

@app.route('/detect', methods=['POST'])
def detect():
    file = request.files['video']
    video_bytes = np.frombuffer(file.read(), np.uint8)
    video = cv2.imdecode(video_bytes, cv2.IMREAD_COLOR)
    
    detections = []
    screenshot_taken = False

    while True:
        ret, frame = video.read()
        if not ret:
            break
        
        boxes = detect_people(frame)
        if boxes:
            detections.append("Person detected!")

            if not screenshot_taken:  # Take only one screenshot per detection event
                cv2.imwrite(SCREENSHOT_PATH, frame)
                screenshot_taken = True

    video.release()
    return jsonify({"detections": detections})

@app.route('/get-screenshot', methods=['GET'])
def get_screenshot():
    if os.path.exists(SCREENSHOT_PATH):
        return send_file(SCREENSHOT_PATH, mimetype='image/jpeg')
    else:
        return jsonify({"error": "No screenshot available"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)