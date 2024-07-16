import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css'; // Import custom CSS for styling

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validate fields are not empty
    if (!username || !surname || !email || !password || !securityCode) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Send registration data to server
      const response = await axios.post('http://localhost:5001/api/register', {
        username,
        surname,
        email,
        password,
        security_code: securityCode, // Match backend field name
      });

      console.log(response.data); // Assuming the server responds with status or confirmation
      alert('Registration successful!');
      navigate('/login'); // Redirect to login form
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <h2>Register here if you do not have an account </h2>
      <form>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Security Code:</label>
          <input
            type="text"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="button" onClick={handleRegister} className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
