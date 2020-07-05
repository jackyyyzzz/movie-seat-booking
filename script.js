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
  const selectedSeatsCount = selectedSeats.length;
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  sessionStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
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

  const selectedMovie = movieSelect[movieSelect.selectedIndex].innerText;
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
  const selectedMovie = movieSelect[movieSelect.selectedIndex].innerText;
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
  if (selectedSeats.length <= 0) return;

  const seatConfirm = confirm(`\n 
          Seat(s): ${count.innerText} \n 
          Seat number(s): ${seatsIndex == [] ? 'No seat selected' : seatsIndex} \n 
          Price: ${total.innerText}`);

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
  let selectedSeats = document.querySelectorAll('.row .seat.selected');
  let selectedMovie = e.target[movieSelect.selectedIndex];

  function resetAll() {
    const allSeats = document.querySelectorAll('.row .seat');
    allSeats.forEach((seat) => seat.classList.remove('occupied'));
    allSeats.forEach((seat) => seat.classList.remove('selected'));
    sessionStorage.setItem('selectedSeats', JSON.stringify([]));
    count.innerText = 0;
    total.innerText = 0;
  }

  function changeMovie() {
    resetAll();
    const selectedMovieOccupiedSeats = JSON.parse(sessionStorage.getItem(`${selectedMovie.innerText}OccupiedSeats`));

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