const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Load JSON data
const data = JSON.parse(fs.readFileSync("combinationDataEnglish.json", "utf-8"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { results: null, mobile: "" });
});

app.post("/process", (req, res) => {
  let mobile = req.body.mobile || "";
  let cleanMobile = mobile.replace(/0/g, ""); // remove zeros

  // Generate 2-digit combinations
  let combinations = [];
  for (let i = 0; i < cleanMobile.length - 1; i++) {
    combinations.push(cleanMobile[i] + cleanMobile[i + 1]);
  }

  // Check for triple same digit
  let triples = [];
  const tripleRegex = /(111|222|333|444|555|666|777|888|999|000)/g;
  let match;
  while ((match = tripleRegex.exec(mobile)) !== null) {
    triples.push(match[0]);
  }

  // Fetch details from JSON
  let results = [];
  combinations.forEach((combo) => {
    if (data[combo]) {
      results.push({ number: combo, ...data[combo] });
    }
  });

  triples.forEach((triple) => {
    if (data[triple]) {
      results.push({ number: triple, ...data[triple] });
    }
  });

  res.render("index", { results, mobile });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
