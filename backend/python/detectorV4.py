# load libraries
from huggingface_hub import hf_hub_download
from ultralytics import YOLO
from supervision import Detections
from PIL import Image
import numpy as np
import cv2;
import datetime
import time
import requests
import os

# download model
model_path = hf_hub_download(repo_id="kesimeg/yolov8n-clothing-detection", filename="best.pt")
model_path2 = hf_hub_download(repo_id="arnabdhar/YOLOv8-Face-Detection", filename="model.pt")

# load model
model = YOLO(model_path)
model2 = YOLO(model_path2)

cap = cv2.VideoCapture(0)
os.makedirs("images", exist_ok=True)
base_path = os.path.join("images", "cameraCapture")

SERVER_URL = "http://localhost:8080/upload-screenshot"  # Flask backend URL

n = 0
while True:
    ret, frame = cap.read()
    cv2.imshow('frame', frame)
    if cv2.waitKey(20) & 0xFF == ord('q'):
        break
    if n == 40:
        n = 0
        image_path = "{}_{}.jpg".format(base_path, datetime.datetime.now().strftime('%Y%m%d%H%M%S%f'))
        cv2.imwrite(image_path, frame)
        results = model.predict(image_path)

        confidence_values = results[0].boxes.conf
        print("Confidence values:", confidence_values)

        output2 = model2(Image.open(image_path))
        results2 = Detections.from_ultralytics(output2[0])

        if (confidence_values.numel() > 0 and confidence_values[0].item() > 0.8) or (results2 and len(results2[0]) > 0):
            print("Human detected!")
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            screenshot_path = image_path
            with open(screenshot_path, "rb") as img:
                files = {"file": img}
                response = requests.post(SERVER_URL, files=files, data={"timestamp": timestamp})

                if response.status_code == 200:
                    print("Screenshot uploaded successfully!")
                else:
                    print("Failed to upload screenshot:", response.text)
            print("sent img to flask backend")
        else:
            print("No human detected.")
        os.remove(image_path)
    n += 1
cap.release()
cv2.destroyAllWindows()