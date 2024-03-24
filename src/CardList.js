import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import ShowAllCards from "./ShowAllCards";
import TypeFilter from "./TypeFilter";

function CardList({ checkedTypes, hpValue }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  const anyTypeChecked = Object.values(checkedTypes).includes(true);
  const trueTypes = Object.keys(checkedTypes).filter(
    (type) => checkedTypes[type]
  );

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);
  }, [location.state.cardData]);

  function checkFilteredType(trueTypes, cardTypes) {
    return (
      Array.isArray(cardTypes) &&
      cardTypes.some((type) => trueTypes.includes(type))
    );
  }

  const handleCardClick = (clickedCard) => {
    navigate(`/individual?${location.key}=${clickedCard.name}`, {
      state: {
        prevURL: { path: location.pathname, search: location.search },
        originalCardData: location.state.cardData,
        cardData: clickedCard,
        filteredTypes: checkedTypes,
      },
    });
  };

  // filtering by hpValue not working
  // console.log(hpValue);

  return (
    <>
      <Row>
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="my-3 center-for-mobile">No data found</h5>
        ) : (
          (!anyTypeChecked &&
            pokemonCardList?.data.map((card) => (
              <ShowAllCards
                key={card.id}
                card={card}
                onCardClick={handleCardClick}
              />
            ))) ||
          (anyTypeChecked &&
            checkedTypes &&
            pokemonCardList?.data
              .filter((card) => checkFilteredType(trueTypes, card.types))
              .map((filteredCard) => (
                <TypeFilter
                  key={filteredCard.id}
                  filteredCard={filteredCard}
                  onCardClick={handleCardClick}
                />
              )))
        )}
      </Row>
    </>
  );
}

export default CardList;
