import React, { useState } from "react";
import axios from "axios";
// import { jwtDecode } from "jwt-decode";

function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

  // Handle signup
  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${BASE_BACKEND_URL}/signup`,
        { email, password },
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    }
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${BASE_BACKEND_URL}/login`,
        { email, password },
        {
          withCredentials: true, // Include cookies
        }
      );
      //   const token = response.data.access_token;

      //   // Store token in localStorage
      //   localStorage.setItem("authToken", token);

      //   const decoded = jwtDecode(token);
      //   console.log('decoded', decoded);
      //   setMessage(`Welcome, ${decoded?.sub}`);
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${BASE_BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  // Handle protected route access
  //   const accessProtectedRoute = async () => {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       setMessage("Please log in first.");
  //       return;
  //     }

  //     try {
  //       const response = await axios.get(`${BASE_BACKEND_URL}/protected`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setMessage(response.data.message);
  //     } catch (err) {
  //       setMessage(err.response?.data?.message || "An error occurred");
  //     }
  //   };

  return (
    <div>
      <h1>Signup and Login Example</h1>

      <div>
        <h2>Signup</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
      </div>

      <div>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>

      <div>
        {/* <button onClick={() => localStorage.removeItem('authToken')}>Remove token</button> */}
        <button onClick={logout}>Logout</button>
      </div>

      <div>
        <h3>Message:</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Authentication;
