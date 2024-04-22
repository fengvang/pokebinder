import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Carousel, Image, Card, Col, Container } from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";

function CarouselGallery() {
  const [newestSet, setNewestSet] = useState(
    JSON.parse(localStorage.getItem("newestSet")) || null
  );
  const [newestSetCards, setNewestSetCards] = useState(
    JSON.parse(localStorage.getItem("newestSetCards")) || null
  );
  const navigate = useNavigate();

  const [index, setIndex] = useState(
    JSON.parse(localStorage.getItem("index")) || 0
  );

  const handleSelect = (selectedIndex) => {
    localStorage.setItem("index", selectedIndex);
    setIndex(selectedIndex);
  };

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

        if (
          localStorage.getItem("newestSet") === null ||
          (localStorage.getItem("newestSet") !== null &&
            JSON.parse(localStorage.getItem("newestSet")).id !== set.id)
        ) {
          localStorage.setItem("newestSet", JSON.stringify(set));
        }

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
              pageSize: 10,
            },
          }),
        });

        const data = await response.json();

        setNewestSetCards(data);

        if (
          localStorage.getItem("newestSetCards") === null ||
          (localStorage.getItem("newestSetCards") !== null &&
            JSON.parse(localStorage.getItem("newestSetCards")) !== data)
        ) {
          localStorage.setItem("newestSetCards", JSON.stringify(data));
        }

        if (!response.ok) {
          throw new Error("Failed to fetch end point");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getSetData(newestSet);
  }, [newestSet]);

  const handleSetClicked = async (clickedSet) => {
    try {
      const response = await fetch("/get-set-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            setID: clickedSet.id,
            page: 1,
            pageSize: 32,
          },
        }),
      });

      const data = await response.json();

      navigate(
        `/browse-by-set?${clickedSet.series}=${clickedSet.name}&page=1`,
        {
          state: {
            set: clickedSet,
            setData: data,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/pokémon-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
          name: clickedCard.name,
        },
      });
    } else if (clickedCard.supertype === "Trainer") {
      navigate(`/trainer-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Energy") {
      navigate(`/energy-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
        },
      });
    }
  };

  return (
    <Container>
      {newestSet && newestSetCards && (
        <>
          <span className="d-flex align-items-center justify-content-center">
            <Image
              src={newestSet.images.logo}
              className="newest-set-img"
              onClick={() => handleSetClicked(newestSet)}
              onLoad={(e) => e.target.classList.add("newest-set-img-loaded")}
            />
          </span>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ fontSize: ".78em" }}
          >
            <MuiIcon.Calendar
              style={{ fontSize: "1rem", marginRight: "5px" }}
            />
            Released {formatDate(newestSet.releaseDate)}
          </div>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={false}
            style={{ marginTop: "25px" }}
          >
            <Carousel.Item interval={5000}>
              <Col
                className="d-flex align-items-center justify-content-center"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(0, 5).map((card, index) => (
                  <Card.Img
                    key={index}
                    src={card.images.small}
                    alt={card.name}
                    className="newest-set-cards"
                    onClick={() => handleCardClick(card)}
                    onLoad={(e) =>
                      e.target.classList.add("newest-set-cards-loaded")
                    }
                  />
                ))}
              </Col>
            </Carousel.Item>
            <Carousel.Item interval={5000}>
              <Col
                className="d-flex align-items-center justify-content-center"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(5, 10).map((card, index) => (
                  <Card.Img
                    key={index}
                    src={card.images.small}
                    alt={card.name}
                    className="newest-set-cards"
                    onClick={() => handleCardClick(card)}
                    onLoad={(e) =>
                      e.target.classList.add("newest-set-cards-loaded")
                    }
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
