const ModalErrorFav = ({setVisibleModalErrorFav, setVisibleModalLog}) => {

    const handleClick = () => {
        setVisibleModalErrorFav(prev=>!prev)
        setVisibleModalLog(prev=>!prev)
    }

  return (
    <div className="contModalFav" onClick={handleClick}>
        <div className="popupFav" onClick={(event) => {event.stopPropagation();}}>
            <p>Vous devez être connecté pour lister vos favoris</p>
            <div className="flexContainer">
                <button className="key" onClick={handleClick}>S'inscrire</button>
                <button className="key" onClick={handleClick}>Se connecter</button>
            </div>
        </div>
    </div>
);
}

export default ModalErrorFav;