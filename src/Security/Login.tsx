import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";


const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (auth) {
        await auth.signIn(user);
      } else {
        setLoginError("Autentificeringstjenesten er ikke tilgængelig.");
        setLoginSuccess(false);
      }
      setLoginSuccess(true);
      setLoginError("");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 3000); // Delay navigation to show the success message
    } catch (error) {
      setLoginError("Login fejlede. Kontroller venligst dine oplysninger og prøv igen.");
      setLoginSuccess(false);
    }
  };

  const handleRedirectToSignup = () => {
    navigate("/opret");
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          className="login-logo-form"
          src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
          alt="user-icon"
        />
        <div className="login-form-group">
          <label htmlFor="username">Brugernavn</label>
          <input type="text" name="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} required />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">Adgangskode</label>
          <input type="password" name="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <button type="button" className="create-btn" onClick={handleRedirectToSignup}>
          Opret
        </button>
        {loginError && <div className="notification error-msg">{loginError}</div>}
        {loginSuccess && <div className="notification success-msg">Velkommen {user.username}👤!.</div>}
      </form>
    </div>
  );
};

export default Login;