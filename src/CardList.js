import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row } from "react-bootstrap";
import ShowAllCards from "./ShowAllCards";
import TypeFilter from "./TypeFilter";

function CardList({ checkedTypes }) {
  const location = useLocation();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);
  }, [location.state.cardData]);

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
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="my-3">No data found</h5>
        ) : (
          (!anyTypeChecked &&
            pokemonCardList?.data.map((card, index) => (
              <ShowAllCards key={index} card={card} />
            ))) ||
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
              }))
        )}
      </Row>
    </>
  );
}

export default CardList;
