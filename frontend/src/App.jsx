import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./App.css"; // Add custom styles
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar */}
        <nav className="sidebar bg-dark text-white p-3">
          <h2>Inventory</h2>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/orders">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/reports">Reports</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="main-content p-4 flex-grow-1">
          <nav className="navbar navbar-light bg-light mb-4">
            <span className="navbar-brand mb-0 h1">Inventory Management System</span>
          </nav>
          <Routes>
            <Route path="/" element={<h2>Dashboard</h2>} />
            <Route path="/products" element={<h2>Products Page</h2>} />
            <Route path="/orders" element={<h2>Orders Page</h2>} />
            <Route path="/reports" element={<h2>Reports Page</h2>} />
            <Route path="/settings" element={<h2>Settings Page</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
