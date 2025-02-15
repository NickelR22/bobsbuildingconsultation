from flask import Flask, request, jsonify
import cv2
from detector import detect_people

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():
    file = request.files['video']
    video = cv2.VideoCapture(file)
    
    detections = []
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break
        boxes = detect_people(frame)
        if boxes:
            detections.append("Person detected!")

    video.release()
    return jsonify({"detections": detections})

if __name__ == "__main__":
    app.run(debug=True)
