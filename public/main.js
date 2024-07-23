import apiCall from "./modules/apiCall.js";

const filters = document.querySelectorAll(".option");
const priceFilters = document.querySelectorAll(".dollar");
const errorMessage = document.querySelector("#errorMessage");
const activateBtn = document.querySelector("#activateBtn");

// LOCATION
let longitude;
let latitude;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;
    },
    (err) => {
      errorMessage.classList.add("reveal");
      console.log(err);
    }
  );
}

// EVENT LISTENERS
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
  });
});

priceFilters.forEach((btn, btnI) => {
  btn.addEventListener("click", () => {
    const priceContainer = document.querySelector("#priceContainer");

    priceFilters.forEach((e, i) => {
      if (i < btnI && !e.classList.contains("priceSelected")) {
        e.classList.toggle("priceSelected");
      } else if (i === btnI && !e.classList.contains("priceSelected")) {
        e.classList.toggle("priceSelected");
      } else if (i > btnI && e.classList.contains("priceSelected")) {
        e.classList.toggle("priceSelected");
      }
    });
    priceContainer.classList.replace(
      priceContainer.classList.item(0),
      `dollars${btnI + 1}`
    );
  });
});

activateBtn.addEventListener("click", async () => {
  try {
    const chosenFilters = [
      ...document.querySelectorAll(".active").values(),
    ].map((filter) => filter.value);
    const maxPrice = document.querySelectorAll(".priceSelected").length;
    const priceRange = () =>
      Array.apply(null, { length: maxPrice })
        .map((e, i) => i + 1)
        .join(", ");

    await apiCall(latitude, longitude, chosenFilters, priceRange)
      //DOM ASSIGNMENTS
      .then(async (result) => {
        console.log(`result: ${JSON.stringify(result)}`);
        const resultTitle = document.querySelector("#resultTitle");
        const resultBlock = document.querySelector("#resultBlock");
        const yelpLink = document.querySelector("#yelpLink");
        const resultLocation = document.querySelector("#resultLocation");

        if (!result) {
          resultTitle.innerHTML = "Nothing matches that search! :(";
        } else if (!resultBlock.classList.contains("reveal")) {
          resultTitle.innerHTML = result.poi.name;
          resultBlock.classList.toggle("reveal");
        } else {
          await resultBlock.classList.toggle("disappear");
          setTimeout(() => {
            resultTitle.innerHTML = result.poi.name;
            resultBlock.classList.toggle("disappear");
          }, 700);
        }

        yelpLink.setAttribute(
          "href",
          result.poi.url
            ? `https://${result.poi.url}`
            : `https://www.google.com/search?&q=${result.poi.name.replace(
                " ",
                "+"
              )}`
        );
        resultLocation.setAttribute(
          "href",
          `https://www.google.com/maps/search/${result.poi.name.replace(
            " ",
            "+"
          )}/@${latitude},${longitude},14z`
        );
      });
  } catch (err) {
    console.log("error", err);
  }
});
