import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');

const countryInput = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;
const pureList = null;

countryInput.addEventListener(
  'input',
  debounce(searchACountry, DEBOUNCE_DELAY)
);

function searchACountry() {
  fetchCountries(countryInput.value.trim())
    .then(data => {
      if (data.length === 1) {
        createMarkup(data);
        createAListMarkup(pureList);
      }

      if (data.length >= 2) {
        createAListMarkup(data);
        createMarkup(pureList);
      }

      if (data.length >= 10) {
        createAListMarkup(pureList);
        createMarkup(pureList);
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      createAListMarkup(pureList);
      createMarkup(pureList);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkup(arr) {
  if (arr === pureList) {
    countryInfo.innerHTML = '';
    return;
  }
  const markup = arr
    .map(
      ({ name, capital, population, flags, languages }) => `
      <div class="country-info__block"><img src="${
        flags.svg
      }" alt="Флаг" higth="30" width="100"><h2>${name.official}</h2></div>
        <ul class="country-list">
      <li>Capital: ${capital}</li>
      <li>Population: ${population}</li>
      <li>Languages: ${Object.values(languages)}</li>
    </ul>
      `
    )
    .join('');
  countryInfo.innerHTML = markup;
}

function createAListMarkup(arr) {
  if (arr === pureList) {
    countryList.innerHTML = '';
    return;
  }
  const markup = arr
    .map(
      ({ name, flags }) => `
        <li class="country-list__item">
      <img src="${flags.svg}" alt="Флаг" width="35"> <h2 class="country-list__text">${name.official}</h2>
    </li>
      `
    )
    .join('');
  countryList.innerHTML = markup;
}
