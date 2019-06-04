const filters = document.querySelectorAll('.option')
const activateBtn = document.getElementById('activate')
const answerBlock = document.querySelector('.resultBlock')
const answerName = document.querySelector('.result');
const answerSite = document.querySelector('.resultSite')
const answerLocation = document.querySelector('.resultLocation')
let chosenFilters = []
let longitude
let latitude
let resultName
let resultLat
let resultLong
let resultSite

navigator.geolocation
.getCurrentPosition(function(position) {
    longitude = position.coords.longitude
    latitude = position.coords.latitude
})

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active')
        chosenFilters = [...document.querySelectorAll('.active').values()].map(filter => filter.value)
    })
})

activateBtn.addEventListener('click', () => {
    let data = {
        lat: latitude,
        long: longitude,
        filters: [...chosenFilters]
    }
    fetch('/', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'same-origin', // send cookies
        credentials: 'include',     // send cookies, even in CORS
    })
    .then(res => {
        console.log('pre-res:', res)
        res.json()
        .then(result => {
            console.log('result', result)
            resultName = result.random.name
            resultSite = result.random.url
        })
        .then(() => {
            answerName.innerHTML = resultName
            answerSite.setAttribute('href', resultSite)
            answerLocation.setAttribute('href', `https://www.google.com/maps/search/${resultName.replace(' ','+')}/@${latitude},${longitude},14z`)
        })
    })
    .then(() => {
        answerBlock.classList.add('reveal')
    })
    .catch(err => console.log(err))
})
