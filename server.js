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
  
  //YELP API CALL
  client.search({
    categories: req.body.filters.join(),
    longitude: req.body.long,
    latitude: req.body.lat,
    radius: 8046,
    limit: 50
  })
  .then(results => {

    //LOGGING RESULTS 
    console.log('Full Results: ', results.jsonBody.businesses.map(item => item.name))
    console.log(results.jsonBody.businesses[random].name);

    //DECLARATIONS FOR RANDOM CHOOSER
    let max = results.jsonBody.businesses.length
    let random = Math.floor(Math.random() * max)

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
