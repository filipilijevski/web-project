/**
 * search.js
 *
 * Handles the search functionality for available rooms.
 * - Loads hotel chain options dynamically.
 * - Attaches an event listener to the search form.
 * - Constructs a query string with search criteria and calls the searchAvailable API.
 * - Displays results in the results container.
 * - If a customer is logged in, adds a "Book Room" button to each result which opens a booking modal.
 */

async function loadHotelChains() {
    try {
      const chains = await apiRequest('/api/hotelChains');
      const hotelChainSelect = document.getElementById('hotelChain');
      hotelChainSelect.innerHTML = '<option value="">Any</option>';
      chains.forEach(chain => {
        const option = document.createElement('option');
        option.value = chain.chain_name;
        option.textContent = chain.chain_name;
        hotelChainSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error loading hotel chains:', error);
    }
  }
  
  async function performSearch(event) {
    event.preventDefault();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const capacity = document.getElementById('capacity').value;
    const hotelChain = document.getElementById('hotelChain').value;
    const category = document.getElementById('category').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
  
    let params = new URLSearchParams();
    if (checkin) params.append('start', checkin);
    if (checkout) params.append('end', checkout);
    if (capacity) params.append('capacity', capacity);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (category) params.append('category', category);
    if (hotelChain) params.append('hotelChain', hotelChain);
  
    try {
      const results = await apiRequest(`/api/bookings/searchAvailable?${params.toString()}`);
      displayResults(results);
    } catch (error) {
      console.error('Error performing search:', error);
      document.getElementById('resultsContainer').innerHTML = '<p>Error fetching results. Please try again later.</p>';
    }
  }
  
  function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
  
    if (!results || results.length === 0) {
      container.innerHTML = '<p>No results found. Please adjust your criteria and try again.</p>';
      return;
    }
    
    results.forEach(room => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <h3>Room ID: ${room.room_id}</h3>
        <p><strong>Price:</strong> $${room.price}</p>
        <p><strong>Capacity:</strong> ${room.room_capacity}</p>
        <p><strong>Hotel Category:</strong> ${room.category}</p>
        <p><strong>Hotel Address:</strong> ${room.address}</p>
        <p><strong>Hotel Name:</strong> ${room.hotel_name}</p>
        <p><strong>Hotel Chain:</strong> ${room.chain_name || 'N/A'}</p>
      `;
      if (window.getLoggedInUser()) {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.textContent = 'Book Room';
        // Debug log to verify click event
        btn.addEventListener('click', () => {
          console.log('Book Room button clicked for room:', room);
          openBookingModal(room);
        });
        card.appendChild(btn);
      }
      container.appendChild(card);
    });
  }
  
  function openBookingModal(room) {
    console.log('Opening booking modal for room:', room);
    window.selectedRoomForBooking = room;
    const modal = document.getElementById('bookingModal');
    const modalInfo = document.getElementById('bookingModalInfo');
    modalInfo.innerHTML = `
      <strong>Room ID:</strong> ${room.room_id}<br>
      <strong>Price:</strong> $${room.price}<br>
      <strong>Capacity:</strong> ${room.room_capacity}<br>
      <strong>Hotel:</strong> ${room.hotel_name} (${room.chain_name || 'N/A'})<br>
    `;
    // Clear previous input values and errors
    document.getElementById('bookingStartDate').value = '';
    document.getElementById('bookingEndDate').value = '';
    document.getElementById('bookingModalError').textContent = '';
    modal.style.display = 'block';
  }
  
  function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    window.selectedRoomForBooking = null;
  }
  
  async function confirmBooking() {
    const startDate = document.getElementById('bookingStartDate').value;
    const endDate = document.getElementById('bookingEndDate').value;
    const errorEl = document.getElementById('bookingModalError');
    const today = new Date().toISOString().split('T')[0];
  
    if (!startDate || !endDate) {
      errorEl.textContent = 'Please select both start and end dates.';
      return;
    }
    if (startDate < today) {
      errorEl.textContent = 'Start date cannot be in the past.';
      return;
    }
    if (endDate <= startDate) {
      errorEl.textContent = 'End date must be after start date.';
      return;
    }
  
    try {
      const customer = window.getLoggedInUser();
      if (!customer) {
        errorEl.textContent = 'You must be logged in to book a room.';
        return;
      }
      const room = window.selectedRoomForBooking;
      const response = await apiRequest('/api/bookings', {
        method: 'POST',
        body: {
          customer_sin: customer.customer_sin,
          room_id: room.room_id,
          start_date: startDate,
          end_date: endDate
        }
      });
      alert(`Booking successful! Your booking ID is ${response.booking_id}.`);
      closeBookingModal();
    } catch (error) {
      console.error('Booking error:', error);
      errorEl.textContent = 'Booking failed. Please try again.';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadHotelChains();
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', performSearch);
    }
    // Ensure modal is hidden on page load
    document.getElementById('bookingModal').style.display = 'none';
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', confirmBooking);
    }
    const cancelBtn = document.getElementById('cancelBookingBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeBookingModal);
    }
  });
  
  // Expose openBookingModal globally 
  window.openBookingModal = openBookingModal;
  