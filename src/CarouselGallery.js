import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Carousel, Container, Image, Card, Col } from "react-bootstrap";

function CarouselGallery() {
  const [newestSet, setNewestSet] = useState(null);
  const [newestSetCards, setNewestSetCards] = useState(null);

  function formatDate(originalDate) {
    const parts = originalDate.split("/");
    const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
    return formattedDate;
  }

  useEffect(() => {
    const getNewestSet = async () => {
      try {
        const response = await fetch("/get-newest-set", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const set = await response.json();

        setNewestSet(set);

        if (!response.ok) {
          throw new Error("Failed to fetch end point");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getNewestSet();
  }, []);

  useEffect(() => {
    const getSetData = async (set) => {
      try {
        const response = await fetch("/get-set-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              setID: set?.id,
              page: 1,
              pageSize: 12,
            },
          }),
        });

        const data = await response.json();

        setNewestSetCards(data);

        if (!response.ok) {
          throw new Error("Failed to fetch end point");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getSetData(newestSet);
  }, [newestSet]);

  return (
    <Container>
      {newestSet && newestSetCards && (
        <>
          <span className="d-flex align-items-center justify-content-center">
            <Image
              src={newestSet.images.logo}
              style={{ width: "300px", marginTop: "25px" }}
            />
          </span>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ fontSize: ".78em" }}
          >
            Released {formatDate(newestSet.releaseDate)}
          </div>
          <Carousel
            indicators={false}
            prevIcon={false}
            nextIcon={false}
            style={{ marginTop: "25px" }}
          >
            <Carousel.Item interval={5000}>
              <Col className="d-flex align-items-center justify-content-evenly">
                {newestSetCards?.data.slice(0, 7).map((card, index) => (
                  <Card.Img
                    key={index}
                    src={card.images.large}
                    alt={card.name}
                    className="newest-set-cards"
                  />
                ))}
              </Col>
            </Carousel.Item>
            <Carousel.Item interval={5000}>
              <Col className="d-flex align-items-center justify-content-evenly">
                {newestSetCards?.data.slice(6, 12).map((card, index) => (
                  <Card.Img
                    key={index}
                    src={card.images.large}
                    alt={card.name}
                    className="newest-set-cards"
                  />
                ))}
              </Col>
            </Carousel.Item>
          </Carousel>
        </>
      )}
    </Container>
  );
}

export default CarouselGallery;
