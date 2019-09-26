//EXPRESS BOILERPLATE
const express = require('express')
const app = express()
const path = require('path')

//DYNAMIC PORT
const port = process.env.PORT || 3000

//YELP FUSION FOR NODE JS
const yelp = require('yelp-fusion')
const client = yelp.client(process.env.yelpAPI)

//MIDDLEWARE
app.use(express.static('public'))
app.use(express.json())

//ROUTES
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))

app.post('/', (req, res) => {
  console.log(req.body)
  
  //YELP API CALL
  client.search({
    categories: req.body.filters.length === 0 ? "restaurants" : req.body.filters.join(),
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    radius: 8046,
    limit: 50,
    radius: 16000,
    price: req.body.priceRange
  })
  .then(results => {
    //DECLARATIONS FOR RANDOM CHOOSER
    let max = results.jsonBody.businesses.length
    let random = Math.floor(Math.random() * max)

    //LOGGING RESULTS 
    console.log('Full Results: ', results.jsonBody.businesses.map(item => item.name))

    //SEND RANDOM BUSINESS
    res.send({
      random: results.jsonBody.businesses[random]
    })

  })
  .catch(e => {
    console.log(e);
  })
})

//START SERVER
app.listen(port, () => console.log(`Server running on port ${port}`))