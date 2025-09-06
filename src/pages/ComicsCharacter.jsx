import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

const ComicsCharacter = () => {
  const { character_id } = useParams();
  const [dataComicsCharacter, setDataComicsCharacter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataCharacters = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://site--backend-marvel--zcmn9mpggpg8.code.run/comics_character/${character_id}`
        );
        setDataComicsCharacter(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur:", error);
        setIsLoading(false);
      }
    };
    fetchDataCharacters();
  }, [character_id]);

  return isLoading ? (
    <p>En cours de chargement</p>
  ) : (
    <section id="comics" className="flexContainer">
      <h2>Comics character</h2>
      {dataComicsCharacter.comics.map((comic, index) => {
        return (
          <article key={index} className="">
            <figure>
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt=""
              />
            </figure>
            <p>{comic.title}</p>
          </article>
        );
      })}
    </section>
  );
};

export default ComicsCharacter;
