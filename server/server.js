require("dotenv").config();

const express = require("express");
const app = express();
const pokemon = require("pokemontcgsdk");

app.use(express.json());
app.use(express.static("public"));
pokemon.configure({ apiKey: process.env.POKEMON_TCG_API_KEY });

app.listen(5000);
