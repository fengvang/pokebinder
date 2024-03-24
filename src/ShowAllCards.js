import { Card, Col } from "react-bootstrap";

function ShowAllCards({ card, onCardClick }) {
  const handleClick = () => {
    onCardClick(card);
  };

  // transform price type from camel case to normal
  function formatType(type) {
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  let firstPrice = null;

  // find the first price type
  if (card && card.tcgplayer && card.tcgplayer.prices) {
    for (const [type, prices] of Object.entries(card.tcgplayer.prices)) {
      firstPrice = (
        <span key={type}>
          <b>Market Price ({formatType(type)}):</b>
          <i>{prices.market ? ` $${prices.market.toFixed(2)}` : ""}</i>
        </span>
      );
      break; // break after the first iteration
    }
  }

  return (
    <>
      <Col key={card.id} xs={6} sm={6} md={4} lg={3} xl={3}>
        <Card className="my-3">
          <Card.Img
            className="card-image"
            variant="top"
            src={card.images.large}
            onClick={handleClick}
          />
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
            <Card.Text>{firstPrice ? firstPrice : ""}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default ShowAllCards;
