import { Card, Col } from "react-bootstrap";

function ShowAllCards({ card }) {
  return (
    <>
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
    </>
  );
}

export default ShowAllCards;
