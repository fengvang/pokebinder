import React, { useState, useEffect } from "react";
import { Row, Form, Col, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import * as MuiIcon from "./MuiIcons";

const types = {
  Colorless: "Colorless",
  Darkness: "Darkness",
  Dragon: "Dragon",
  Fairy: "Fairy",
  Fighting: "Fighting",
  Fire: "Fire",
  Grass: "Grass",
  Lightning: "Lightning",
  Metal: "Metal",
  Psychic: "Psychic",
  Water: "Water",
};

function Filter({ checkedTypes, setCheckedTypes, hpValue, setHpValue }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = isDropdownOpen ? "hidden" : "auto";
    };
    handleBodyOverflow();
  }, [isDropdownOpen]);

  const handleCheckboxChange = (event) => {
    setCheckedTypes({
      ...checkedTypes,
      [event.target.name]: event.target.checked,
    });
  };

  const handleHpChange = (event) => {
    setHpValue(event.target.value);
  };

  const clearChecks = () => {
    const updatedCheckedTypes = {};
    for (const type in checkedTypes) {
      updatedCheckedTypes[type] = false;
    }
    setCheckedTypes(updatedCheckedTypes);
  };

  const handleSeeResultsButtonClicked = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <Row>
        <DropdownButton
          title={<MuiIcon.TuneIcon />}
          size="sm"
          variant="light mobile-filter"
          className="no-caret"
          show={isDropdownOpen}
          onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
        >
          <Form className="my-3">
            <Form.Label>
              <h6>Filter by type</h6>
            </Form.Label>
            <Row>
              <Col xs={6}>
                {Object.entries(types)
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <Form.Check
                      key={key}
                      type="checkbox"
                      id={`checkbox-${key}`}
                      label={value}
                      name={key}
                      checked={checkedTypes[key] || false}
                      onChange={handleCheckboxChange}
                    />
                  ))}
              </Col>
              <Col xs={6}>
                {Object.entries(types)
                  .slice(6)
                  .map(([key, value]) => (
                    <Form.Check
                      key={key}
                      type="checkbox"
                      id={`checkbox-${key}`}
                      label={value}
                      name={key}
                      checked={checkedTypes[key] || false}
                      onChange={handleCheckboxChange}
                    />
                  ))}
              </Col>
            </Row>
            <Col className="d-flex justify-content-end">
              <Button className="button clear-button" onClick={clearChecks}>
                Clear All
              </Button>
            </Col>

            <Form.Label style={{ marginTop: "10px" }}>
              <h6>
                Filter by HP, max HP:
                {hpValue >= 150 ? " 150+" : ` ${hpValue}`}
              </h6>
            </Form.Label>
            <Form.Range
              value={hpValue}
              onChange={handleHpChange}
              min={0}
              max={150}
              step={10}
            />

            <Col className="d-flex justify-content-end">
              <Button
                className="button num-results-button"
                id="res-length-btn"
                style={{ display: "none" }}
                onClick={handleSeeResultsButtonClicked}
              >
                <span id="length-id"></span>
              </Button>
            </Col>
          </Form>
        </DropdownButton>
      </Row>

      {/* web only filter */}
      <Form className="my-3 filter-form main-filter">
        <Form.Label>
          <h6>Filter by type</h6>
        </Form.Label>
        {Object.entries(types).map(([key, value]) => (
          <Form.Check
            key={key}
            type="checkbox"
            id={`checkbox-${key}`}
            label={value}
            name={key}
            checked={checkedTypes[key] || false}
            onChange={handleCheckboxChange}
          />
        ))}

        <Button className="button clear-button" onClick={clearChecks}>
          Clear All
        </Button>

        <Form.Label style={{ marginTop: "10px" }}>
          <h6>
            Filter by HP, max HP:
            {hpValue >= 150 ? " 150+" : ` ${hpValue}`}
          </h6>
        </Form.Label>
        <Form.Range
          value={hpValue}
          onChange={handleHpChange}
          min={0}
          max={150}
          step={10}
        />
      </Form>
    </>
  );
}

export default Filter;
