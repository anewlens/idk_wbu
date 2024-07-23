const apiCall = async (latitude, longitude, filters, priceRange) => {
  const data = {
    latitude,
    longitude,
    filters: filters,
    priceRange: [priceRange()],
  };

  return await fetch("/", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "same-origin", // send cookies
    credentials: "include", // send cookies, even in CORS
  }).then((res) => res.json());
};

export default apiCall;
