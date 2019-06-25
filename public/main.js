//GRABBING DOM ELEMENTS
const filters = document.querySelectorAll('.option')
const priceFilters = document.querySelectorAll('.dollar')
const priceContainer = document.querySelector('.priceFilter')
const activateBtn = document.getElementById('activate')
const answerBlock = document.querySelector('.resultBlock')
const answerName = document.querySelector('.result');
const answerSite = document.querySelector('.resultSite')
const answerLocation = document.querySelector('.resultLocation')
const maxPrice = () => document.querySelectorAll('.priceSelected').length

//FILTERS SETUP
let chosenFilters = []
const priceRange = () => Array.apply(null, {length: maxPrice()})
                        .map((e, i) => i+1)
                        .join(', ')

//LOCATION SETUPS
let longitude
let latitude

//RESULTS SETUPS
let resultName
let resultLat
let resultLong
let resultSite

//GET USER LOCATION
navigator.geolocation
.getCurrentPosition(position => {
    longitude = position.coords.longitude
    latitude = position.coords.latitude
})

//DEFINE CHOSEN FILTERS
filters.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active')
        chosenFilters = [...document.querySelectorAll('.active').values()].map(filter => filter.value)
    })
})

priceFilters.forEach((btn, btnI) => {
    btn.addEventListener('click', async () => {
        await priceFilters.forEach((e, i) => {
            if (i < btnI && !e.classList.contains('priceSelected')) {
                e.classList.toggle('priceSelected')
            } else if (i === btnI && !e.classList.contains('priceSelected')) {
                e.classList.toggle('priceSelected')
            } else if (i > btnI && e.classList.contains('priceSelected')) {
                e.classList.toggle('priceSelected')
            }
        })
        priceContainer.classList.replace(priceContainer.classList.item(1), `dollars${btnI + 1}`)

    })
})

activateBtn.addEventListener('click', () => {
    let data = {
        lat: latitude,
        long: longitude,
        filters: [...chosenFilters],
        priceRange: priceRange()
    }

    //SERVER CALL
    fetch('/', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'same-origin', // send cookies
        credentials: 'include',     // send cookies, even in CORS
    })
    //READ RESULTS
    .then(res => {
        console.log('pre-res:', res)
        res.json()
        //SET VARIABLES
        .then(result => {
            console.log('result', result)
            resultName = !result.random ? 'Nothing matches that search! :(' : result.random.name
            resultSite = !result.random ? 'https://yelp.com' : result.random.url
        })
        //DOM ASSIGNMENTS 
        .then(() => {
            !resultName
            ? answerName.innerHTML = 'Nothing matches that search! :('
            : answerName.innerHTML = resultName
            answerSite.setAttribute('href', resultSite)
            answerLocation.setAttribute('href', `https://www.google.com/maps/search/${resultName.replace(' ','+')}/@${latitude},${longitude},14z`)
        })
    })
    //RESULTS REVEAL
    .then(() => {
        answerBlock.classList.add('reveal')
    })
    .catch(err => console.log(err))
})
