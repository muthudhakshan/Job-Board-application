const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let jobs = [];
let currentId = 1;

// Routes
app.get('/api/jobs', (req, res) => {
    res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
    const { title, description } = req.body;
    const newJob = { _id: currentId++, title, description };
    jobs.push(newJob);
    res.status(201).json(newJob);
});
app.put('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const jobIndex = jobs.findIndex(job => job._id === parseInt(id));

    if (jobIndex !== -1) {
        jobs[jobIndex] = { _id: parseInt(id), title, description };
        res.json(jobs[jobIndex]);
    } else {
        res.status(404).send('Job not found');
    }
});


app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    jobs = jobs.filter(job => job._id !== parseInt(id));
    res.status(204).send();
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
