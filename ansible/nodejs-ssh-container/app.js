const http = require('http');
const os = require('os');

const port = 3000;

// Helper function to get server information
const getServerInfo = () => {
    return {
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        uptime: os.uptime(),
        memory: {
            total: (os.totalmem() / 1024 / 1024).toFixed(2) + ' MB',
            free: (os.freemem() / 1024 / 1024).toFixed(2) + ' MB',
        },
        cpus: os.cpus().length,
    };
};

// Create HTTP server
const server = http.createServer((req, res) => {
    const serverInfo = getServerInfo();
    const message = `
        Hello from Node.js via Ansible!
        
        Server Information:
        - Hostname: ${serverInfo.hostname}
        - Platform: ${serverInfo.platform}
        - Architecture: ${serverInfo.architecture}
        - Uptime: ${serverInfo.uptime} seconds
        - Total Memory: ${serverInfo.memory.total}
        - Free Memory: ${serverInfo.memory.free}
        - CPU Cores: ${serverInfo.cpus}

        Requested URL: ${req.url}
    `;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(message);
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
