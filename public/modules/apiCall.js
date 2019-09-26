const apiCall = async (latitude, longitude, filters, priceRange) => {
    const data = {
        latitude,
        longitude,
        filters: filters,
        priceRange: [priceRange()]
    }

    return await fetch('/', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'same-origin', // send cookies
        credentials: 'include',     // send cookies, even in CORS
    })
    .then(res => res.json())
    .then(res => ({
        resultName: !res.random ? 'Nothing matches that search! :(' : res.random.name,
        resultUrl: !res.random ? 'https://yelp.com' : res.random.url
    }))
}

export default apiCall