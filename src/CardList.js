import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "react-bootstrap";

function CardList() {
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

  return (
    <>
      <Row>
        {pokemonCardList?.data.map((card) => (
          <Col key={card.id} xs={6} sm={6} md={4} lg={3} xl={3}>
            <Card className="my-3">
              {/* eslint-disable-next-line */}
              <a className="card-image" href="#">
                <Card.Img variant="top" src={card.images.large} />
              </a>
              <Card.Body>
                <Card.Title>
                  <h5>{card.name}</h5>
                </Card.Title>
                <Card.Text>
                  <b>Set:</b> {card.set.name} {card.set.series}
                </Card.Text>
                <Card.Text>
                  <b>Rarity:</b> {card.rarity} #{card.number}/
                  {card.set.printedTotal}
                </Card.Text>
                <Card.Text>
                  <b>Market Price:</b>
                  {card.tcgplayer &&
                  card.tcgplayer.prices &&
                  card.tcgplayer.prices.holofoil &&
                  card.tcgplayer.prices.holofoil.market ? (
                    <i> ${card.tcgplayer.prices.holofoil.market.toFixed(2)}</i>
                  ) : (
                    <i> No data</i>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button className="button results-button" onClick={goBack}>
        Go back
      </Button>
    </>
  );
}

export default CardList;
