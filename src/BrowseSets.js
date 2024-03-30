import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const series = [
  "Base",
  "Black & White",
  "Diamond & Pearl",
  "E-Card",
  "EX",
  "Gym",
  "HeartGold & SoulSilver",
  "Neo",
  "NP",
  "Other",
  "POP",
  "Platinum",
  "Scarlet & Violet",
  "Sun & Moon",
  "Sword & Shield",
  "XY",
];

function BrowseSets() {
  const [seriesLogoImg, setSeriesLogoImg] = useState(null);
  const getSeries = async () => {
    try {
      const response = await fetch("/get-series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: series,
        }),
      });

      const data = await response.json();

      setSeriesLogoImg(data);

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getSeries();
  }, []);

  function removeNonLetters(str) {
    return typeof str === "string" ? str.replace(/[^a-zA-Z]/g, "") : null;
  }

  return (
    <Container>
      <h1
        className="d-flex justify-content-center align-items-center"
        style={{ marginTop: "25px" }}
      >
        Click a set to view all cards in set
      </h1>

      {seriesLogoImg !== null &&
        Object.entries(seriesLogoImg).map(([setName, imageURL]) => (
          <React.Fragment key={setName}>
            <h3>{setName}</h3>
            <Row key={setName}>
              {Object.entries(imageURL).map(([seriesName, image]) => (
                <Col key={seriesName}>
                  <Card className="my-3">
                    <Card.Img
                      variant="top"
                      src={image}
                      style={{
                        width: "400px",
                        height: "200px",
                      }}
                      className={`card-series-img ${removeNonLetters(
                        seriesName
                      )}`}
                    />
                    <Card.Body>
                      <div style={{ height: "100px", overflow: "hidden" }}>
                        <Card.Title>
                          <h5>{seriesName}</h5>
                        </Card.Title>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </React.Fragment>
        ))}
    </Container>
  );
}

export default BrowseSets;
