import { useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function callApi() {
    try {
      const res = await fetch('https://interviewbooster-esf2f9asete4brgn.westus3-01.azurewebsites.net/api/hello'); // relative path — SWA proxies to App Service
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>React SPA + Express API on Azure</h1>
      <button onClick={callApi}>Call API</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default App;