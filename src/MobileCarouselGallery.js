import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Carousel, Container, Image, Card, Col } from "react-bootstrap";

function MobileCarouselGallery() {
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
            Released {formatDate(newestSet.releaseDate)}
          </div>
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={false}
            prevIcon={false}
            nextIcon={false}
          >
            <Carousel.Item interval={5000}>
              <Col
                className="d-flex align-items-center justify-content-evenly"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(0, 2).map((card, index) => (
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
                className="d-flex align-items-center justify-content-evenly"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(2, 4).map((card, index) => (
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
                className="d-flex align-items-center justify-content-evenly"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(4, 6).map((card, index) => (
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
                className="d-flex align-items-center justify-content-evenly"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(6, 8).map((card, index) => (
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
                className="d-flex align-items-center justify-content-evenly"
                style={{ height: "300px" }}
              >
                {newestSetCards?.data.slice(8, 10).map((card, index) => (
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

export default MobileCarouselGallery;
