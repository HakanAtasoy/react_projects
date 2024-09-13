import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, GamePage } from './pages';

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
        </Routes>
    </Router>
  );
}

export default App
