import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import SetsCards from "./SetsCards";

function BrowseBySetsResults() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // document.getElementById("title-row").style.display = "block";
    // document.getElementById("caption-row").style.display = "block";
    // document.getElementById("search-row").style.display = "block";
  });

  const prevURLPath = location.state.path;
  const prevURLSearch = location.state.search;
  const cardData = location.state.cardData;

  window.onpopstate = function (event) {
    navigate(`${prevURLPath}${prevURLSearch}`, {
      state: {
        prevURL: { path: prevURLPath, search: prevURLSearch },
        cardData: cardData,
      },
    });
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <SetsCards />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BrowseBySetsResults;
