import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './job.css';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newJobDescription, setNewJobDescription] = useState('');
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jobs');
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleAddJob = async () => {
        try {
            const newJob = { title: newJobTitle, description: newJobDescription };
            const response = await axios.post('http://localhost:5000/api/jobs', newJob);
            alert("Job added successfully");
            setJobs([...jobs, response.data]);
            setNewJobTitle('');
            setNewJobDescription('');
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    const handleDeleteJob = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/jobs/${id}`);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setNewJobTitle(job.title);
        setNewJobDescription(job.description);
    };

    const handleUpdateJob = async () => {
        try {
            const updatedJob = { ...editingJob, title: newJobTitle, description: newJobDescription };
            const response = await axios.put(`http://localhost:5000/api/jobs/${editingJob._id}`, updatedJob);
            setJobs(jobs.map(job => (job._id === editingJob._id ? response.data : job)));
            setEditingJob(null);
            setNewJobTitle('');
            setNewJobDescription('');
            alert("Job updated successfully");
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    return (
        <div>
            <h1>JOB BOARD APPLICATION</h1>
            <div className='form'>
            <h1>Add a Job </h1>
            <label>Job Title</label><br></br>
                <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="Enter job title"
                /><br></br>
                <label>Description</label><br></br>
                <textarea
                    value={newJobDescription}
                    onChange={(e) => setNewJobDescription(e.target.value)}
                    placeholder="Enter job description"
                ></textarea><br></br>
                {editingJob ? (
                    <button onClick={handleUpdateJob}>Update Job</button>
                ) : (
                    <button onClick={handleAddJob}>Add Job</button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job._id}>
                            <td>{job.title}</td>
                            <td>{job.description}</td>
                            <td className="result-buttons">
                                <button onClick={() => handleEditJob(job)}>Edit</button>
                                <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobBoard;
