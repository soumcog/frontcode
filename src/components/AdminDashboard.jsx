import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import Spinner from './Spinner'; // Import Spinner

const AdminDashboard = () => {
    const { isLoggedIn } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/admin/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchUsers();
        }
    }, [isLoggedIn]);

    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter((user) => user.id !== id)); // Remove deleted user from the list
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user.');
        }
    };

    const handleUpdateRole = async (id, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/admin/users/${id}/role`,
                { newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(
                users.map((user) =>
                    user.id === id ? { ...user, role: response.data.role } : user
                )
            ); // Update user role in the list
        } catch (error) {
            console.error('Error updating user role:', error);
            setError('Failed to update user role.');
        }
    };

    if (!isLoggedIn) {
        return <p className="text-red-500">Please log in to access this page.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            {loading && <Spinner />} {/* Use Spinner */}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Username</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="bg-white">
                            <td className="border border-gray-300 p-2">{user.id}</td>
                            <td className="border border-gray-300 p-2">{user.username}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="EMPLOYER">Employer</option>
                                    <option value="WORKER">Worker</option>
                                </select>
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;