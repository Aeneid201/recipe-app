"use strict";

//DOM
const meals__section = document.querySelector(".meals");
const cards__section = document.querySelector(".cards");
const cards = document.querySelectorAll(".card");
const meal__section = document.querySelector(".meal");
const title = document.querySelector(".title");
const back__button = document.querySelector(".back__button");
const search__form = document.querySelector(".search");
const reset__button = document.querySelector(".reset");
const search__title = document.querySelector('[name="your-title"]');
let favorites = [];
if (localStorage.favorites) {
  favorites = JSON.parse(localStorage.favorites);
}

document.addEventListener("DOMContentLoaded", () => {
  getMeals();

  cards__section.addEventListener("click", function (e) {
    let currentCard = e.target.closest(".card");
    let currentCard__id = currentCard.getAttribute("data-id");

    if (e.target.classList.contains("fa-heart")) {
      if (!favorites.includes(currentCard__id)) {
        favorites.push(currentCard__id);
        localStorage.favorites = JSON.stringify(favorites);
        e.target.classList.add("isFav");
      } else {
        // remove from favorites
        //localStorage.favorites = JSON.stringify(favorites);
        e.target.classList.remove("isFav");
      }
    } else {
      getMeal(currentCard__id);
      back__button.classList.remove("d-none");
      meal__section.classList.remove("d-none");
      cards__section.classList.add("d-none");
    }
  });
});

async function getMeals() {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=`
    );
    response.json().then(function (response) {
      for (const meal of response["meals"]) {
        renderMeals(meal);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function searchByName(name) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=`
    );
    response.json().then(function (response) {
      for (const meal of response["meals"]) {
        if (meal["strMeal"].toLowerCase() === name.toLowerCase().trim()) {
          renderMeals(meal);
        }
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

async function getMeal(id) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    response.json().then(function (response) {
      let recipe = response["meals"][0];
      title.textContent = `${recipe["strMeal"]}`;
      renderMeal(recipe);
    });
  } catch (error) {
    console.error(error.message);
  }
}

function renderMeals(obj) {
  let isFav = false;
  let favorites;
  if (localStorage.favorites) {
    favorites = JSON.parse(localStorage.favorites);
    if (favorites.includes(obj["idMeal"])) {
      isFav = true;
    }
  }

  let card = `<div class="card" data-id="${obj["idMeal"]}"><img src="${
    obj["strMealThumb"]
  }">
  <div class="details"><p class="title">${obj["strMeal"]}</p>
  <div class="tags">
  <span class="category">${obj["strCategory"]}</span>
  <span class="favorite" title="Add to favorites"><i class="fa-solid fa-heart ${
    isFav ? "isFav" : ""
  }"></i></span>
  </div>
  </div>
  </div>`;
  cards__section.insertAdjacentHTML("beforeend", card);
}

function renderMeal(obj) {
  let html = `<div class="single-card">
  <div class="img">
      <img src="${obj["strMealThumb"]}" alt="" />
    </div>

    <div class="info">
      
    `;

  for (let i = 1; i <= 20; i++) {
    if (obj[`strIngredient${i}`]) {
      html += `<p><strong>${obj["strIngredient" + i]}</strong> : ${
        obj["strMeasure" + i]
      }</p>`;
    }
  }

  html += `
  <p class="instructions"><strong>Instructions : </strong>${obj["strInstructions"]}</p>
      <p class="video"><strong>Video : </strong><a href="${obj["strYoutube"]}" target="_blank">Click to see video!</a></p>
      <p class="country"><strong>Origin : </strong>${obj["strArea"]}</p>
  </div>
    </div>`;
  meal__section.insertAdjacentHTML("beforeend", html);
}

back__button.addEventListener("click", function (e) {
  meal__section.innerHTML = "";
  this.classList.add("d-none");
  meal__section.classList.add("d-none");
  cards__section.classList.remove("d-none");
  title.textContent = "Browse our recipes";
});

search__form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (search__title.value !== "") {
    cards__section.innerHTML = "";
    searchByName(search__title.value);
  }
});

reset__button.addEventListener("click", function (e) {
  e.preventDefault();
  cards__section.innerHTML = "";
  search__title.value = "";
  getMeals();
});
