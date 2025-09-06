import Cookies from "js-cookie";
import axios from "axios";

/*** CONNEXION ***/
export const removeMultipleCookies = (cookieNames) => {
  cookieNames.forEach((name) => {
    Cookies.remove(name);
  });
};
/*** DÉCONNEXION ***/
export const addMultipleCookies = (cookiesData) => {
  Object.entries(cookiesData).forEach(([name, value]) => {
    Cookies.set(name, value);
  });
};

/*** ADD FAVORITES */
export const addToFavorites = (id) => {
  const cookieName = "charactersIDFav";

  // Récupérer les favoris existants sous forme de tableau
  const existingFavoris = JSON.parse(Cookies.get(cookieName) || "[]");

  // filtrage doublons
  if (!existingFavoris.includes(id)) {
    const newFavoris = [...existingFavoris, id];
    // Sauvegarder avec expiration de 7 jours
    Cookies.set(cookieName, JSON.stringify(newFavoris), { expires: 7 });
    return newFavoris;
  }

  return existingFavoris;
};

export const addToFavorites2 = async (
  comicID,
  token,
  setLocalFavorites,
  localFavorites
) => {
  if (!token) return false;

  // Optimistic update (mise à jour immédiate)
  const updatedFavorites = [...localFavorites, comicID];
  setLocalFavorites(updatedFavorites);
  Cookies.set("charactersIDFav", JSON.stringify(updatedFavorites), {
    expires: 7,
  });

  try {
    const response = await axios.post(
      `https://site--backend-marvel--zcmn9mpggpg8.code.run/favoris/${comicID}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Synchroniser avec la réponse du serveur
    const serverFavorites = response.data.favoris;
    setLocalFavorites(serverFavorites);
    Cookies.set("charactersIDFav", JSON.stringify(serverFavorites), {
      expires: 7,
    });

    return true;
  } catch (error) {
    console.error("Erreur ajout favori:", error);
    // Rollback en cas d'erreur
    const rollbackFavorites = localFavorites.filter((id) => id !== comicID);
    setLocalFavorites(rollbackFavorites);
    Cookies.set("charactersIDFav", JSON.stringify(rollbackFavorites), {
      expires: 7,
    });
    return false;
  }
};

/*** CHECK FAVORITES */
export const checkFavorite = (id) => {
  const cookieName = "charactersIDFav";
  const existingFavoris = JSON.parse(Cookies.get(cookieName) || "[]");
  if (existingFavoris.length > 0) {
    return existingFavoris.includes(id) ? true : false;
  }
  return false;
};

/*** REMOVE FAVORITES */
export const removeFromFavorites = (id) => {
  const cookieName = "charactersIDFav";
  const existingFavoris = JSON.parse(Cookies.get(cookieName) || "[]");
  const updatedFavoris = existingFavoris.filter((favId) => favId !== id);

  Cookies.set(cookieName, JSON.stringify(updatedFavoris), { expires: 7 });
  return updatedFavoris;
};
