const axios = require('axios');
// const { getIO } = require('../socket.js'); // Assuming you have this for sockets

const executeCode = async (req, res) => {
    // const io = getIO();
    const { language = 'javascript', code, roomId } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required.' });
    }

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://api.jdoodle.com/v1/execute',
            data: {
                clientId: process.env.JDOODLE_CLIENT_ID,
                clientSecret: process.env.JDOODLE_CLIENT_SECRET,
                script: code,
                language: 'nodejs', // For JavaScript, use 'nodejs'
                versionIndex: '4'   // Corresponds to Node.js v18.15.0
            }
        });

        const output = {
            stdout: response.data.output,
            stderr: null, // JDoodle combines output, so stderr might not be separate
            status: `Used ${response.data.cpuTime}s, ${response.data.memory}KB`,
            time: response.data.cpuTime,
            memory: response.data.memory
        };
        
        // Broadcast the result via Socket.IO (optional)
        // if (roomId && io) {
        //     io.to(roomId).emit('output-updated', output);
        // }

        return res.status(200).json(output);

    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        console.error('Error executing code with JDoodle:', errorMessage);
        return res.status(500).json({ error: 'Failed to execute code.', details: errorMessage });
    }
};

module.exports = { executeCode };