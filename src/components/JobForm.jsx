import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../App';

const JobForm = () => {
    const { isLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'DATA_ENTRY',
        reward: '',
        status: 'OPEN',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchJob = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/api/jobs/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching job:', error);
                    setError('Failed to load job details.');
                }
            };
            fetchJob();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (id) {
                await axios.put(`/api/jobs/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post('/api/jobs', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving job:', error);
            setError('Failed to save job. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/jobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Error deleting job:', error);
            setError('Failed to delete job. Please try again.');
        }
    };

    if (!isLoggedIn) {
        return <p className="text-red-500">Please log in to access this page.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Job' : 'Create Job'}</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="DATA_ENTRY">Data Entry</option>
                    <option value="WRITING">Writing</option>
                    <option value="RESEARCH">Research</option>
                    <option value="DESIGN">Design</option>
                    <option value="OTHER">Other</option>
                </select>
                <input
                    type="number"
                    name="reward"
                    placeholder="Reward"
                    value={formData.reward}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                    {id ? 'Update Job' : 'Create Job'}
                </button>
                {id && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                        Delete Job
                    </button>
                )}
            </form>
        </div>
    );
};

export default JobForm;