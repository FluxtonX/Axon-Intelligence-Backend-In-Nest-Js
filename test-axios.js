const axios = require('axios');

async function run() {
  try {
    // 1. Login as Afnan to get token
    const loginRes = await axios.post('http://127.0.0.1:3000/api/auth/login', {
      email: 'afnan@example.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Got token:', token.substring(0, 20) + '...');

    // 2. Fetch conversations
    const convRes = await axios.get('http://127.0.0.1:3000/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('CONVERSATIONS FETCHED OK. Status:', convRes.status);
    console.log(JSON.stringify(convRes.data, null, 2));

  } catch (e) {
    if (e.response) {
      console.log('HTTP ERROR:', e.response.status, e.response.data);
    } else {
      console.log('ERROR:', e.message);
    }
  }
}
run();
