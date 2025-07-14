import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import techlogo from './technologist-dark-skin-tone.svg';
import Dashboard from './pages/Dashboard';
import CollectionDisplay from './pages/CollectionDisplay';
import Admin from './pages/Admin';
import WishlistDisplay from './pages/WishlistDisplay';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/collection-display" element={<CollectionDisplay/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/wishlist-display" element={<WishlistDisplay/>}/>

        {/* Default ("/") route */}
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img src={techlogo} className="App-logo" alt="logo" />
                <p>Dev In Progress</p>
                <a>Funko Base</a>
                <Link to="/dashboard">Go to Dashboard</Link>
              </header>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
