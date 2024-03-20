import React, { useState } from "react";
import { Form } from "react-bootstrap";

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

  console.log(hpValue);

  return (
    <>
      <Form className="my-3 filter-form">
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
