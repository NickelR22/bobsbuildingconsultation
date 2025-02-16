import numpy as np
import cv2
import time

# Initialize HOG descriptor for person detection
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

cv2.startWindowThread()

# Open webcam video stream
cap = cv2.VideoCapture(0)

CONFIDENCE_THRESHOLD = 0.4  # Adjust as needed
screenshot_taken = False  # Ensure only one screenshot per detection event

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize frame for faster detection
    frame = cv2.resize(frame, (640, 480))
    gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)

    # Detect people in the frame
    boxes, weights = hog.detectMultiScale(frame, winStride=(8,8))

    # Filter detections based on confidence
    boxes = [(x, y, x + w, y + h) for (x, y, w, h), weight in zip(boxes, weights) if weight > CONFIDENCE_THRESHOLD]

    if boxes and not screenshot_taken:  # Take a screenshot only once per event
        screenshot_path = "static/screenshot.jpg"
        cv2.imwrite(screenshot_path, frame)  # Save image
        print(f"Screenshot saved: {screenshot_path}")
        screenshot_taken = True  # Prevent multiple captures for the same event
        time.sleep(3)  # Avoid taking screenshots too frequently

    for (xA, yA, xB, yB) in boxes:
        cv2.rectangle(frame, (xA, yA), (xB, yB), (0, 255, 0), 2)

    cv2.imshow('frame', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
cv2.waitKey(1)