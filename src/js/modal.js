const modalContent = document.querySelector('.modal-content');
const modalBackdrop = document.querySelector('.modal-backdrop')
const closeBtn = document.querySelector('.btn-modal-close')

export function toggleModal() {
    modalBackdrop.classList.toggle('is-hidden');
}

closeBtn.addEventListener('click', toggleModal)
modalBackdrop.addEventListener('click', e => {
        if (e.target === e.currentTarget) toggleModal();
});

export function renderModal(event) {

  const img =
    event.images.find(img => img.ratio === '4_3') ||
    event.images.find(img => img.ratio === '3_2') ||
    event.images[0];

  return modalContent.innerHTML = 
   `<div class="modal-img-box">
      <img class="modal-img" src="${img.url}" alt="${event.name}">
    </div>

    <div class="modal-left-img">
      <img class="modal-img" src="${img.url}" alt="${event.name}">
    </div>

    <div class="modal-right-info">
      <ul class="modal-event-info">
        <li class="modal-event-name">
          <h2 class="modal-event-name">Info:</h2>
          <p>${event.name}</p>
        </li>
        <li class="modal-event-name">
          <h2 class="modal-event-name">When:</h2>
          <p>${event.dates.start.localDate}</p>
        </li>
        <li class="modal-event-name">
          <h2 class="modal-event-name">Where:</h2>
          <p>${event._embedded.venues[0].name}</p>
        </li>
        <li class="modal-event-name">
          <h2 class="modal-event-name">Who:</h2>
          <p>${event.name}</p>
        </li>
        <li class="modal-event-name">
          <h2 class="modal-event-name">Price:</h2>
          <ul class="modal-price-list">
            <li class="modal-price-item">
              <p>Standart $${event.priceRanges ? event.priceRanges[0].min : 'N/A'} UAH</p>
              <button class="btn-buy-tickets">Buy tickets</button>
            </li>
            <li class="modal-price-item">
              <p>VIP $${event.priceRanges ? event.priceRanges[0].max : 'N/A'} UAH</p>
              <button class="btn-buy-tickets">Buy tickets</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>`
}