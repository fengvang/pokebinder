import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";

function SetsCards() {
  const location = useLocation();
  const navigate = useNavigate();
  const set = location.state.set;
  const setData = location.state.setData || location.state.cardData;
  const numPages =
    setData?.totalCount && setData?.pageSize
      ? Math.ceil(setData.totalCount / setData.pageSize)
      : 0;
  const [currentPage, setCurrentPage] = useState(1);

  const handleCardClick = (clickedCard) => {
    if (clickedCard.supertype === "Pokémon") {
      navigate(`/pokémon-card?${clickedCard.name}`, {
        state: {
          cardData: clickedCard,
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

  const handlePageChange = async (page) => {
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

  useEffect(() => {
    setCurrentPage(setData?.page);
  }, [setData]);

  return (
    <Container>
      <Row
        style={{ marginTop: "25px" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Image
          src={set.images.logo}
          alt={set.name}
          style={{ height: "180px", width: "auto" }}
        />
      </Row>
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
            onChange={(event, page) => handlePageChange(page)}
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
            onChange={(event, page) => handlePageChange(page)}
          />
        )}
      </Row>
    </Container>
  );
}

export default SetsCards;
