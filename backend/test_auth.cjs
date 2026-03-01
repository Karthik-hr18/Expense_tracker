// Quick test script for auth endpoints
const http = require('http');

function makeRequest(path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: `/api${path}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };
        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => (responseData += chunk));
            res.on('end', () => {
                console.log(`\n--- ${path} (status: ${res.statusCode}) ---`);
                console.log(JSON.parse(responseData));
                resolve(JSON.parse(responseData));
            });
        });
        req.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            reject(e);
        });
        req.write(data);
        req.end();
    });
}

async function test() {
    // Test Register
    const regResult = await makeRequest('/register', {
        username: 'testuser2',
        email: 'test2@test.com',
        password: 'test123',
        confirm_password: 'test123',
    });

    // Test Login with email
    await makeRequest('/login', {
        identifier: 'test2@test.com',
        password: 'test123',
    });

    // Test Login with username
    await makeRequest('/login', {
        identifier: 'testuser2',
        password: 'test123',
    });

    // Test Login with wrong password
    await makeRequest('/login', {
        identifier: 'testuser2',
        password: 'wrongpassword',
    });

    console.log('\n--- All tests done ---');
}

test().catch(console.error);
