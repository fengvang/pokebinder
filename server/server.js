require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();
const pokemon = require("pokemontcgsdk");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));
pokemon.configure({ apiKey: process.env.POKEMON_TCG_API_KEY });

app.post("/search-card", async (req, res) => {
  try {
    const [pokemonName, ...subtypeArray] = req.body.query.split(" ");
    const pokemonSubtype = subtypeArray.join(" ");

    let url = process.env.POKEMON_TCG_API_URL + `?q=name:${pokemonName}`;

    if (pokemonSubtype !== "")
      url =
        process.env.POKEMON_TCG_API_URL +
        `?q=name:${pokemonName} subtypes:${pokemonSubtype}`;

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.POKEMON_TCG_API_KEY,
      },
    });

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
