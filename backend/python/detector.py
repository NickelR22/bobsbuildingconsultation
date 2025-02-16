import numpy as np
import cv2
import time
import requests
import os

# Initialize HOG descriptor for person detection
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

cv2.startWindowThread()

# Open webcam video stream
cap = cv2.VideoCapture(0)

CONFIDENCE_THRESHOLD = 0.80  # Adjust as needed
SERVER_URL = "http://localhost:8080/upload-screenshot"  # Flask backend URL
STATIC_FOLDER = "static"

if not os.path.exists(STATIC_FOLDER):
    os.makedirs(STATIC_FOLDER)

last_screenshot_time = 0  # Track last screenshot time
COOLDOWN_TIME = 10  # Cooldown in seconds

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize frame for faster detection
    frame = cv2.resize(frame, (640, 480))
    gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)

    # Detect people in the frame
    boxes, weights = hog.detectMultiScale(frame, winStride=(8, 8))

    # Filter detections based on confidence
    boxes = [(x, y, x + w, y + h) for (x, y, w, h), weight in zip(boxes, weights) if weight > CONFIDENCE_THRESHOLD]
    current_time = time.time()
    if boxes and (current_time - last_screenshot_time > COOLDOWN_TIME):
        last_screenshot_time = current_time  # Update last screenshot time
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        screenshot_path = f"screenshot_{timestamp}.jpg"

        cv2.imwrite(screenshot_path, frame)  # Save image locally
        print(f"Screenshot saved: {screenshot_path}")

        # Send image and timestamp to Flask backend
        with open(screenshot_path, "rb") as img:
            files = {"file": img}
            response = requests.post(SERVER_URL, files=files, data={"timestamp": timestamp})

            if response.status_code == 200:
                print("Screenshot uploaded successfully!")
            else:
                print("Failed to upload screenshot:", response.text)


    for (xA, yA, xB, yB) in boxes:
        cv2.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 0), 2)

    cv2.imshow('frame', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
cv2.waitKey(1)
