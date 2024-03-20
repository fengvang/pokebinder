import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Button } from "react-bootstrap";
import ShowAllCards from "./ShowAllCards";
import TypeFilter from "./TypeFilter";

function CardList({ checkedTypes }) {
  const location = useLocation();
  const history = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);
  }, [location.state.cardData]);

  const goBack = () => {
    history("/");
  };

  const anyTypeChecked = Object.values(checkedTypes).includes(true);
  const trueTypes = Object.keys(checkedTypes).filter(
    (type) => checkedTypes[type]
  );

  function checkFilteredType(trueTypes, cardTypes) {
    return (
      Array.isArray(cardTypes) &&
      cardTypes.some((type) => trueTypes.includes(type))
    );
  }

  return (
    <>
      <Row>
        {(!anyTypeChecked &&
          pokemonCardList?.data.map((card) => <ShowAllCards card={card} />)) ||
          (anyTypeChecked &&
            pokemonCardList?.data
              .filter((card) => checkFilteredType(trueTypes, card.types))
              .map((filteredCard) => {
                console.log(
                  "Comparing",
                  trueTypes,
                  "and",
                  filteredCard.types.join(" ")
                );
                return <TypeFilter filteredCard={filteredCard} />;
              }))}
      </Row>
      <Button className="button results-button" onClick={goBack}>
        Go back
      </Button>
    </>
  );
}

export default CardList;
