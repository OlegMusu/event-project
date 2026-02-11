import countries from './countries.json'

import { toggleModal, renderModal } from './js/modal';

const helperBlock = document.querySelector('.search-helper');

const inputCountries = document.querySelector('.input-countries');
const btnOpenCountries = document.querySelector('.btn-arrow-down');
const countriesBlock = document.querySelector('.countries-block');
const btnLoad = document.querySelector('.btn-load');
const searchInp = document.querySelector('.header-search');
const searchBtn = document.querySelector('.search-btn');

const eventContainer = document.querySelector('.event-container');

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const API_KEY = 'UqmVwuGncTrUR5qhai7UAAi3449oMNGt';
let pageLimit = 20;
let page = 0;

let allEvents = [];

// Код для пошуку через країни

function handleBtnClick() {
    countriesBlock.classList.toggle('is-open');
    if (!countriesBlock.classList.contains('is-open')) return; 
    countriesBlock.innerHTML = '';
    countries.forEach(country => {
        const countryItem = document.createElement('div');
        countryItem.textContent = country.name;
        countryItem.classList.add('country-item');

        countryItem.addEventListener('click', () => {
            inputCountries.value = country.name;
            handleCountrySelect(country.name);
            countriesBlock.classList.remove('is-open');
        });
        countriesBlock.appendChild(countryItem);
    });
};

btnOpenCountries.addEventListener('click', handleBtnClick);

// Перевіряє чи схожі назви країни
function handleCountrySelect(countryName) {
    const filltered = allEvents.filter(event => {
        const eventCountry = event._embedded?.venues?.[0]?.country?.name;
        return eventCountry === countryName;
    });
    
    if (filltered.length > 0) {
        renderEvents(filltered);
    }else {
        renderEmpty();
    }
};

import emptyImg from './images/event-empty-img.png';

function renderEmpty() {
    eventContainer.innerHTML = `
    <li class="event-empty">
        <img class="event-empty-img" alt="event empty img" src="${emptyImg}"/>
        <h2 class="event-empty-text">Noting found</h2>
    </li>
    `;
}

// input country
inputCountries.addEventListener('input', () => {
    const value = inputCountries.value.toLowerCase().trim();
    countriesBlock.innerHTML = '';
    if (!value) {
        countriesBlock.classList.remove('is-open');
        return;
    }
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(value)
    );
    if (!filteredCountries.length) {
        countriesBlock.classList.remove('is-open')
        return;
    }
    countriesBlock.classList.add('is-open');
    filteredCountries.forEach(country => {
        const div = document.createElement('div')
        div.textContent = country.name;
        div.classList.add('country-item')
        div.addEventListener('click', () => {
            inputCountries.value = country.name;
            handleCountrySelect(country.name)
            countriesBlock.classList.remove('is-open');
        });
        countriesBlock.appendChild(div);
    });
});

// Кнопка search

searchBtn.addEventListener('click', () => {
    const value = searchInp.value.toLowerCase().trim();
    if (!value) {
        renderEvents(allEvents);
        return;
    }
    const filtered = allEvents.filter(event =>
        event.name.toLowerCase().includes(value)
    );
    if (!filtered.length) {
        renderEmpty();
        return;
    }
    renderEvents(filtered)
});

// Вспливучі підказки при вводі назви концерту
searchInp.addEventListener('input', () => {
    const value = searchInp.value.toLowerCase().trim();
    helperBlock.innerHTML = '';
    if (!value) {
        helperBlock.classList.remove('is-open');
        return;
    }
    const machedEvents = allEvents.filter(event =>
        event.name.toLowerCase().includes(value)
    );
    if (!machedEvents.length) {
        helperBlock.classList.remove('is-open')
        return;
    }
    helperBlock.classList.add('is-open');
    machedEvents.forEach(event => {
        const item = document.createElement('div')
        item.textContent = event.name;
        item.classList.add('search-item')
        item.addEventListener('click', () => {
            searchInp.value = event.name;
            renderEvents([event]);
            helperBlock.classList.remove('is-open');
        });
        helperBlock.appendChild(item);
    });
});

async function getEvents() {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&classificationName=music&page-size=${pageLimit}&page=${page}&source=universe`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return[];
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

        return `<li class="event-item" data-id="${event.id}">
        <div class="event-img-decorate">
            <div class="event-img-box">
                <img class="event-img" alt="event-img" src="${imgUrl}">
            </div>
            <p class="event-name">${event.name}</p>
            <p class="event-date">${event.dates.start.localDate}</p>
            <div class="event-place-box">
                <div class="vector-place"></div>
                <p class="event-place">${event._embedded.venues[0].country.name}</p>
            </div>
        </div>
        </li>`
    }).join('')
    eventContainer.innerHTML = markap
}

const loadMore = () => {
    page +- 1;
    getEvents();
}

btnLoad.addEventListener("click", loadMore)

async function getEventById(id) {
    try {
        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const event = await response.json()
        return event
    }
    catch(error) {
        console.error(error)
    }
}

// modal
eventContainer.addEventListener('click', async (e) => {
    const card = e.target.closest('.event-item');
    if (!card) return;
    const eventId = card.dataset.id
    try {
        const event = await getEventById(eventId)
        renderModal(event);
        toggleModal();
    } 
    catch(error) {
        console.error(error)
    }
})

async function startApp() {
    const data = await getEvents();
    if (!data?._embedded?.events) {
        renderEmpty();
        return;
    }
    allEvents = data._embedded.events;
    renderEvents(allEvents);
}

startApp();