import axios from "axios";
import { useState } from "react";
import "./Login.css";
import { handleInputChange } from "../../utils/formUtils";
import { addMultipleCookies } from "../../utils/cookies";

const Login = ({
  setToken,
  setUser,
  onSwitchToSignup,
  setVisibleModalLog,
  setLocalFavorites,
}) => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fonction pour récupérer les favoris de l'utilisateur
  const fetchUserFavorites = async (userToken) => {
    try {
      const response = await axios.get(
        "https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // La réponse du serveur doit contenir un tableau d'IDs
      return response.data.favoris;
    } catch (error) {
      console.error("Failed to fetch user favorites:", error);
      return []; // Retourne un tableau vide en cas d'erreur
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://site--backend-marvel--zcmn9mpggpg8.code.run/user/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      //console.log(response);
      const token = response.data.token;
      const username = response.data.account.username;
      const avatar = response.data.account.avatar.secure_url;
      const userID = response.data._id;
      console.log("response", response.data);

      setToken(token);
      setUser({ username, userID, avatar });

      // get favoris de l'utilisateur et dispatch
      const userFavorites = await fetchUserFavorites(token);
      setLocalFavorites(userFavorites);
      const charactersIDFav = JSON.stringify(userFavorites);

      addMultipleCookies({
        token,
        username,
        userID,
        charactersIDFav: charactersIDFav,
      });
      setLoading(false);
      setVisibleModalLog((prev) => !prev);
    } catch (error) {
      console.log(error);
      setError(error.message || "Erreur de connexion");
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Se connecter</h2>
        <p>Connectez-vous pour vendre et acheter</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

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
            placeholder="Votre mot de passe"
            required
            disabled={loading}
          />
        </div>

        <button
          className={`auth-button ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="auth-footer">
        <p>Pas encore de compte ?</p>
        <button className="link-button" onClick={onSwitchToSignup}>
          S'inscrire
        </button>
      </div>
    </div>
  );
};
export default Login;
