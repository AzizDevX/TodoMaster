import "./auth.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthLoginPage() {
  const navigate = useNavigate();
  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    axios
      .post("http://localhost:3001/api/auth/login", {
        Email,
        Password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("UserName", response.data.UserName);
        navigate("/home");
      })
      .catch((error) => {
        console.log(error.response?.data || error.message);
        document.getElementById("Error").textContent =
          error?.response?.data?.message || "Something went wrong!";
      });
  };

  return (
    <>
      <main className="auth">
        <div>
          <h1>Welcome To Login Page</h1>
          <p>
            Sign up for free or log in to access amazing deals and benefits!
          </p>
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
          ></input>
          <input
            placeholder="Password"
            value={Password}
            onChange={(e) => {
              SetPassword(e.target.value);
            }}
          ></input>
          <a href="/register">
            {" "}
            <h4>Create Account</h4>
          </a>
          <button onClick={handleLogin}>Login</button>
          <pre id="Error"></pre>
        </div>
      </main>
    </>
  );
}

function AuthRegisterPage() {
  const navigate = useNavigate();

  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [UserName, SetUserName] = useState("");

  const handleRegister = () => {
    axios
      .post("http://localhost:3001/api/auth/register", {
        Email,
        UserName,
        Password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("UserName", response.data.UserName);
        navigate("/home");
      })
      .catch((err) => {
        console.log(err.response?.data);
        document.getElementById("Error").textContent =
          err?.response?.data?.message || "Registration failed";
      });
  };
  return (
    <>
      <main className="auth">
        <div>
          <h1>Welcome To Register Page</h1>
          <p>Sign up for free to access amazing deals and benefits!</p>
          <input
            type="email"
            placeholder="Email"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
          ></input>

          <input
            placeholder="UserName"
            value={UserName}
            onChange={(e) => SetUserName(e.target.value)}
          ></input>

          <input
            placeholder="Password"
            value={Password}
            onChange={(e) => {
              SetPassword(e.target.value);
            }}
          ></input>
          <a href="/login">
            <h4>Go To login Page</h4>
          </a>
          <button onClick={handleRegister}>Register</button>
          <pre id="Error"></pre>
        </div>
      </main>
    </>
  );
}

export { AuthLoginPage, AuthRegisterPage };
