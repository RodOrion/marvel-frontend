import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./comics.css";
import ModalErrorFav from "../components/ModalErrorFav";
import { TiStarFullOutline } from "react-icons/ti";
import { GiSlicingArrow } from "react-icons/gi";
import Cookies from "js-cookie";

const Comics = ({
  token,
  formDataSearch,
  localFavorites,
  setLocalFavorites,
  setVisibleModalLog,
}) => {
  const [dataComics, setDataComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [visibleModalErrorFav, setVisibleModalErrorFav] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const fetchDataComics = async (page = 1, searchName = "") => {
    setIsLoading(true);
    try {
      let url = `https://site--backend-marvel--zcmn9mpggpg8.code.run/comics?page=${page}`; //`https://site--backend-marvel--zcmn9mpggpg8.code.run/comics?page=${page}`
      if (searchName && searchName.trim() !== "") {
        url += `&title=${searchName}`;
      }
      const response = await axios.get(url);
      setDataComics(response.data.results);
      //console.log(response.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataComics(1, formDataSearch);
  }, [formDataSearch]);

  // Navigation pagination
  const handlePageChange = (newPage) => {
    fetchDataComics(newPage, formDataSearch);
  };

  /***********************/
  /***** FAVORITES ******/
  /*********************/
  // Extraire les IDs des favoris comicss
  const extractFavoriteIds = (serverFavoris) => {
    return serverFavoris
      .filter((fav) => fav.type_favoris === "comics")
      .map((fav) => fav.id_favoris);
  };
  // Charger les favoris au montage
  useEffect(() => {
    const cookieFavorites = JSON.parse(Cookies.get("comicsIDFav") || "[]");
    setLocalFavorites(cookieFavorites);
  }, [setLocalFavorites]);

  // Fonction pour checker si doublon de favoris
  const isLocalFavorite = (comicsID) => localFavorites?.includes(comicsID);

  // Add to favoris
  const addToFavorites = async (comicsID) => {
    if (!token) return false;
    //console.log("Adding favorite for comicsID:", comicsID);
    // mise à jour immédiate
    const updatedFavorites = [...localFavorites, comicsID];
    setLocalFavorites(updatedFavorites);
    Cookies.set("comicsIDFav", JSON.stringify(updatedFavorites), {
      expires: 7,
    });

    try {
      const response = await axios.post(
        `https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/comics/${comicsID}`, //`https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/comics/${comicsID}`
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //console.log("response:", response.data);
      // Synchroniser avec la réponse du serveur
      const serverFavorites = extractFavoriteIds(response.data.favoris);
      setLocalFavorites(serverFavorites);
      Cookies.set("comicsIDFav", JSON.stringify(serverFavorites), {
        expires: 7,
      });

      return true;
    } catch (error) {
      console.error("Erreur ajout favori:", error);
      // Rollback en cas d'erreur
      const rollbackFavorites = localFavorites.filter((id) => id !== comicsID);
      setLocalFavorites(rollbackFavorites);
      Cookies.set("comicsIDFav", JSON.stringify(rollbackFavorites), {
        expires: 7,
      });
      return false;
    }
  };

  // Remove favoris
  const removeFromFavorites = async (comicsID) => {
    if (!token) return false;

    // Optimistic update
    const updatedFavorites = localFavorites.filter((id) => id !== comicsID);
    setLocalFavorites(updatedFavorites);
    Cookies.set("comicsIDFav", JSON.stringify(updatedFavorites), {
      expires: 7,
    });

    try {
      const response = await axios.delete(
        `https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/${comicsID}`, //`https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/${characterID}`
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Synchroniser avec la réponse du serveur
      const serverFavorites = extractFavoriteIds(response.data.favoris);
      setLocalFavorites(serverFavorites);
      Cookies.set("comicsIDFav", JSON.stringify(serverFavorites), {
        expires: 7,
      });

      return true;
    } catch (error) {
      console.error("Erreur suppression favoris:", error);
      // Rollback
      const rollbackFavorites = [...localFavorites, comicsID];
      setLocalFavorites(rollbackFavorites);
      Cookies.set("comicsIDFav", JSON.stringify(rollbackFavorites), {
        expires: 7,
      });
      return false;
    }
  };

  // gestion ajout suppression de favoris
  const handleClickFavoris = async (comicsID) => {
    if (!token) {
      setVisibleModalErrorFav((prev) => !prev);
      return;
    }

    const isCurrentlyFavorite = isLocalFavorite(comicsID);

    if (isCurrentlyFavorite) {
      //remove
      await removeFromFavorites(comicsID);
    } else {
      // add
      await addToFavorites(comicsID);
    }
  };

  // show favoris
  const handleClickShowFavoris = async () => {
    setShowFavoritesOnly((prev) => !prev);
  };

  const filteredComics = showFavoritesOnly
    ? dataComics.filter((comic) => isLocalFavorite(comic._id))
    : dataComics;

  return isLoading ? (
    <p>En cours de chargement</p>
  ) : (
    <>
      <div className="navigation flexContainer">
        <h2>Comics</h2>
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
          <Link to="/">
            <span>CHARACTERS</span>
            <GiSlicingArrow />
          </Link>
        </div>
        <div className="shadow"></div>
      </div>
      <section id="comics" className="flexContainer">
        {filteredComics.map((comic, index) => {
          return (
            <div key={index + comic._id} className="blur">
              <article className="card">
                <Link to={`/comic/${comic._id}`}>
                  <figure>
                    <img
                      src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                      alt={comic.name}
                    />
                  </figure>
                  <p className="name flexContainer">
                    <span>{comic.title}</span>
                  </p>
                </Link>
                <span
                  className={
                    isLocalFavorite(comic._id)
                      ? "icon-favoris active"
                      : "icon-favoris"
                  }
                  onClick={() => {
                    handleClickFavoris(comic._id);
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
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </button>

          <span>
            Page {pagination.currentPage} sur {pagination.totalPages}
          </span>

          <button
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

export default Comics;
