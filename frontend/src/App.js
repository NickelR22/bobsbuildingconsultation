import logo from './logo.svg';
import './index.css';
import { useState, useEffect } from "react";



function App() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    setTimeout(async () => {
      await fetch("http://localhost:8080/get-detections").then(res => res.json())
      .then(data => setItems(data || []))
      .catch(error => console.error("Error fetching items:", error));;      
    }, 1000);
  });

  return (
    
      <div>
          <nav>
            <div class="nav-links">
              <a href="./App.js">
                <button class="btn">HOME</button></a>

              <a href="./museum.html">
                <button class="btn">MUSEUM</button></a>
              <a href="./about.html">
              <button class="btn">ABOUT</button></a>
          </div>
          <div class="searchBox">
          <input class="searchInput" type="text" name="" placeholder="Search something"></input>
            <button class="searchButton" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                                  <g clip-path="url(#clip0_2_17)">
                                    <g filter="url(#filter0_d_2_17)">
                                      <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"></path>
                                    </g>
                                  </g>
                                  <defs>
                                    <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                      <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                                      <feOffset dy="4"></feOffset>
                                      <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                                      <feComposite in2="hardAlpha" operator="out"></feComposite>
                                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
                                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
                                    </filter>
                                    <clipPath id="clip0_2_17">
                                      <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
                                    </clipPath>
                                  </defs>
                                </svg>
            </button>
        </div>
        </nav>
        <img className="sky" src="assets/sky.png" width="100%" height="auto" alt="background sky image" />
        <header>
              <div className="glow">
                  <h1>Simba's Surveillance</h1>
              </div>

          </header>

          <img className="simbasmile" src="assets/simbasmile.png" width="10%" height="auto" alt="Simba the cub smiling" />

          <article id="table">
          
                <p>
                  Track The Savanna Wildlife Camera's Live Alerts Below
              </p>
            <section className="table">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    
                    <th>Capture</th>
                    
                  </tr>
                  </thead>
                  <tbody>
                  {items.map((item)=>(

                    <tr>
                      <td>
                          {item.timestamp}
                      </td>
                    <td><img height="200rem" width="350rem" src = {"data:image/png;base64, " + item.image}></img></td>
                  </tr>
                ))}
                </tbody>
              </table>
              
              </section>
              </article>
              <section id = "museum-visit">
                <p>Visit our interactive museum to learn some more about endangered species:</p>
                <p><a href = "./museum.html">
                  <button class = "imbutton">Interactive Museum</button></a>
                  </p>
            </section>
          <footer className="footer">
            &copy; <script src="about.js"></script> Simba's Surveillance. All rights reserved.
        </footer>
      </div>
  );
}

export default App;
