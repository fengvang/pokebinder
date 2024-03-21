import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function IndividualPage() {
  const location = useLocation();
  const card = location.state.cardData;

  let formattedDate = null;
  let options;
  let formattedDateString;

  if (card && card.tcgplayer && card.tcgplayer.updatedAt) {
    formattedDate = new Date(card.tcgplayer.updatedAt);
    options = { month: "short", day: "2-digit", year: "numeric" };
    formattedDateString = formattedDate.toLocaleDateString("en-US", options);
  }

  // transform price type from camel case to normal
  function formatType(type) {
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }

  // scroll to top when page loads, for fix on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBackOnePage = () => {
    window.history.go(-1);
  };

  return (
    <Container>
      <h1>
        {card.name} - {card.number}
      </h1>
      <Row>
        <Col xs="auto" md={5} className="individual-image-col">
          <img
            className="individual-page-image"
            src={card.images.large}
            alt={card.name}
          />
        </Col>
        <Col md={7} className="individual-card-info">
          <Row className="first-row">
            <h4>Card Description</h4>
            <div>
              <b>HP:</b> <i>{card.hp}</i>
            </div>
            <div>
              <b>Type(s):</b> <i>{card.types.join(", ")}</i>
            </div>
            <div>
              {card.hasOwnProperty("rules") ? (
                <span>
                  <b>Card Rules:</b> <i>{card.rules}</i>)
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <b>Attack(s) / (Name - Damage):</b>
              {card.attacks.map((attack, index) => (
                <div className="list" key={index}>
                  <b>
                    {attack.name}{" "}
                    {attack.damage !== "" ? `- ${attack.damage}` : ""}
                  </b>
                  <div className="list">
                    <i>{attack.text}</i>
                  </div>
                </div>
              ))}
              <div>
                <b>Artist:</b> <i>{card.artist}</i>
              </div>
            </div>
          </Row>
          <Row className="second-row">
            <h4>Price Data</h4>
            <div style={{ marginBottom: "8px" }}>
              {card && card.tcgplayer && card.tcgplayer.updatedAt ? (
                <span>
                  <b>Last Price Update:</b> <i>{formattedDateString}</i>
                </span>
              ) : null}
            </div>

            {card && card.tcgplayer && card.tcgplayer.prices ? (
              Object.entries(card.tcgplayer.prices).map(([type, prices]) => (
                <div key={type}>
                  <div>
                    <h5>{formatType(type)}:</h5>
                  </div>
                  <div className="list">
                    <p>
                      <b>Low:</b>{" "}
                      <i>
                        {prices.low ? `$${prices.low.toFixed(2)}` : "No data"}
                      </i>
                    </p>
                    <p>
                      <b>Mid:</b>{" "}
                      <i>
                        {prices.mid ? `$${prices.mid.toFixed(2)}` : "No data"}
                      </i>
                    </p>
                    <p>
                      <b>High:</b>{" "}
                      <i>
                        {prices.high ? `$${prices.high.toFixed(2)}` : "No data"}
                      </i>
                    </p>
                    <p>
                      <b>Market:</b>{" "}
                      <i>
                        {prices.market
                          ? `$${prices.market.toFixed(2)}`
                          : "No data"}
                      </i>
                    </p>
                    <p>
                      <b>Direct Low:</b>{" "}
                      <i>
                        {prices.directLow
                          ? `$${prices.directLow.toFixed(2)}`
                          : "No data"}
                      </i>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <i>No price data available</i>
            )}
          </Row>
        </Col>
      </Row>
      <Button className="button results-button" onClick={goBackOnePage}>
        Go back
      </Button>
    </Container>
  );
}

export default IndividualPage;
