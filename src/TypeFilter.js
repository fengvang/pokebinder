import { Card, Col } from "react-bootstrap";

function TypeFilter({ filteredCard, onCardClick }) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onCardClick(filteredCard);
  };

  return (
    <>
      <Col key={filteredCard.id} xs={6} sm={6} md={4} lg={3} xl={3}>
        <Card className="my-3">
          <Card.Img
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
            <Card.Text>
              <b>Market Price:</b>
              {filteredCard.tcgplayer &&
              filteredCard.tcgplayer.prices &&
              filteredCard.tcgplayer.prices.holofoil &&
              filteredCard.tcgplayer.prices.holofoil.market ? (
                <i>
                  {" "}
                  ${filteredCard.tcgplayer.prices.holofoil.market.toFixed(2)}
                </i>
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

export default TypeFilter;
