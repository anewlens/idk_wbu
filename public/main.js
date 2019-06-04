const filters = document.querySelectorAll('.option')
const activateBtn = document.getElementById('activate')
const answer = document.getElementById('result')
let chosenFilters = []
let longitude
let latitude
let resultName
let resultAddress

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
        })
        .then(() => {
            answer.innerHTML = resultName
        })
    })
    .then(() => {
        answer.classList.add('reveal')
    })
    .catch(err => console.log(err))
})
