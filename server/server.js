require("dotenv").config();

const express = require("express");
const app = express();
const pokemon = require("pokemontcgsdk");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));
pokemon.configure({ apiKey: process.env.REACT_APP_POKEMON_TCG_API_KEY });

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
      console.log("calling first if");
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
      console.log("calling second if");
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
      console.log("calling last if");
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

// app.post("/filter-data", async (req, res) => {
//   try {
//     console.log("Filtering from server");
//     const setID = req.body.query.setID;
//     const page = req.body.query.page;
//     const pageSize = req.body.query.pageSize;
//     const types =
//       JSON.parse(req.body.query.types) !== null
//         ? JSON.parse(req.body.query.types)
//         : null;
//     const subtypes = req.body.query.subtypes;

//     let typesQuery = "";
//     let query = "";

//     if (types === null || undefined) {
//       query = `set.id:${setID}`;
//     } else {
//       if (types?.length > 1) {
//         for (let i = 0; i < types?.length; ++i) {
//           typesQuery += `types:${types[i].toLowerCase()}`;
//           if (i < types?.length - 1) {
//             typesQuery += " or ";
//           }
//         }
//       } else typesQuery = `types:${types[0].toLowerCase()}`;
//       query = `set.id:${setID} (${typesQuery})`;
//     }

//     console.log(query);

//     const data = await pokemon.card.where({
//       q: query,
//       orderBy: "number",
//       page: page,
//       pageSize: pageSize,
//     });

//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Auth0 API
// app.patch("/change-user-image", async (req, res) => {
//   try {
//     const userID = req.body.userID;
//     const imageURL = req.body.image;
//     const url = process.env.REACT_APP_AUTH0_API_URL + `${userID}`;

//     // get the current user metadata
//     const getUserMetadata = {
//       method: "GET",
//       url: url,
//       headers: {
//         authorization: "Bearer " + process.env.REACT_APP_AUTH0_MGMT_API_TOKEN,
//         "content-type": "application/json",
//       },
//     };

//     const currentUserData = await axios.request(getUserMetadata);
//     const oldImageURL = currentUserData?.data?.user_metadata?.picture;

//     // update the user metadata with the new picture URL
//     const updateUserMetadata = {
//       method: "PATCH",
//       url: url,
//       headers: {
//         authorization: "Bearer " + process.env.REACT_APP_AUTH0_MGMT_API_TOKEN,
//         "content-type": "application/json",
//       },
//       data: {
//         user_metadata: {
//           picture: imageURL,
//         },
//       },
//     };

//     const updatedUserData = await axios.request(updateUserMetadata);
//     const newImageURL = updatedUserData.data.user_metadata.picture;

//     res.json({ oldImageURL, newImageURL });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Auth0 API
// app.patch("/change-username", async (req, res) => {
//   try {
//     const userID = req.body.userID;
//     const newDisplayName = req.body.username;
//     const url = process.env.REACT_APP_AUTH0_API_URL + `${userID}`;

//     // update the user metadata
//     const options = {
//       method: "PATCH",
//       url: url,
//       headers: {
//         authorization: "Bearer " + process.env.REACT_APP_AUTH0_MGMT_API_TOKEN,
//         "content-type": "application/json",
//       },
//       data: {
//         user_metadata: {
//           displayName: newDisplayName,
//         },
//       },
//     };

//     axios
//       .request(options)
//       .then(function (response) {
//         console.log(response);
//       })
//       .catch(function (error) {
//         console.error(error);
//       });
//   } catch (error) {
//     console.log(error);
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
