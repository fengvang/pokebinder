import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";

function CardList({
  checkedTypes,
  checkedSubtypes,
  hpValue,
  pokemonName,
  pokemonSubtype,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pokemonCardList, setPokemonCardList] = useState(null);
  const numPages = parseInt(
    pokemonCardList?.totalCount / pokemonCardList?.pageSize + 1
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(location.search.substring(location.search.indexOf("=") + 1))
  );

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/card?${clickedCard.name}`, {
        state: {
          prevURL: { path: location.pathname, search: location.search },
          originalCardData: location.state.cardData,
          cardData: clickedCard,
          filteredTypes: checkedTypes,
          filteredSubtypes: checkedSubtypes,
          query: {
            name: pokemonName,
            subtype: pokemonSubtype,
          },
        },
      });
    } else console.log("RIP beach");
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
            pageSize: 32,
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
            <Col key={card.id} xs={6} sm={6} md={3} lg={3} xl={3}>
              <Card className="my-3 d-flex justify-content-center align-items-center">
                <Card.Img
                  className="card-image"
                  src={card.images.large}
                  alt={card.name}
                  style={{ width: "100%" }}
                  onClick={() => handleCardClick(card)}
                  onLoad={(e) => e.target.classList.add("card-image-loaded")}
                />
              </Card>
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
