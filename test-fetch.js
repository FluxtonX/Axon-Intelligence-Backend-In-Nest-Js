async function run() {
  try {
    // 1. Login as Afnan to get token
    const loginRes = await fetch('http://127.0.0.1:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'afnan@example.com', password: 'password123' })
    });
    
    if (!loginRes.ok) {
        console.log('Login failed:', loginRes.status, await loginRes.text());
        return;
    }
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Got token:', token.substring(0, 20) + '...');

    // 2. Fetch conversations
    const convRes = await fetch('http://127.0.0.1:3000/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('CONVERSATIONS FETCHED OK. Status:', convRes.status);
    const data = await convRes.json();
    console.log(JSON.stringify(data, null, 2));

  } catch (e) {
    console.log('ERROR:', e.message);
  }
}
run();
