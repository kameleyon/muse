// src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
// import { loginUser } from '../../../services/auth'; // Placeholder import

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Placeholder for API call
      console.log('Attempting login with:', { email, password });
      // const user = await loginUser(email, password);
      // console.log('Login successful:', user);
      // Handle successful login (e.g., redirect, update context)
      alert('Login successful (placeholder)');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.'); // Basic error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-heading text-secondary mb-4">Login</h2>
      {error && <p className="text-error text-sm">{error}</p>}
      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-neutral-medium mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-neutral-white text-neutral-dark"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-neutral-medium mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-neutral-white text-neutral-dark"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-neutral-white font-semibold rounded-md shadow-button hover:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;