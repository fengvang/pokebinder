import React, { useState, useEffect } from "react";
import {
  Row,
  Form,
  Col,
  Button,
  Card,
  Collapse,
  Container,
} from "react-bootstrap";
import * as MuiIcon from "./MuiIcons";
import * as TypeIcon from "./Icons";

const typesWithIcon = {
  Colorless: { name: "Colorless", img: TypeIcon.colorless },
  Darkness: { name: "Darkness", img: TypeIcon.darkness },
  Dragon: { name: "Dragon", img: TypeIcon.dragon },
  Fairy: { name: "Fairy", img: TypeIcon.fairy },
  Fighting: { name: "Fighting", img: TypeIcon.fighting },
  Fire: { name: "Fire", img: TypeIcon.fire },
  Grass: { name: "Grass", img: TypeIcon.grass },
  Lightning: { name: "Lightning", img: TypeIcon.lightning },
  Metal: { name: "Metal", img: TypeIcon.metal },
  Psychic: { name: "Psychic", img: TypeIcon.psychic },
  Water: { name: "Water", img: TypeIcon.water },
};

const subTypes = {
  BREAK: "BREAK",
  Baby: "Baby",
  Basic: "Basic",
  EX: "EX",
  GX: "GX",
  "Goldenrod Game Corner": "Goldenrod Game Corner",
  Item: "Item",
  LEGEND: "LEGEND",
  "Level-Up": "Level-Up",
  MEGA: "MEGA",
  "Pokémon Tool": "Pokémon Tool",
  "Pokémon Tool F": "Pokémon Tool F",
  "Rapid Strike": "Rapid Strike",
  Restored: "Restored",
  "Rocket's Secret Machine": "Rocket's Secret Machine",
  "Single Strike": "Single Strike",
  Special: "Special",
  Stadium: "Stadium",
  "Stage 1": "Stage 1",
  "Stage 2": "Stage 2",
  Supporter: "Supporter",
  "TAG TEAM": "TAG TEAM",
  "Technical Machine": "Technical Machine",
  V: "V",
  VMAX: "VMAX",
};

function Filter({
  checkedTypes,
  setCheckedTypes,
  checkedSubtypes,
  setCheckedSubtypes,
  hpValue,
  setHpValue,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = open ? "hidden" : "auto";
      document.getElementById("collapse-card-special").style.overflow = open
        ? "auto"
        : "hidden";
    };
    handleBodyOverflow();
  }, [open]);

  const handleTypesChange = (event) => {
    setCheckedTypes({
      ...checkedTypes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubtypesChange = (event) => {
    setCheckedSubtypes({
      ...checkedSubtypes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleHpChange = (event) => {
    setHpValue(event.target.value);
  };

  const clearChecks = () => {
    const updatedCheckedTypes = {};
    const updatedCheckedSubtypes = {};

    for (const type in checkedTypes) {
      updatedCheckedTypes[type] = false;
    }

    for (const type in checkedSubtypes) {
      updatedCheckedSubtypes[type] = false;
    }

    setCheckedTypes(updatedCheckedTypes);
    setCheckedSubtypes(updatedCheckedSubtypes);
  };

  const handleSeeResultsButtonClicked = () => {
    setOpen(false);
  };

  return (
    <>
      <Container>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          variant="light filter"
        >
          {open ? <MuiIcon.CloseIcon /> : <MuiIcon.TuneIcon />}
        </Button>
      </Container>

      <Container>
        <Collapse in={open}>
          <Form>
            <Card
              body
              style={{
                color: "#eeebe6",
                fontSize: "18px",
                backgroundColor: "#292a30",
                border: "none",
              }}
              id="collapse-card-special"
            >
              <Row>
                <Form.Label>
                  <Row>
                    <Col xs={12} md={3}>
                      <h6>Filter by type</h6>
                    </Col>

                    {window.innerWidth > 576 ? (
                      <>
                        <Col xs={12} md={3}></Col>
                        <Col md={3}>
                          <h6>Filter by subtype</h6>
                        </Col>
                      </>
                    ) : null}
                  </Row>
                </Form.Label>
                <Col xs={6} md={3}>
                  {Object.entries(typesWithIcon)
                    .slice(0, 6)
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={`checkbox-${key}`}
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={value.img}
                              alt={""}
                              style={{ width: "20px", marginRight: "10px" }}
                            />
                            {value.name}
                          </div>
                        }
                        name={key}
                        checked={checkedTypes[key] || false}
                        onChange={handleTypesChange}
                      />
                    ))}
                </Col>
                <Col xs={6} md={3}>
                  {Object.entries(typesWithIcon)
                    .slice(6)
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={`checkbox-${key}`}
                        label={
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <img
                              src={value.img}
                              alt={""}
                              style={{ width: "20px", marginRight: "10px" }}
                            />
                            {value.name}
                          </div>
                        }
                        name={key}
                        checked={checkedTypes[key] || false}
                        onChange={handleTypesChange}
                      />
                    ))}
                </Col>

                {window.innerWidth < 576 ? (
                  <>
                    <Row style={{ marginTop: "25px" }}>
                      <h6>Filter by subtype</h6>
                    </Row>
                  </>
                ) : null}

                <Col xs={6} md={3}>
                  {Object.entries(subTypes)
                    .slice(0, 13)
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={`checkbox-${key}`}
                        label={value}
                        name={key}
                        checked={checkedSubtypes[key] || false}
                        onChange={handleSubtypesChange}
                      />
                    ))}
                </Col>

                <Col xs={6} md={3}>
                  {Object.entries(subTypes)
                    .slice(13)
                    .map(([key, value]) => (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={`checkbox-${key}`}
                        label={value}
                        name={key}
                        checked={checkedSubtypes[key] || false}
                        onChange={handleSubtypesChange}
                      />
                    ))}
                </Col>
              </Row>
              <Button className="button clear-button" onClick={clearChecks}>
                Clear All
              </Button>

              <Row>
                <Form.Label style={{ marginTop: "10px" }}>
                  <h6>
                    Filter by HP
                    {hpValue >= 150
                      ? ", max HP: 150+"
                      : hpValue <= 0
                      ? null
                      : `, max HP: ${hpValue}`}
                  </h6>
                </Form.Label>
              </Row>
              <Row style={{ marginLeft: "1px" }}>
                <Form.Range
                  value={hpValue}
                  onChange={handleHpChange}
                  min={0}
                  max={150}
                  step={10}
                />
              </Row>

              <Col
                className="d-flex justify-content-end"
                id="temp-fix-for-filter-menu"
              >
                <Button
                  className="button num-results-button"
                  id="res-length-btn"
                  style={{ display: "none" }}
                  onClick={handleSeeResultsButtonClicked}
                >
                  <span id="length-id"></span>
                </Button>
              </Col>
            </Card>
          </Form>
        </Collapse>
      </Container>
    </>
  );
}

export default Filter;
