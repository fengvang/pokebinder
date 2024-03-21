import React, { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";

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

function Filter({ checkedTypes, setCheckedTypes }) {
  const [hpValue, setHpValue] = useState(0);

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

  return (
    <>
      <Row>
        <DropdownButton
          title={<i className="bi bi-funnel"></i>}
          size="sm"
          variant="light mobile-filter"
          className="no-caret"
        >
          <Form className="my-3">
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

            <Row>
              <Button className="button clear-button" onClick={clearChecks}>
                Clear All
              </Button>
            </Row>

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
        </DropdownButton>
      </Row>

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
