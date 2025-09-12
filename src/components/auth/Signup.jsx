import axios from "axios";
import { useState } from "react";
import { addMultipleCookies } from "../../utils/cookies";
import "./Login.css";
import { handleInputChange, validateForm } from "../../utils/formUtils";

const Signup = ({ setToken, onSwitchToLogin, setVisibleModalLog, setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm(formData, setError)) return;

    setLoading(true);

    const formDataSend = new FormData();
    formDataSend.append("username", formData.username);
    formDataSend.append("email", formData.email);
    formDataSend.append("password", formData.password);
    formDataSend.append("avatar", formData.avatar);

    try {
      const response = await axios.post(
        "https://site--backend-marvel--zcmn9mpggpg8.code.run/user/signup", //  http://localhost:3000/user/signup
        formDataSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //console.log(formData);
      const token = response.data.token;
      const username = response.data.account.username;
      const avatar = response.data.account.avatar.secure_url;
      const userID = response.data._id;
      //console.log("response",response.data);

      addMultipleCookies({ token, username, userID });
      setToken(token);
      setUser({
        username,
        userID,
        avatar,
      });
      setLoading(false);
      setVisibleModalLog((prev) => !prev);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message || "Erreur de connexion");
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>S'inscrire</h2>
        <p>Rejoignez la communauté Marvel</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(element) => {
              handleInputChange(setFormData, element);
            }}
            placeholder="Votre nom d'utilisateur"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(element) => {
              handleInputChange(setFormData, element);
            }}
            placeholder="exemple@email.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(element) => {
              handleInputChange(setFormData, element);
            }}
            placeholder="Au moins 6 caractères"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(element) => {
              handleInputChange(setFormData, element);
            }}
            placeholder="Confirmez votre mot de passe"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Uploader un avatar</label>
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={(element) => {
              handleInputChange(setFormData, element);
            }}
          />
        </div>

        <button
          className={`auth-button ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <div className="auth-footer">
        <p>Déjà un compte ?</p>
        <button className="link-button" onClick={onSwitchToLogin}>
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default Signup;
