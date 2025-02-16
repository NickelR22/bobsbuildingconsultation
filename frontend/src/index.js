import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
async function fetchDetections() {
  const response = await fetch("http://localhost:3000/get-detections");
  const data = await response.json();

  let imageContainer = document.getElementById("detections");
  imageContainer.innerHTML = ""; // Clear old images

  data.forEach(detection => {
      let img = document.createElement("img");
      img.src = detection.screenshot_url;
      img.width = 300;
      
      let timestamp = document.createElement("p");
      timestamp.innerText = "Detected at: " + detection.timestamp;
      
      imageContainer.appendChild(img);
      imageContainer.appendChild(timestamp);
  });
}
window.fetchDetections = fetchDetections;


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
