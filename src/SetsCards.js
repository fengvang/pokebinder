import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, Form } from "react-bootstrap";
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
  const [orderBy, setOrderBy] = useState("");

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
            pageSize: 36,
            orderBy: localStorage.getItem("order") || orderBy,
          },
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const cardData = await response.json();

      navigate(`/browse-by-set?${set.series}-${set.name}&page=${page}`, {
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

  const handleSelectChange = async (event) => {
    const order = event.target.value;
    setOrderBy(order);

    if (order !== "number") localStorage.setItem("order", order);
    else localStorage.removeItem("order");

    try {
      const response = await fetch("/get-set-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            setID: set.id,
            page: 1,
            pageSize: 36,
            orderBy: order,
          },
        }),
      });

      const data = await response.json();

      navigate(`/browse-by-set?${set.series}-${set.name}&page=1`, {
        state: {
          set: set,
          setData: data,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch end point");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <Row
        style={{ marginTop: "25px" }}
        className="d-flex align-items-center justify-content-center"
      >
        <Image
          src={set.images.logo}
          alt={set.name}
          style={{ height: "150px", width: "auto" }}
        />
      </Row>

      <Form.Select
        aria-label="set-card-list"
        style={{ width: "200px" }}
        onChange={handleSelectChange}
        defaultValue={localStorage.getItem("order")}
      >
        <option value="number">Number Ascending</option>
        <option value="-number">Number Descending</option>
        <option value="name">Name A-Z</option>
        <option value="-name">Name Z-A</option>
        <option value="-tcgplayer.prices.holofoil">
          Market Price - Highest
        </option>
        <option value="tcgplayer.prices.holofoil">Market Price - Lowest</option>
      </Form.Select>

      <Row id="card-results-count">
        {setData?.length === 0 ? (
          <h5 className="my-3 d-flex align-items-center justify-content-center">
            No data found
          </h5>
        ) : (
          setData?.data.map((card) => (
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
