import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import Spinner from './Spinner'; // Import Spinner

const JobList = () => {
    const { isLoggedIn } = useContext(AppContext);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/jobs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized. Please log in.');
                } else {
                    setError('Failed to load jobs.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchJobs();
        } else {
            setJobs([]);
        }
    }, [isLoggedIn]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
            {loading && <Spinner />} {/* Use Spinner */}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {!loading && jobs.length === 0 && !error && <p>No jobs available.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-4">{job.description}</p>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500">Reward: ${job.reward}</span>
                            <span className="text-sm text-gray-500">Category: {job.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Status: {job.status}</span>
                            {isLoggedIn && (
                                <Link
                                    to={`/edit-job/${job.id}`}
                                    className="text-blue-500 hover:text-blue-600 transition duration-300"
                                >
                                    Edit
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobList;