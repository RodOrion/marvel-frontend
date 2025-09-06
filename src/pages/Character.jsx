import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./character.css";

const Character = () => {
  const { character_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [dataCharacter, setDataCharacter] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    console.log(character_id);

    const fetchDataCharacter = async () => {
      try {
        const response = await axios.get(
          `https://site--backend-marvel--zcmn9mpggpg8.code.run/character/${character_id}`
        );
        console.log(response.data.dataCharacter);
        setDataCharacter(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("error", error.message);
        setIsLoading(false);
      }
    };
    fetchDataCharacter();
  }, [character_id]);

  return isLoading ? (
    <p>En cours de chargement</p>
  ) : (
    <div className="innerContainer">
      <article class="character-sheet">
        <div class="character-content">
          <figure class="character-photo-container">
            <img
              src={`${dataCharacter.dataCharacter.thumbnail.path}.${dataCharacter.dataCharacter.thumbnail.extension}`}
              alt={dataCharacter.dataCharacter.name}
              class="character-image"
            />
            <figcaption class="character-caption">
              <h1 class="character-name-absolute">
                {dataCharacter.dataCharacter.name}
              </h1>
            </figcaption>
          </figure>

          <div class="character-details">
            {dataCharacter.dataCharacter.description && (
              <p className="character-description">
                {dataCharacter.dataCharacter.description}
              </p>
            )}

            <h2 class="comics-heading">Comics associés</h2>
            {dataCharacter.dataComics.length === 0 ? (
              <p className="no-comics-message">Aucun comic associé trouvé.</p>
            ) : (
              <div class="comics-grid">
                {dataCharacter.dataComics.map((c) => (
                  <div key={c._id} className="comic-card">
                    <Link to={`/comic/${c._id}`}>
                      <img
                        src={`${c.thumbnail.path}/standard_fantastic.${c.thumbnail.extension}`}
                        alt={c.title}
                        className="comic-image"
                      />
                      <h3 className="comic-title">{c.title}</h3>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default Character;
