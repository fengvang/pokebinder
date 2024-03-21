import { Card, Col } from "react-bootstrap";

function ShowAllCards({ card, onCardClick }) {
  const handleClick = () => {
    onCardClick(card);
  };

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
            <Card.Text>
              {card.tcgplayer &&
              card.tcgplayer.prices &&
              card.tcgplayer.prices.holofoil &&
              card.tcgplayer.prices.holofoil.market ? (
                <span>
                  <b>Market Price (Holofoil):</b>
                  <i> ${card.tcgplayer.prices.holofoil.market.toFixed(2)}</i>
                </span>
              ) : card.tcgplayer &&
                card.tcgplayer.prices &&
                card.tcgplayer.prices.normal &&
                card.tcgplayer.prices.normal.market ? (
                <span>
                  <b>Market Price (Normal):</b>
                  <i> ${card.tcgplayer.prices.normal.market.toFixed(2)}</i>
                </span>
              ) : card.cardmarket &&
                card.cardmarket.prices &&
                card.cardmarket.prices.averageSellPrice ? (
                <span>
                  <b>Avg Sell Price:</b>
                  <i> ${card.cardmarket.prices.averageSellPrice.toFixed(2)}</i>
                </span>
              ) : (
                ""
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default ShowAllCards;
