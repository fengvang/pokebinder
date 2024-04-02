import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";

function SetsCards() {
  const location = useLocation();
  const navigate = useNavigate();
  const set = location.state.set;
  const setData = location.state.setData || location.state.cardData;
  const numPages = parseInt(setData?.totalCount / setData?.pageSize + 1);
  const [currentPage, setCurrentPage] = useState(
    parseInt(location.search.substring(location.search.indexOf("=") + 1))
  );

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/card?${clickedCard.name}`, {
        state: {
          prevURL: { path: location.pathname, search: location.search },
          originalCardData: setData,
          cardData: clickedCard,
          set: set,
          query: {
            name: clickedCard.name,
          },
        },
      });
    } else console.log("RIP beach");
  };

  const handleChange = async (page) => {
    setCurrentPage(page);

    try {
      const response = await fetch("/get-set-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            setID: set.id,
            page: page,
            pageSize: 32,
          },
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const cardData = await response.json();

      navigate(`/browse-by-set?${set.series}=${set.name}&page=${page}`, {
        state: {
          set: set,
          setData: cardData,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <Row id="card-results-count">
        {setData?.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          setData?.data.map((card) => (
            <Col key={card.id} xs={6} sm={6} md={3} lg={3} xl={3}>
              <Card
                className="my-3 d-flex justify-content-center align-items-center"
                style={{ padding: "0px" }}
              >
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
    </Container>
  );
}

export default SetsCards;
