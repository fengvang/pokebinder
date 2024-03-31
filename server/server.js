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
    const pokemonSubtype = req.body.query.subtype;
    const page = req.body.query.page;
    const pageSize = req.body.query.pageSize;
    const promises = [];
    const pokemonData = {};

    if (pokemonSubtype === "All") pokemonSubtype = "";

    if (pokemonSubtype !== "") {
      promises.push(
        pokemon.card
          .where({
            q: `name:${pokemonName} subtypes:${pokemonSubtype}`,
            pageSize: 16,
            page: page,
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
    console.log(pokemonData);
    res.json(pokemonData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.post("/get-series", async (req, res) => {
  try {
    const series = req.body;
    const promises = [];
    const data = {};

    Object.entries(series).forEach(([key, value]) => {
      value.forEach((seriesName) => {
        data[seriesName] = {};
        promises.push(
          pokemon.set.all().then((sets) => {
            Object.entries(sets).forEach(([i, set]) => {
              if (seriesName === set.series) {
                data[seriesName][set.name] = {};
              }
              if (seriesName === set.series) {
                data[seriesName][set.name] = set.images.logo;
              }
            });
          })
        );
      });
    });

    await Promise.all(promises);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all sets
// pokemon.set.all().then((sets) => {
//   Object.entries(sets).forEach(([key, value]) => {
//     console.log(value.name);
//   });
// });

// pokemon.card
//   .all({ q: "name:charizard (subtypes:vmax OR subtypes:tera)" })
//   .then((result) => {
//     console.log(result);
//   });

// app.post("/filter-by-subtypes", async (req, res) => {
//   try {
//     const subtypeObj = req.body.query;
//     const promises = [];
//     const subtypeCardList = {};

//     for (const subtype of subtypeObj) {
//       promises.push(
//         pokemon.card.where({ q: `subtypes:${subtype}` }).then((result) => {
//           Object.entries(result).forEach(([key, value]) => {
//             subtypeCardList[key] = value;
//           });

//           // delete subtype to prevent duplication
//           delete subtypeObj[subtype];
//         })
//       );
//     }

//     await Promise.all(promises);

//     res.json(subtypeCardList);
//   } catch (error) {}
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
