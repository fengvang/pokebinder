import { useState } from "react";
import { Form } from "react-bootstrap";

const types = {
  colorless: "Colorless",
  darkness: "Darkness",
  dragon: "Dragon",
  fairy: "Fairy",
  fighting: "Fighting",
  fire: "Fire",
  grass: "Grass",
  lightning: "Lightning",
  metal: "Metal",
  psychic: "Psychic",
  water: "Water",
};

function Filter() {
  const [checkedItems, setCheckedItems] = useState({});
  const [hpValue, setHpValue] = useState(0);

  const handleCheckboxChange = (event) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };

  const handleHpChange = (event) => {
    setHpValue(event.target.value);
  };

  return (
    <>
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
            checked={checkedItems[key] || false}
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
