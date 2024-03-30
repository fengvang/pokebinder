import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";

function CardList({ checkedTypes, checkedSubtypes, hpValue }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);

    // const cardHPMatch =
    //   hpValue <= 0 || hpValue >= 300 || parseInt(card.hp) <= hpValue;
    // return cardHPMatch;
  }, [location.state.cardData]);

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

  return (
    <>
      <Row id="card-results-count">
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          pokemonCardList?.data.map((card) => (
            <Col key={card.id} xs={6} sm={3} md={2} lg={2} xl={3}>
              <Card className="my-3">
                <Card.Img
                  className="card-image"
                  src={card.images.large}
                  alt={card.name}
                  onClick={handleCardClick}
                />
              </Card>
            </Col>
          ))
        )}
      </Row>
    </>
  );
}

export default CardList;
