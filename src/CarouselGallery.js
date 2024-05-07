import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Image, Container } from "react-bootstrap";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import * as MuiIcon from "./MuiIcons";

function CarouselGallery() {
  const [newestSet, setNewestSet] = useState(
    JSON.parse(sessionStorage.getItem("newestSet")) || null
  );
  const [newestSetCards, setNewestSetCards] = useState(
    JSON.parse(sessionStorage.getItem("newestSetCards")) || null
  );
  const navigate = useNavigate();

  // Quick fix for server error when fetching newest set
  const localSet = sessionStorage.getItem("newestSet");
  const localSetCards = sessionStorage.getItem("newestSetCards");

  if (
    localSet === `{"error":"Internal server error"}` ||
    localSetCards === `{"error":"Internal server error"}`
  ) {
    sessionStorage.removeItem("newestSet");
    sessionStorage.removeItem("newestSetCards");
  }
  // End quick fix

  function formatDate(originalDate) {
    const parts = originalDate.split("/");
    const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
    return formattedDate;
  }

  useEffect(() => {
    const getNewestSet = async () => {
      try {
        const response = await fetch(
          "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-newest-set",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const set = await response.json();

        setNewestSet(set);

        if (
          sessionStorage.getItem("newestSet") === null ||
          (sessionStorage.getItem("newestSet") !== null &&
            JSON.parse(sessionStorage.getItem("newestSet")).id !== set.id)
        ) {
          sessionStorage.setItem("newestSet", JSON.stringify(set));
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
        const response = await fetch(
          "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-set-data",
          {
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
          }
        );

        const data = await response.json();

        setNewestSetCards(data);

        if (
          sessionStorage.getItem("newestSetCards") === null ||
          (sessionStorage.getItem("newestSetCards") !== null &&
            JSON.parse(sessionStorage.getItem("newestSetCards")) !== data)
        ) {
          sessionStorage.setItem("newestSetCards", JSON.stringify(data));
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
      const response = await fetch(
        "https://us-central1-pokebinder-ae627.cloudfunctions.net/app/get-set-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              setID: clickedSet.id,
              page: 1,
              pageSize: 36,
            },
          }),
        }
      );

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

  const handleCardClick = (clickedCard, id) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/pokémon-card?${clickedCard.name}`, {
        state: {
          setData: newestSet,
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Trainer") {
      navigate(`/trainer-card?${clickedCard.name}`, {
        state: {
          setData: newestSet,
          cardData: clickedCard,
        },
      });
    } else if (clickedCard.supertype === "Energy") {
      navigate(`/energy-card?${clickedCard.name}`, {
        state: {
          setData: newestSet,
          cardData: clickedCard,
        },
      });
    }
  };

  return (
    <Container>
      {newestSet && newestSetCards && (
        <>
          <div className="d-flex align-items-center justify-content-center">
            <Image
              src={newestSet.images.logo}
              className="newest-set-img"
              onClick={() => handleSetClicked(newestSet)}
              onLoad={(e) => e.target.classList.add("newest-set-img-loaded")}
            />
          </div>
          <div
            className="d-flex align-items-start justify-content-center"
            style={{ fontSize: ".78em" }}
          >
            <MuiIcon.Calendar
              style={{ fontSize: "1rem", marginRight: "5px" }}
            />
            Released {formatDate(newestSet.releaseDate)}
          </div>

          <Splide
            options={{
              height: "340px",
              type: "slide",
              perPage: window.innerWidth < 576 ? 2 : 6,
              perMove: 1,
              wheel: true,
              speed: 1000,
              easing: "ease",
            }}
          >
            {newestSetCards?.data.map((card, index) => (
              <SplideSlide
                key={index}
                className={"d-flex align-items-center justify-content-center"}
              >
                <Image
                  src={card.images.small}
                  alt={card.name}
                  className="newest-set-cards"
                  onClick={() => handleCardClick(card)}
                  onLoad={(e) =>
                    e.target.classList.add("newest-set-cards-loaded")
                  }
                />
              </SplideSlide>
            ))}
          </Splide>
        </>
      )}
    </Container>
  );
}

export default CarouselGallery;
