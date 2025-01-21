import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

const JobList = () => {
    const { isLoggedIn } = useContext(AppContext);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
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
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {jobs.length === 0 && !error && <p>No jobs available.</p>}
            <ul>
                {jobs.map((job) => (
                    <li key={job.id} className="border rounded p-4 mb-4">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p>{job.description}</p>
                        <p>Reward: {job.reward}</p>
                        <p>Category: {job.category}</p>
                        {isLoggedIn && (
                            <Link
                                to={`/edit-job/${job.id}`}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobList;