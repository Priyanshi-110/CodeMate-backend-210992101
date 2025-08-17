const axios = require('axios');
const { io } = require('../../index.js');// Import io for broadcasting results

// Function to handle code execution
const executeCode = async (req, res) => {
    const { language = 'javascript', code, roomId } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required.' });
    }

    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Securely access the API key
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: 71, // Assuming JavaScript for now (ID 71 on Judge0)
            source_code: Buffer.from(code).toString('base64'),
        }
    };

    try {
        // Step 1: Send the code to Judge0 to get a submission token
        const submissionResponse = await axios.request(options);
        const token = submissionResponse.data.token;

        // Step 2: Poll Judge0 for the result using the token
        let resultResponse;
        do {
            // Wait for a moment before checking the status
            await new Promise(resolve => setTimeout(resolve, 1000));
            resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`, {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            });
        } while (resultResponse.data.status.id <= 2); // Status 1 & 2 mean "In Queue" or "Processing"

        const result = resultResponse.data;
        const output = {
            stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : null,
            stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : null,
            compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf-8') : null,
            message: result.message ? Buffer.from(result.message, 'base64').toString('utf-8') : null,
            status: result.status.description,
            time: result.time,
            memory: result.memory
        };
        
        // Broadcast the result to the specific room
        if (roomId) {
            io.to(roomId).emit('output-updated', output);
        }

        res.status(200).json(output);

    } catch (error) {
        console.error('Error executing code:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to execute code.' });
    }
};
module.exports = { executeCode };