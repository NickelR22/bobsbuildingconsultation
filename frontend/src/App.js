import logo from './logo.svg';
import './index.css';

function App() {
  const fetchDetections = () => {
      console.log("Fetching live cam footage...");
  };

  return (
      <div>
          <img className="sky" src="assets/sky.png" width="100%" height="auto" alt="background sky image" />
          <nav>
              <div className="nav-links">
                  <a href="#">HOME</a>
                  <a href="#">CONTACTS</a>
                  <a href="/frontend/src/about.html">ABOUT</a>
              </div>
              <div className="nav-search">
                  <input type="text" placeholder="Search..." />
              </div>
          </nav>
          <header>
              <div className="hero">
                  <h1>Simba's Surveillance</h1>
              </div>
          </header>
          <article id="test-it">
              <img className="sky" src="assets/simbasmile.png" width="10%" height="auto" alt="Simba the cub smiling" />
              <p>
                  Track The Savanna Wildlife Camera's Live Video Below
              </p>
          </article>
          <img src="/assets/line.png" width="10%" height="auto" alt="little line for separation" />
          <section className="about">
              <h2>What we do</h2>
              <p>
                  At Simba's Surveillance, we are dedicated to protecting wildlife from the growing threat of poaching.
                  Using state-of-the-art technology, our advanced camera systems provide live footage from the African Savanna, 
                  allowing us to detect trespassing poachers in real time. The moment suspicious activity is identified, park rangers 
                  are alerted, enabling rapid response to safeguard endangered species and preserve natural ecosystems.
              </p>
          </section>
      </div>
  );
}

export default App;
