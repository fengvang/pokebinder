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
    const promises = [];
    const pokemonData = {};

    if (pokemonSubtype !== "") {
      promises.push(
        pokemon.card
          .where({
            q: `name:${pokemonName} subtypes:${pokemonSubtype}`,
          })
          .then((result) => {
            Object.entries(result).forEach(([key, value]) => {
              pokemonData[key] = value;
            });
          })
      );
    } else {
      promises.push(
        pokemon.card.where({ q: `name:${pokemonName}` }).then((result) => {
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
