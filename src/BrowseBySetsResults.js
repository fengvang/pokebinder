import { Container, Row, Col } from "react-bootstrap";
import SetsCards from "./SetsCards";
import { useEffect } from "react";

function BrowseBySetsResults() {
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

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
