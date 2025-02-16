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
          <img className="sky" src="assets/sky.png" width="100%" height="auto" alt="background sky image" />
          <nav>
          <div class="nav-links">
              <a href="./App.js">HOME</a>
              <a href="#">CONTACTS</a>
              <a href="./about.html">ABOUT</a>
          </div>
          <div class="nav-search">
              <input type="text" placeholder="Search..." />
          </div>
        </nav>

          <header>
              <div className="hero">
                  <h1>Simba's Surveillance</h1>
                  
              </div>
              <p><i>Prowl for poachers!</i></p>
          </header>
          
          
          <article id="table">
          <img className="simbasmile" src="assets/simbasmile.png" width="10%" height="auto" alt="Simba the cub smiling" />
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
              <img src="/assets/line.png" width="10%" height="auto" alt="A little line for separation" />
          <section className="about">
              <h2>What we do</h2>
              <p>
                  At Simba's Surveillance, we are dedicated to protecting wildlife from the growing threat of poaching.

                  
              </p>
              <p>
                Using state-of-the-art technology, our advanced camera systems provide live footage from the African Savanna,
                  allowing us to detect trespassing poachers in real time. The moment suspicious activity is identified, park rangers 
                  are alerted, enabling rapid response to safeguard endangered species and preserve natural ecosystems.
              </p>
          </section>
          <footer className="footer">
            &copy; <script src="about.js"></script> Simba's Surveillance. All rights reserved.
        </footer>
      </div>
  );
}

export default App;
