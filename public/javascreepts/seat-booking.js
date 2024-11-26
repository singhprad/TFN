document.addEventListener('DOMContentLoaded', () => {   
    const seats = document.querySelectorAll('.seat');

    // Load booked seats from the server
    fetch('/api/booked-seats')
        .then(response => response.json())
        .then(data => {
            data.bookedSeats.forEach(seatNumber => {
                const seat = document.querySelector(`.seat[data-seat="${seatNumber}"]`);
                if (seat) {
                    seat.classList.add('occupied');
                }
            });
        });

    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (!seat.classList.contains('occupied')) {
                seat.classList.toggle('selected');
                
                const seatNumber = seat.getAttribute('data-seat');

                // Send booking request to the server
                fetch('/api/book-seat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ seatNumber })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        seat.classList.add('occupied');
                        seat.classList.remove('selected');
                    } else {
                        alert('Booking failed. Please try again.');
                    }
                });
            }
        });
    });
});
