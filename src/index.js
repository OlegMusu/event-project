import countries from './countries.json'

const inputCountries = document.querySelector('.input-countries');
const btnOpenCountries = document.querySelector('.btn-arrow-down');
const countriesBlock = document.querySelector('.countries-block');

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const API_KEY = 'UqmVwuGncTrUR5qhai7UAAi3449oMNGt';
const pageLimit = 20;

const eventContainer = document.querySelector('.event-container');

console.log(countries);

function handleBtnClick() {
    countriesBlock.classList.toggle('is-open');
    if (!countriesBlock.classList.contains('is-open')) return; 
    countries.forEach(country => {
        const countryItem = document.createElement('div');
        countryItem.textContent = country.name;
        countryItem.classList.add('country-item');

        countryItem.addEventListener('click', () => {
            inputCountries.value = country.name;
            // Додати код країни
            handleCountrySelect(country.code);
            countriesBlock.classList.remove('is-open');
        });
        countriesBlock.appendChild(countryItem);
    });
};

btnOpenCountries.addEventListener('click', handleBtnClick);

async function getEvents() {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&classificationName=music&page=0&size=${pageLimit}&source=universe`);
        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
    };
}

function getEventImg(event) {
    const img =
        event.images.find(img => img.ratio === '4_3') ||
        event.images.find(img => img.ratio === '3_2') ||
        event.images[0];
        return img.url;
}

function renderEvents(events) {
    const markap = events.map((event) => {

        const imgUrl = getEventImg(event);

        return `<li class="event-item">
        <div class="event-img-box">
            <img class="event-img" alt="event-img" src="${imgUrl}">
        </div>
        <p class="event-name">${event.name}</p>
        <p class="event-date">${event.dates.start.localDate}</p>
        <p class="event-place">${event._embedded.venues[0].name}</p>
        </li>`
    }).join('')
    eventContainer.innerHTML = markap
}

async function startApp() {
    const events = await getEvents();
    console.log(events._embedded.events);
    renderEvents(events._embedded.events);
}

startApp();