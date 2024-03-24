import { Card, Col } from "react-bootstrap";

function TypeFilter({ filteredCard, onCardClick }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onCardClick(filteredCard);
  };

  // transform price type from camel case to normal
  function formatType(type) {
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  let firstPrice = null;

  // find the first price type
  if (filteredCard && filteredCard.tcgplayer && filteredCard.tcgplayer.prices) {
    for (const [type, prices] of Object.entries(
      filteredCard.tcgplayer.prices
    )) {
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
      <Col key={filteredCard.id} xs={6} sm={6} md={4} lg={3} xl={3}>
        <Card className="my-3">
          <Card.Img
            className="card-image"
            variant="top"
            src={filteredCard.images.large}
            onClick={handleClick}
          />
          <Card.Body>
            <Card.Title>
              <h5>{filteredCard.name}</h5>
            </Card.Title>
            <Card.Text>
              <b>Set:</b> {filteredCard.set.name} {filteredCard.set.series}
            </Card.Text>
            <Card.Text>
              <b>Rarity:</b> {filteredCard.rarity} #{filteredCard.number}/
              {filteredCard.set.printedTotal}
            </Card.Text>
            <Card.Text>{firstPrice ? firstPrice : ""}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default TypeFilter;
