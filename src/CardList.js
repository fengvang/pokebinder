import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import Cards from "./Cards";

function CardList({ checkedTypes, checkedSubtypes, hpValue }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  const anyTypeChecked = Object.values(checkedTypes).includes(true);
  const trueTypes = Object.keys(checkedTypes).filter(
    (type) => checkedTypes[type]
  );

  const anySubtypeChecked = Object.values(checkedSubtypes).includes(true);
  const trueSubtypes = Object.keys(checkedSubtypes).filter(
    (type) => checkedSubtypes[type]
  );

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);
  }, [location.state.cardData]);

  /* Need to filter for subtypes with multiple subs */
  function checkFilteredType(trueTypes, cardTypes) {
    return (
      Array.isArray(cardTypes) &&
      cardTypes.some((type) => trueTypes.includes(type))
    );
  }

  const handleCardClick = (clickedCard) => {
    navigate(`/card?${clickedCard.name}`, {
      state: {
        prevURL: { path: location.pathname, search: location.search },
        originalCardData: location.state.cardData,
        cardData: clickedCard,
        filteredTypes: checkedTypes,
        filteredSubtypes: checkedSubtypes,
      },
    });
  };

  useEffect(() => {
    // Filter the cards based on all conditions
    const filteredCards = pokemonCardList?.data.filter((card) => {
      const cardTypesMatch =
        !anyTypeChecked ||
        trueTypes.some((type) => card.types && card.types.includes(type));
      const cardSubtypesMatch =
        !anySubtypeChecked ||
        trueSubtypes.some((subtype) => card.subtypes?.includes(subtype));
      const cardHPMatch =
        hpValue <= 0 || hpValue >= 300 || parseInt(card.hp) <= hpValue;
      return cardTypesMatch && cardSubtypesMatch && cardHPMatch;
    });

    // Calculate the length of the filtered array
    const length = filteredCards ? filteredCards.length : 0;

    if (document.getElementById("length-id")) {
      if (length === pokemonCardList?.count) {
        document.getElementById("res-length-btn").style.display = "inline";
        document.getElementById("length-id").innerHTML = `See all results`;
      } else if (length > 0) {
        document.getElementById("res-length-btn").style.display = "inline";
        document.getElementById(
          "length-id"
        ).innerHTML = `See ${length} results`;
      } else {
        document.getElementById("res-length-btn").style.display = "none";
      }
    }
  });

  return (
    <>
      <Row id="card-results-count">
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          pokemonCardList?.data
            .filter((card) => {
              const cardTypesMatch =
                !anyTypeChecked || checkFilteredType(trueTypes, card.types);
              const cardSubtypesMatch =
                !anySubtypeChecked ||
                checkFilteredType(trueSubtypes, card.subtypes);
              const cardHPMatch =
                hpValue <= 0 || hpValue >= 300 || parseInt(card.hp) <= hpValue;
              return cardTypesMatch && cardSubtypesMatch && cardHPMatch;
            })
            .map((filteredCard) => (
              <Cards
                key={filteredCard.id}
                filteredCard={filteredCard}
                onCardClick={handleCardClick}
              />
            ))
        )}
      </Row>
    </>
  );
}

export default CardList;
