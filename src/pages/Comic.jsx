import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./character.css";

const Comic = () => {
  const { comic_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dataComic, setDataComic] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    console.log(comic_id);

    const fetchDataComic = async () => {
      try {
        const response = await axios.get(
          `https://site--backend-marvel--zcmn9mpggpg8.code.run/comic/${comic_id}`
        );
        console.log(response.data);
        setDataComic(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setIsLoading(false);
      }
    };
    fetchDataComic();
  }, [comic_id]);

  return isLoading ? (
    <p>En cours de chargement</p>
  ) : (
    <div className="innerContainer">
      <article className="character-sheet">
        <div className="character-content">
          <figure className="character-photo-container">
            <img
              src={`${dataComic.thumbnail.path}.${dataComic.thumbnail.extension}`}
              alt={dataComic.title}
              className="character-image"
            />
            <figcaption className="character-caption">
              <h1 className="character-name-absolute">{dataComic.title}</h1>
            </figcaption>
          </figure>
          <p>{dataComic.description}</p>
        </div>
      </article>
    </div>
  );
};

export default Comic;
