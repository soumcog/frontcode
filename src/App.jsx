import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import JobForm from './components/JobForm';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer'; // Import Footer
import { useState, useEffect, createContext } from 'react';

export const AppContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
        }
    };

    return (
        <Router>
            <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
                <div className="min-h-screen bg-gray-100 flex flex-col">
                    {/* Navigation Bar */}
                    <nav className="bg-white shadow-md">
                        <div className="container mx-auto px-4">
                            <div className="flex justify-between items-center h-16">
                                <Link to="/" className="text-xl font-bold text-blue-600">
                                    MicroTask App
                                </Link>
                                <div className="flex space-x-4">
                                    <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
                                        Home
                                    </Link>
                                    {!isLoggedIn && (
                                        <>
                                            <Link to="/register" className="text-gray-700 hover:text-blue-600 transition duration-300">
                                                Register
                                            </Link>
                                            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition duration-300">
                                                Login
                                            </Link>
                                        </>
                                    )}
                                    {isLoggedIn && (
                                        <>
                                            <Link to="/create-job" className="text-gray-700 hover:text-blue-600 transition duration-300">
                                                Create Job
                                            </Link>
                                            <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition duration-300">
                                                Admin
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="text-gray-700 hover:text-blue-600 transition duration-300"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className="flex-grow container mx-auto p-4">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/create-job" element={<JobForm />} />
                            <Route path="/edit-job/:id" element={<JobForm />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Routes>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </AppContext.Provider>
        </Router>
    );
}

export default App;