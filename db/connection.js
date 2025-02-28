const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

const db = new Pool({
  user: "younes",
  host: "localhost",
  database: "",
  password: String("mysecretword123"), // Explicitly convert to string
  port: 5432,
});

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

module.exports = db;
