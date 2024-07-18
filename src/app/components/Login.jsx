import { useState } from 'react';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      handleRegister(username, password);
    } else {
      handleLogin(username, password);
    }
  };

  const handleRegister = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = { id: Date.now(), username, password, notes: [] }; // Assign a unique id to each user
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      alert('Username already exists');
    } else {
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      handleLogin(username, password); // Auto-login after registration
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isRegistering ? 'Register' : 'Log In'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {isRegistering ? 'Register' : 'Log In'}
          </button>
          {!isRegistering ? (
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setIsRegistering(true)}
              >
                Register here
              </button>
            </p>
          ) : (
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => setIsRegistering(false)}
              >
                Log In here
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
