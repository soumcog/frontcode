import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import JobForm from './components/JobForm'; // Import JobForm
import { useState, useEffect, createContext } from 'react';

export const AppContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
                <div className="min-h-screen bg-gray-100">
                    <nav className="bg-white p-4 shadow-md">
                        <ul className="flex space-x-4">
                            <li><Link to="/" className="text-blue-500 hover:underline">Home</Link></li>
                            {!isLoggedIn && (
                                <>
                                    <li><Link to="/register" className="text-blue-500 hover:underline">Register</Link></li>
                                    <li><Link to="/login" className="text-blue-500 hover:underline">Login</Link></li>
                                </>
                            )}
                            {isLoggedIn && (
                                <>
                                    <li><Link to="/create-job" className="text-blue-500 hover:underline">Create Job</Link></li>
                                    <li><button onClick={handleLogout} className="text-blue-500 hover:underline">Logout</button></li>
                                </>
                            )}
                        </ul>
                    </nav>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/create-job" element={<JobForm />} />
                        <Route path="/edit-job/:id" element={<JobForm />} />
                    </Routes>
                </div>
            </AppContext.Provider>
        </Router>
    );
}

export default App;