import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./characters.css";
import { TiStarFullOutline } from "react-icons/ti";
import { GiSlicingArrow } from "react-icons/gi";
import ModalErrorFav from "../components/ModalErrorFav";
import Cookies from "js-cookie";
//import { addToFavorites, checkFavorite, removeFromFavorites } from "../utils/cookies";

const Characters = ({
  formDataSearch,
  token,
  setVisibleModalLog,
  localFavorites,
  setLocalFavorites,
}) => {
  const [dataCharacters, setDataCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [visibleModalErrorFav, setVisibleModalErrorFav] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  //const favorisType = "characters"
  /*********************************/
  /***** SEARCH & PAGINATION ******/
  /*******************************/
  const fetchDataCharacters = async (page = 1, searchName = "") => {
    setIsLoading(true);
    try {
      // Construction de l'URL avec pagination et recherche
      let url = `https://site--backend-marvel--zcmn9mpggpg8.code.run/characters?page=${page}`;
      if (searchName && searchName.trim() !== "") {
        url += `&name=${searchName}`;
      }
      const response = await axios.get(url);
      setDataCharacters(response.data.results);
      setPagination(response.data.pagination);
      setCurrentPage(page);

      console.log(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setIsLoading(false);
    }
  };

  // Réaction aux changements de recherche depuis le header
  useEffect(() => {
    // Retour à la page 1 quand on change la recherche
    fetchDataCharacters(1, formDataSearch);
  }, [formDataSearch]);

  // Navigation pagination
  const handlePageChange = (newPage) => {
    fetchDataCharacters(newPage, formDataSearch);
  };

  /***********************/
  /***** FAVORITES ******/
  /*********************/
  // Extraire les IDs des favoris characters
  const extractCharacterFavoriteIds = (serverFavoris) => {
    return serverFavoris
      .filter((fav) => fav.type_favoris === "characters")
      .map((fav) => fav.id_favoris);
  };
  // Charger les favoris au montage
  useEffect(() => {
    const cookieFavorites = JSON.parse(Cookies.get("charactersIDFav") || "[]");
    setLocalFavorites(cookieFavorites);
  }, [setLocalFavorites]);

  // Fonction pour checker si doublon de favoris
  const isLocalFavorite = (characterID) =>
    localFavorites?.includes(characterID);

  // Add to favoris
  const addToFavorites = async (characterID) => {
    if (!token) return false;
    //console.log("Adding favorite for characterID:", characterID);
    // mise à jour immédiate
    const updatedFavorites = [...localFavorites, characterID];
    setLocalFavorites(updatedFavorites);
    Cookies.set("charactersIDFav", JSON.stringify(updatedFavorites), {
      expires: 7,
    });

    try {
      const response = await axios.post(
        `https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/characters/${characterID}`, //`https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/characters/${characterID}`
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log("response:", response.data);
      // Synchroniser avec la réponse du serveur
      const serverFavorites = extractCharacterFavoriteIds(
        response.data.favoris
      );
      setLocalFavorites(serverFavorites);
      Cookies.set("charactersIDFav", JSON.stringify(serverFavorites), {
        expires: 7,
      });

      return true;
    } catch (error) {
      console.error("Erreur ajout favori:", error);
      // Rollback en cas d'erreur
      const rollbackFavorites = localFavorites.filter(
        (id) => id !== characterID
      );
      setLocalFavorites(rollbackFavorites);
      Cookies.set("charactersIDFav", JSON.stringify(rollbackFavorites), {
        expires: 7,
      });
      return false;
    }
  };

  // Remove favoris
  const removeFromFavorites = async (characterID) => {
    if (!token) return false;

    // Optimistic update
    const updatedFavorites = localFavorites.filter((id) => id !== characterID);
    setLocalFavorites(updatedFavorites);
    Cookies.set("charactersIDFav", JSON.stringify(updatedFavorites), {
      expires: 7,
    });

    try {
      const response = await axios.delete(
        `https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/${characterID}`, //`https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/${characterID}`
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Synchroniser avec la réponse du serveur
      const serverFavorites = extractCharacterFavoriteIds(
        response.data.favoris
      );
      setLocalFavorites(serverFavorites);
      Cookies.set("charactersIDFav", JSON.stringify(serverFavorites), {
        expires: 7,
      });

      return true;
    } catch (error) {
      console.error("Erreur suppression favoris:", error);
      // Rollback
      const rollbackFavorites = [...localFavorites, characterID];
      setLocalFavorites(rollbackFavorites);
      Cookies.set("charactersIDFav", JSON.stringify(rollbackFavorites), {
        expires: 7,
      });
      return false;
    }
  };

  // gestion ajout suppression de favoris
  const handleClickFavoris = async (characterID) => {
    if (!token) {
      setVisibleModalErrorFav((prev) => !prev);
      return;
    }

    const isCurrentlyFavorite = isLocalFavorite(characterID);

    if (isCurrentlyFavorite) {
      //remove
      await removeFromFavorites(characterID);
    } else {
      // add
      await addToFavorites(characterID);
    }
  };

  // show favoris
  const handleClickShowFavoris = async () => {
    setShowFavoritesOnly((prev) => !prev);
  };

  const filteredCharacters = showFavoritesOnly
    ? dataCharacters.filter((character) => isLocalFavorite(character._id))
    : dataCharacters;

  return isLoading ? (
    <p>En cours de chargement</p>
  ) : (
    <>
      <div className="navigation flexContainer">
        <h2>Characters</h2>
        {token && (
          <div>
            <button className="showFavoris">
              {localFavorites?.length} FAVORITES
            </button>
            <button className="showFavoris" onClick={handleClickShowFavoris}>
              {showFavoritesOnly ? "SHOW ALL" : "SHOW FAVORITES"}
            </button>
          </div>
        )}
        <div className="item comics">
          <Link to="/comics">
            <span>COMICS</span>
            <GiSlicingArrow />
          </Link>
        </div>
        <div className="shadow"></div>
      </div>
      <section id="characters" className="flexContainer">
        {filteredCharacters.map((character, index) => {
          return (
            <div key={index + character._id} className="blur">
              <article className="card">
                <Link to={`/character/${character._id}`}>
                  <figure>
                    <img
                      src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                      alt={character.name}
                    />
                    <figcaption>{character.description}</figcaption>
                  </figure>
                  <p className="name flexContainer">
                    <span>{character.name}</span>
                  </p>
                </Link>
                <span
                  className={
                    isLocalFavorite(character._id)
                      ? "icon-favoris active"
                      : "icon-favoris"
                  }
                  onClick={() => {
                    handleClickFavoris(character._id);
                  }}
                >
                  <TiStarFullOutline />
                </span>
              </article>
            </div>
          );
        })}
      </section>
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="key"
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </button>

          <span>
            Page {pagination.currentPage} sur {pagination.totalPages}
          </span>

          <button
            className="key"
            disabled={!pagination.hasNextPage}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      )}
      {visibleModalErrorFav && (
        <ModalErrorFav
          setVisibleModalLog={setVisibleModalLog}
          setVisibleModalErrorFav={setVisibleModalErrorFav}
        />
      )}
    </>
  );
};

export default Characters;
