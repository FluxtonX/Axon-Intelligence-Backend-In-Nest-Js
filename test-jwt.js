const jwt = require('jsonwebtoken');

// Look at the backend's .env for JWT_SECRET
const secret = process.env.JWT_SECRET || 'super-secret-jwt-key';

// 1. Create a JWT for Afnan (cc5eb511-1a6c-4f53-9752-0078997f873a)
const payload = {
  email: 'afnanfahimktk@gmail.com',
  sub: 'cc5eb511-1a6c-4f53-9752-0078997f873a'
};
const token = jwt.sign(payload, secret);

async function run() {
  try {
    const convRes = await fetch('http://127.0.0.1:3000/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', convRes.status);
    const text = await convRes.text();
    console.log('Response:', text);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

run();
