const express = require('express')
const app = express()
const path = require('path')
const request = require('request')
const router = express.Router()
const port = process.env.PORT || 3000
const yelp = require('yelp-fusion')
const client = yelp.client('1CGB21Re-F3nO-8EFrdwEpHbD3OdrUT-fr6UIVsOEa_KsBEGMuHNCDpvNgqdHgTuUzQxr21ZjTlKH57UCXuSAEb09eHvxDhVO-N39m-dn-EkpUYfQH93gR3ZEVPfXHYx')

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))

app.use(express.static('public'))

app.use(express.json())

app.listen(port, () => console.log(`Server running on port ${port}`))

app.post('/', (req, res) => {
  let searchCategories
  let longitude = req.body.long
  let latitude = req.body.lat 


  client.search({
    categories: req.body.filters.join(),
    longitude: req.body.long,
    latitude: req.body.lat,
    radius: 8046,
    limit: 50
  })
  .then(results => {
    console.log('Full Results: ', results.jsonBody.businesses.map(item => item.name))
    let max = results.jsonBody.businesses.length
    let random = Math.floor(Math.random() * max)
    console.log(results.jsonBody.businesses[random].name);
    res.send({
      random: results.jsonBody.businesses[random]
    })
  })
  .catch(e => {
    console.log(e);
  })
})