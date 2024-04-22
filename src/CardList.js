import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";

function CardList() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSubtype, setPokemonSubtype] = useState("");
  const numPages =
    pokemonCardList?.totalCount && pokemonCardList?.pageSize
      ? Math.ceil(pokemonCardList.totalCount / pokemonCardList.pageSize)
      : 0;

  const [currentPage, setCurrentPage] = useState(1);

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/pokémon-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
          name: pokemonName,
          subtype: pokemonSubtype,
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

  const handleChange = async (page) => {
    setCurrentPage(page);

    try {
      const response = await fetch("/search-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            name: pokemonName,
            subtype: pokemonSubtype,
            page: page,
            pageSize: 30,
          },
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const cardData = await response.json();

      navigate(`/results?${pokemonName}&page=${page}`, {
        state: {
          cardData: cardData,
          query: {
            name: pokemonName,
            subtype: pokemonSubtype,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const cardData = location.state.cardData;
    setPokemonCardList(cardData);
    setPokemonName(localStorage.getItem("pokemonName"));
    setPokemonSubtype(localStorage.getItem("pokemonSubtype"));
    setCurrentPage(cardData?.page);

    // const cardHPMatch =
    //   hpValue <= 0 || hpValue >= 300 || parseInt(card.hp) <= hpValue;
    // return cardHPMatch;
  }, [location.state.cardData]);

  return (
    <>
      <Row id="card-results-count">
        {pokemonCardList?.data.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          pokemonCardList?.data.map((card) => (
            <Col key={card.id} className="px-0 card-image-col">
              <Card.Img
                className="card-image"
                src={card.images.large}
                alt={card.name}
                style={{ width: "200px" }}
                onClick={() => handleCardClick(card)}
                onLoad={(e) => e.target.classList.add("card-image-loaded")}
              />
            </Col>
          ))
        )}
      </Row>
      <Row>
        {window.innerWidth < 576 ? (
          <Pagination
            count={numPages}
            color="primary"
            shape="rounded"
            variant="outlined"
            showFirstButton={true}
            showLastButton={true}
            hideNextButton={true}
            hidePrevButton={true}
            boundaryCount={1}
            siblingCount={1}
            page={currentPage}
            onChange={(event, page) => handleChange(page)}
          />
        ) : (
          <Pagination
            count={numPages}
            color="primary"
            shape="rounded"
            variant="outlined"
            showFirstButton={true}
            showLastButton={true}
            boundaryCount={1}
            siblingCount={4}
            page={currentPage}
            onChange={(event, page) => handleChange(page)}
          />
        )}
      </Row>
    </>
  );
}

export default CardList;
