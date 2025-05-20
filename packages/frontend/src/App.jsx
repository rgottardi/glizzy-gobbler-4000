import { Routes, Route } from 'react-router-dom';
import './App.css';

// This is a placeholder App component until we implement the full UI
function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold">Glizzy Gobbler 4000</h1>
        <p className="text-sm opacity-75">A barebones multi-tenant MERN application</p>
      </header>
      
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

// Placeholder components
function Home() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Welcome to Glizzy Gobbler 4000</h2>
      <p className="mb-4">
        This is a barebones multi-tenant MERN application with modern tooling.
      </p>
      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
        <p className="font-semibold">Features:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Multi-tenant architecture</li>
          <li>Role-Based Access Control (RBAC)</li>
          <li>Modern JavaScript with ESM</li>
          <li>Monorepo structure with npm workspaces</li>
        </ul>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default App;