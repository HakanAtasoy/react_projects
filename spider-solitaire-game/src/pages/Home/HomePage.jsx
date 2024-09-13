import { Link } from 'react-router-dom';
import './HomePage.css'; 

const HomePage = () => (
  <div className="home-screen">
    <h1>Spider Solitaire</h1>
    <p>Welcome to Spider Solitaire! Click below to start a new game.</p>
    <Link to="/game">
      <button className="start-button">Start Game</button>
    </Link>
  </div>
);
 
export default HomePage;
