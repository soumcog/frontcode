import React, { useContext } from 'react';
import JobList from './JobList';
import { AppContext } from '../App';


function Home() {
    const { isLoggedIn } = useContext(AppContext);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Welcome to MicroTask App</h1>
            {isLoggedIn ? (
                <JobList />
            ) : (
                <p>Please log in to view available jobs.</p>
            )}
        </div>
    );
}

export default Home;