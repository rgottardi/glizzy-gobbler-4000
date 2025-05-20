import { useState } from 'react';
import { API_BASE_URL } from '../../../config/frontend.config.mjs';

function App() {
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkServerStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      setServerStatus(data);
    } catch (err) {
      setError('Error connecting to the server. Please check if the backend is running.');
      console.error('Error checking server status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Glizzy Gobbler 4000</h1>
        <p className="text-lg text-gray-600">A Barebones Multi-Tenant MERN Application</p>
      </header>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={checkServerStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {loading ? 'Checking...' : 'Check Server Status'}
          </button>
          
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          {serverStatus && (
            <div className="mt-4 p-4 border border-gray-200 rounded w-full">
              <h2 className="text-xl font-semibold mb-2">Server Status</h2>
              <pre className="bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(serverStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p>Built with the MERN Stack: MongoDB, Express, React, Node.js</p>
      </footer>
    </div>
  );
}

export default App;
