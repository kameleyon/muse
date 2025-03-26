// src/features/auth/components/SignupForm.tsx
import React, { useState } from 'react';
// import { signupUser } from '../../../services/auth'; // Placeholder import

export const SignupForm: React.FC = () => {
  const [name, setName] = useState('');
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
      console.log('Attempting signup with:', { name, email, password });
      // const user = await signupUser(name, email, password);
      // console.log('Signup successful:', user);
      // Handle successful signup (e.g., redirect, show message)
      alert('Signup successful (placeholder)');
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please try again.'); // Basic error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-heading text-secondary mb-4">Sign Up</h2>
      {error && <p className="text-error text-sm">{error}</p>}
      <div>
        <label
          htmlFor="signup-name"
          className="block text-sm font-medium text-neutral-medium mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="signup-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-neutral-white text-neutral-dark"
          placeholder="Your Name"
        />
      </div>
      <div>
        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-neutral-medium mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-neutral-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-neutral-white text-neutral-dark"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-neutral-medium mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8} // Example: Enforce minimum password length
          className="w-full px-3 py-2 border border-neutral-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-neutral-white text-neutral-dark"
          placeholder="Minimum 8 characters"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-neutral-white font-semibold rounded-md shadow-button hover:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;