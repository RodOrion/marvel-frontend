import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./comics.css";

const Comics = ({ formDataSearch }) => {
  const [dataComics, setDataComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchDataComics = async (page = 1, searchName = "") => {
    setIsLoading(true);
    try {
      let url = `https://site--backend-marvel--zcmn9mpggpg8.code.run/comics?page=${page}`;
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

  return isLoading ? (
    <p>En cours de chargement</p>
  ) : (
    <>
      <div className="navigation flexContainer">
        <h2>Comics</h2>
        <div className="item characters">
          <Link to="/">CHARACTERS</Link>
        </div>
      </div>
      <section id="comics" className="flexContainer">
        <h2>comics</h2>
        {dataComics.map((comic, index) => {
          return (
            <article key={index} className="">
              <figure>
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt=""
                />
                <figcaption>{comic.description}</figcaption>
              </figure>
              <p>{comic.title}</p>
            </article>
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
    </>
  );
};

export default Comics;
