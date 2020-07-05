const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const movieSelect = document.getElementById('movie');
let lastSelectedMovieIndex = movieSelect.selectedIndex;

populateUI();

let ticketPrice = +movieSelect.value;

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  sessionStorage.setItem('selectedMovieIndex', movieIndex);
  sessionStorage.setItem('selectedMoviePrice', moviePrice);
}

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  sessionStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  count.textContent = selectedSeats.length;
  total.textContent = selectedSeats.length * ticketPrice;
}

// Get data from sessionStorage and populate UI
function populateUI() {
  const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats'));
  const selectedMovieIndex = sessionStorage.getItem('selectedMovieIndex');

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }

  const selectedMovie = movieSelect[movieSelect.selectedIndex].getAttribute('data-movie-name');
  const selectedMovieOccupiedSeats = JSON.parse(sessionStorage.getItem(`${selectedMovie}OccupiedSeats`));

  if (selectedMovieOccupiedSeats !== null) {
    seats.forEach((seat, index) => {
      if (selectedMovieOccupiedSeats.indexOf(index) > -1) {
        seat.classList.remove('selected');
        seat.classList.add('occupied');
      }
    });
  } else {
    sessionStorage.setItem('EndGameOccupiedSeats', JSON.stringify([]));
    sessionStorage.setItem('JokerOccupiedSeats', JSON.stringify([]));
    sessionStorage.setItem('ToyStoryOccupiedSeats', JSON.stringify([]));
    sessionStorage.setItem('LionKingOccupiedSeats', JSON.stringify([]));
  }
}

// Confirm on selected seeats
function seatsConfirmation() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedMovie = movieSelect[movieSelect.selectedIndex].getAttribute('data-movie-name');
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  if (selectedSeats.length <= 0) return;

  const seatConfirm = confirm(`
Seat(s): ${count.textContent}
Seat number(s): ${seatsIndex == [] ? 'No seat selected' : seatsIndex.join(', ')}
Price: ${total.textContent}`);

  if (seatConfirm) {
    selectedSeats.forEach((seat) => {
      seat.classList.remove('selected');
      seat.classList.add('occupied');
    });
    let occupiedSeats = JSON.parse(sessionStorage.getItem(`${selectedMovie}OccupiedSeats`));
    newOccupiedSeats = occupiedSeats.concat(seatsIndex);
    sessionStorage.setItem(`${selectedMovie}OccupiedSeats`, JSON.stringify(newOccupiedSeats));
  }
  updateSelectedCount();
}

// Movie select event
movieSelect.addEventListener('change', (e) => {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedMovie = e.target[movieSelect.selectedIndex];

  function resetAll() {
    const allSeats = document.querySelectorAll('.row .seat');
    allSeats.forEach((seat) => seat.classList.remove('occupied'));
    allSeats.forEach((seat) => seat.classList.remove('selected'));
    sessionStorage.setItem('selectedSeats', JSON.stringify([]));
    count.textContent = 0;
    total.textContent = 0;
  }

  function changeMovie() {
    resetAll();
    const selectedMovieOccupiedSeats = JSON.parse(sessionStorage.getItem(`${selectedMovie.getAttribute('data-movie-name')}OccupiedSeats`));

    seats.forEach((seat, index) => {
      if (selectedMovieOccupiedSeats.indexOf(index) > -1) {
        seat.classList.add('occupied');
      }
    });
    ticketPrice = +selectedMovie.value;
  }

  if (selectedSeats.length > 0) {
    if (confirm('Do you want to clear selected seats and change movie?')) {
      changeMovie();
      lastSelectedMovieIndex = movieSelect.selectedIndex;
    } else {
      movieSelect.selectedIndex = lastSelectedMovieIndex;
    }
  } else {
    changeMovie();
    lastSelectedMovieIndex = movieSelect.selectedIndex;
  }

  setMovieData(lastSelectedMovieIndex, ticketPrice);
});

// Seat click event
container.addEventListener('click', (e) => {
  if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
    e.target.classList.toggle('selected');

    updateSelectedCount();
  }
});

// Initial count and total set
updateSelectedCount();