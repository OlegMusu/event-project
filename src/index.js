const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
const API_KEY = 'UqmVwuGncTrUR5qhai7UAAi3449oMNGt';

const eventContainer = document.querySelector('.event-container');

async function getEvents() {
    try {
        const response = await fetch('${BASE_URL}?apikey=${API_KEY}&size=20');
        if (!response.ok) {
            throw new Error('HTTP error! status: ${response.status}');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
    };
};

function renderEvents(events) {
    const markap = events.map((event) => {
        return '<li class="event-item"><p>${event.name}</p></li>'
    }).join('')
    eventContainer.innerHTML = markap
}

async function startApp() {
    const events = await getEvents();
    renderEvents(events._embedded.events);
}

startApp();