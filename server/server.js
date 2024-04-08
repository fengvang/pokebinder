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
    const pokemonName = req.body.query.name;
    let pokemonSubtype = req.body.query.subtype;
    const page = req.body.query.page;
    const pageSize = req.body.query.pageSize;
    const promises = [];
    const pokemonData = {};

    if (pokemonSubtype === "All") pokemonSubtype = "";

    if (pokemonName !== "" && pokemonSubtype !== "") {
      promises.push(
        pokemon.card
          .where({
            q: `name:${pokemonName} subtypes:${pokemonSubtype}`,
            page: page,
            pageSize: pageSize,
          })
          .then((result) => {
            Object.entries(result).forEach(([key, value]) => {
              pokemonData[key] = value;
            });
          })
      );
    } else if (pokemonName === "" && pokemonSubtype !== "") {
      promises.push(
        pokemon.card
          .where({
            q: `subtypes:${pokemonSubtype}`,
            page: page,
            pageSize: pageSize,
          })
          .then((result) => {
            Object.entries(result).forEach(([key, value]) => {
              pokemonData[key] = value;
            });
          })
      );
    } else {
      promises.push(
        pokemon.card
          .where({
            q: `name:${pokemonName}`,
            page: page,
            pageSize: pageSize,
          })
          .then((result) => {
            Object.entries(result).forEach(([key, value]) => {
              pokemonData[key] = value;
            });
          })
      );
    }

    await Promise.all(promises);

    res.json(pokemonData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// re-write
app.post("/search-set", async (req, res) => {
  try {
    const pokemonName = req.body.query.name;
    const set = req.body.query.set;
    const promises = [];
    const pokemonData = {};
    const filteredPokemonSetData = {};

    // get Pokemon by name and set
    if (pokemonName !== "") {
      promises.push(
        pokemon.card
          .where({
            q: `name:${pokemonName}`,
          })
          .then((result) => {
            Object.entries(result).forEach(([key, value]) => {
              pokemonData[key] = value;
            });

            Object.entries(pokemonData).forEach(([key, value]) => {
              if (Array.isArray(value)) {
                value.forEach((pokemon) => {
                  if (pokemon.set.name === set) {
                    if (!filteredPokemonSetData[key]) {
                      filteredPokemonSetData[key] = [];
                    }
                    filteredPokemonSetData[key].push(pokemon);
                  }
                });
              }
            });
          })
      );
    }

    await Promise.all(promises);
    res.json(filteredPokemonSetData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/get-sets", async (req, res) => {
  try {
    const data = await pokemon.set.all({
      orderBy: "-releaseDate",
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/get-set-data", async (req, res) => {
  try {
    const setID = req.body.query.setID;
    const page = req.body.query.page;
    const pageSize = req.body.query.pageSize;

    const data = await pokemon.card.where({
      q: `set.id:${setID}`,
      orderBy: "number",
      page: page,
      pageSize: pageSize,
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// https://api.pokemontcg.io/v2/cards?q=set.id:sv3pt5%20supertype:Pokémon%20name:Charizard

// pokemon.card
//   .where({
//     q: `set.id:sv3pt5 supertype:Pokémon (types:Colorless)`,
//     orderBy: "number",
//     page: 1,
//     pageSize: 16,
//   })
//   .then((result) => {
//     console.log(result);
//   });

// pokemon.card
//   .where({ q: "set.id:sv3pt5", orderBy: "number", page: 1, pageSize: 16 })
//   .then((result) => {
//     console.log(result);
//   });

// pokemon.set.all({ orderBy: "-releaseDate" }).then((result) => {
//   console.log(result[0].name);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
