import { Row, Col } from "react-bootstrap";
import SetsCards from "./SetsCards";
import { useEffect } from "react";

function BrowseBySetsResults() {
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <>
      <Row>
        <Col>
          <SetsCards />
        </Col>
      </Row>
    </>
  );
}

export default BrowseBySetsResults;
