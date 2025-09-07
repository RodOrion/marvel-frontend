import { Link, useLocation } from "react-router-dom";
import logo from "../assets/marvel-logo.svg";
import { GiSpiderMask } from "react-icons/gi";
import { removeMultipleCookies } from "../utils/cookies";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = ({
  setVisibleModalLog,
  setFormDataSearch,
  token,
  setToken,
  user,
}) => {
  const [search, setSearch] = useState("");
  const [dataCompletion, setDataCompletion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { pathname } = useLocation();

  const typeSearch = pathname === "/" ? "characters" : "comics";

  useEffect(() => {
    setIsLoading(true);
    const fetchDataCharacters = async () => {
      try {
        const response = await axios.get(
          `https://site--backend-marvel--zcmn9mpggpg8.code.run/${typeSearch}/completion?name=${search}` // `https://site--backend-marvel--zcmn9mpggpg8.code.run/${typeSearch}/completion?name=${search}`
        );
        console.log("response", response.data);
        setDataCompletion(response.data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };
    fetchDataCharacters();
    setIsLoading(false);
  }, [search, typeSearch]);

  const handleChangeSearch = (e) => {
    setFormDataSearch(e.target.value);
    setSearch(e.target.value);
  };

  const handleAuthClick = () => {
    if (token) {
      // Déconnexion
      removeMultipleCookies(["token", "userID", "username", "charactersIDFav"]);
      setToken(null);
    } else {
      // Ouvrir modal de connexion
      setVisibleModalLog(true);
    }
  };

  return (
    <>
      <div className="connexion flexContainer">
        <div className="user flexContainer">
          {token && (
            <>
              <img className="avatar" src={user.avatar} alt="" />
              <span>{user.username}</span>
            </>
          )}
        </div>
        <div className="flexContainer" onClick={handleAuthClick}>
          <GiSpiderMask />
          <span>{token ? "Déconnexion" : "Connexion"}</span>
        </div>
      </div>
      <header>
        <div className="flexContainer">
          <Link to="/">
            <img src={logo} alt="" className="logo" />
          </Link>
          <form className="flexContainer">
            <input
              type="search"
              name="title"
              id="title"
              placeholder="Rechercher"
              onChange={handleChangeSearch}
            />
            {!isLoading && search && (
              <div className="completion">
                {dataCompletion.map((character) => {
                  return (
                    <div>
                      <Link to={`/character/${character.id}`}>
                        {character.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </form>
        </div>
      </header>
    </>
  );
};

export default Header;
