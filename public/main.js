import apiCall from './modules/apiCall.js'

const filters = document.querySelectorAll('.option')
const priceFilters = document.querySelectorAll('.dollar')
const maxPrice = document.querySelectorAll('.priceSelected').length


//FILTERS SETUP
let chosenFilters = []
const priceRange = () => 
    Array.apply(null, {length: maxPrice})
        .map((e, i) => i+1)
        .join(', ')

// LOCATION
let longitude
let latitude

if (navigator.geolocation) {
    navigator.geolocation
        .getCurrentPosition(position => {
            longitude = position.coords.longitude
            latitude = position.coords.latitude
        },
        err => {
            errorMessage.classList.add('reveal')
            console.log(err)
        })
}

// EVENT LISTENERS
filters.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active')
        chosenFilters = [...document.querySelectorAll('.active').values()].map(filter => filter.value)
    })
})

priceFilters.forEach((btn, btnI) => {
    btn.addEventListener('click', () => {
        priceFilters.forEach((e, i) => {
            if (i < btnI && !e.classList.contains('priceSelected')) {
                e.classList.toggle('priceSelected')
            } else if (i === btnI && !e.classList.contains('priceSelected')) {
                e.classList.toggle('priceSelected')
            } else if (i > btnI && e.classList.contains('priceSelected')) {
                e.classList.toggle('priceSelected')
            }
        })
        priceContainer.classList.replace(priceContainer.classList.item(0), `dollars${btnI + 1}`)
    })
})

activateBtn.addEventListener('click', async () => {
    try {
        await apiCall(latitude, longitude, chosenFilters, priceRange)
            //DOM ASSIGNMENTS 
            .then(async ({resultName, resultUrl}) => {

                if (!resultName) {
                    resultTitle.innerHTML = 'Nothing matches that search! :('
                } else if (!resultBlock.classList.contains('reveal')) {
                    resultTitle.innerHTML = resultName
                    resultBlock.classList.toggle('reveal')
                } else {
                    await resultBlock.classList.toggle('disappear')
                    setTimeout(() => {
                        resultTitle.innerHTML = resultName
                        resultBlock.classList.toggle('disappear')
                    }, 700);
                }

                yelpLink.setAttribute('href', resultUrl)
                resultLocation.setAttribute('href', `https://www.google.com/maps/search/${resultName.replace(' ','+')}/@${latitude},${longitude},14z`)
            })
    }
    catch(err) {
        console.log('error', err)
    }
})
