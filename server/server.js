require("dotenv").config();

const express = require("express");
const app = express();
const pokemon = require("pokemontcgsdk");
const { getAuth } = require("firebase-admin/auth");
const { initializeApp, credential } = require("firebase-admin");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));
pokemon.configure({ apiKey: process.env.REACT_APP_POKEMON_TCG_API_KEY });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

app.post("/search-card", async (req, res) => {
  try {
    const pokemonName = req.body.query.name;
    let pokemonSubtype = req.body.query.subtype;
    const page = req.body.query.page;
    const pageSize = req.body.query.pageSize;
    const promises = [];
    let pokemonData = {};

    if (pokemonSubtype === "All") pokemonSubtype = "";

    if (pokemonName !== "" && pokemonName !== null && pokemonSubtype !== "") {
      // console.log("calling first if");
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
    } else if (
      (pokemonName === "" || pokemonName === null) &&
      pokemonSubtype !== ""
    ) {
      // console.log("calling second if");
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
      // console.log("calling last if");
      promises.push(
        pokemon.card
          .where({
            q: `name:"${pokemonName}"`,
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
            q: `name:"${pokemonName}"`,
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

app.get("/get-newest-set", async (req, res) => {
  try {
    const data = await pokemon.set.all({
      orderBy: "-releaseDate",
    });

    res.json(data[0]);
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
    let orderByParams = req.body.query.orderBy || null;

    if (pageSize < 36 && orderByParams === null)
      orderByParams = "-tcgplayer.prices.holofoil";
    else if (orderByParams === null) orderByParams = "number";

    const data = await pokemon.card.where({
      q: `set.id:${setID}`,
      orderBy: orderByParams,
      page: page,
      pageSize: pageSize,
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/get-card-by-id", async (req, res) => {
  try {
    const cardID = req.body.query.id;

    const data = await pokemon.card.find(`${cardID}`);

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/get-custom-token", async (req, res) => {
  try {
    const uid = req.body.uid;

    getAuth()
      .createCustomToken(uid)
      .then((customToken) => {
        // Send token back to client
        res.json(customToken);
      })
      .catch((error) => {
        // console.log("Error creating custom token:", error);
      });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
