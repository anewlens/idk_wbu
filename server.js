//EXPRESS BOILERPLATE
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

//DYNAMIC PORT
const port = process.env.PORT || 3000;

//TOM TOM API

function endpointBuilder(lon, lat, filters) {
  const categories = [
    { id: 7315003, name: "tradamerican" },
    { id: 9379004, name: "beer_and_wine" },
    { id: 7315012, name: "chinese" },
    { id: 7315015, name: "hotdogs" },
    { id: 7315019, name: "greek" },
    { id: 7315025, name: "italian" },
    { id: 7315078, name: "icecream" },
    { id: 7315033, name: "mexican" },
    { id: 7315036, name: "pizza" },
    { id: 7315148, name: "sushi" },
    { id: 7315043, name: "seafood" },
  ];

  const category = filters
    .map((val) => {
      return categories.find((cat) => cat.name === val).id;
    })
    .join(",");

  return `https://api.tomtom.com/search/2/nearbySearch/.json?key=${
    process.env.YELP_API
  }&lat=${lat}&lon=${lon}&radius=8046&limit=100&categorySet=${
    filters.length === 0 ? "7315" : category
  }`;
}
//MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());

//ROUTES
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/public/index.html"))
);

app.post("/", async (req, res) => {
  console.log(req.body);

  const { filters, longitude, latitude } = req.body;

  // TOM TOM API CALL
  const endpoint = endpointBuilder(longitude, latitude, filters);
  console.log(`endpoint: ${endpoint}`);
  const apiResponse = await fetch(endpoint);
  console.log(`status: ${apiResponse.status}`);
  const json = await apiResponse.json();
  console.log(
    `RESULTS: ${JSON.stringify(json.results.map((item) => item.poi.name))}`
  );
  let max = json.results.length;
  let random = Math.floor(Math.random() * max);
  //SEND RANDOM BUSINESS
  res.send(json.results[random]);
});

//START SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));
