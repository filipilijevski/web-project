/**
 * employeeHome.js
 *
 * Handles the dynamic functionality for the Employee Home page.
 * - Loads upcoming bookings for the hotel where the logged-in employee works.
 * - Loads booking history (converted bookings) for the employee.
 * - Provides per-booking "Convert to Renting" functionality.
 *   * When the "Convert to Renting" button is clicked, a modal pop-up appears
 *     allowing the employee to adjust the start and end dates.
 *   * Conversion is allowed only if the new start date equals today's date
 *     and the new end date is after today.
 *   * On successful conversion, the booking is archived and a renting is created
 *     using the new dates provided.
 */

/* Helper: Format timestamp into date and time on separate lines (for upcoming bookings) */
function formatDateTime(timestamp) {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}<br>${hours}:${minutes}:${seconds}`;
  }
  
  /* Helper: Format timestamp into date and time on one line (for booking history) */
  function formatDateTimeInline(timestamp) {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadUpcomingBookings();
    loadBookingHistory();
  
    // Modal controls
    const modal = document.getElementById('convertModal');
    const cancelBtn = document.getElementById('cancelConvertBtn');
    cancelBtn.addEventListener('click', () => {
      closeModal();
    });
  });
  
  let currentBookingToConvert = null; // holds the booking object selected for conversion
  
  async function loadUpcomingBookings() {
    try {
      const employee = window.getLoggedInEmployee();
      const tbody = document.getElementById('upcomingBookingsBody');
      // If the employee is not associated with a hotel, display a message.
      if (!employee || !employee.hotel_id) {
        tbody.innerHTML = '<tr><td colspan="6">No upcoming bookings (no hotel association).</td></tr>';
        return;
      }
      // Fetch upcoming bookings for the employee's hotel.
      const bookings = await window.apiRequest(`/api/bookings/upcoming/hotel/${employee.hotel_id}`);
      tbody.innerHTML = ''; // Clear existing rows
  
      if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No upcoming bookings found.</td></tr>';
        return;
      }
  
      bookings.forEach(booking => {
        const clientDisplay = booking.customer_full_name
          ? `${booking.customer_sin} - ${booking.customer_full_name}`
          : booking.customer_sin;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${booking.booking_id}</td>
          <td>${clientDisplay}</td>
          <td>${booking.room_id}</td>
          <td>${formatDateTime(booking.start_date)}</td>
          <td>${formatDateTime(booking.end_date)}</td>
          <td><button class="action-btn convert-btn" data-booking-id="${booking.booking_id}">Convert to Renting</button></td>
        `;
        tbody.appendChild(tr);
      });
  
      // Attach event listeners to all convert buttons.
      document.querySelectorAll('.convert-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const bookingId = e.target.getAttribute('data-booking-id');
          const booking = bookings.find(b => b.booking_id == bookingId);
          if (booking) {
            openConversionModal(booking);
          }
        });
      });
    } catch (err) {
      console.error('Error loading upcoming bookings:', err);
    }
  }
  
  async function loadBookingHistory() {
    try {
      const employee = window.getLoggedInEmployee();
      if (!employee) return;
      // Fetch rentings (converted bookings) for this employee.
      const history = await window.apiRequest(`/api/rentings/employee/${employee.employee_sin}`);
      const historyList = document.getElementById('bookingHistoryList');
      historyList.innerHTML = '';
      if (history.length === 0) {
        historyList.innerHTML = '<li>No booking history found.</li>';
        return;
      }
      history.forEach(renting => {
        const clientDisplay = renting.customer_full_name
          ? `${renting.customer_sin} - ${renting.customer_full_name}`
          : renting.customer_sin;
        const li = document.createElement('li');
        li.innerHTML = `Renting #${renting.renting_id} for client ${clientDisplay}: ${formatDateTimeInline(renting.start_date)} - ${formatDateTimeInline(renting.end_date)}`;
        historyList.appendChild(li);
      });
    } catch (err) {
      console.error('Error loading booking history:', err);
    }
  }
  
  function openConversionModal(booking) {
    currentBookingToConvert = booking;
    const modal = document.getElementById('convertModal');
    const modalInfo = document.getElementById('modalBookingInfo');
    const newStartInput = document.getElementById('newStartDate');
    const newEndInput = document.getElementById('newEndDate');
    const modalError = document.getElementById('modalError');
    
    const clientDisplay = booking.customer_full_name
      ? `${booking.customer_sin} - ${booking.customer_full_name}`
      : booking.customer_sin;
    modalInfo.innerHTML = `Booking #${booking.booking_id} for client ${clientDisplay}, Room ${booking.room_id}.<br>
    Original Check-In: ${formatDateTime(booking.start_date)}<br>Original Check-Out: ${formatDateTime(booking.end_date)}`;
    // Pre-fill with default values (start date = today's date, end date = original end date)
    newStartInput.value = new Date().toISOString().split('T')[0];
    newEndInput.value = booking.end_date.split('T')[0];
    modalError.textContent = '';
    modal.style.display = 'block';
  
    // Attach event listener for confirmation (remove previous if any).
    const confirmBtn = document.getElementById('confirmConvertBtn');
    confirmBtn.onclick = async () => {
      await handleConversionConfirm();
    };
  }
  
  function closeModal() {
    const modal = document.getElementById('convertModal');
    modal.style.display = 'none';
    currentBookingToConvert = null;
  }
  
  async function handleConversionConfirm() {
    const newStartInput = document.getElementById('newStartDate');
    const newEndInput = document.getElementById('newEndDate');
    const modalError = document.getElementById('modalError');
    const newStartDate = newStartInput.value;
    const newEndDate = newEndInput.value;
    const today = new Date().toISOString().split('T')[0];
  
    if (newStartDate !== today) {
      modalError.textContent = 'Start date must be today.';
      return;
    }
    if (newEndDate <= today) {
      modalError.textContent = 'End date must be after today.';
      return;
    }
  
    try {
      const employee = window.getLoggedInEmployee();
      if (!employee) return;
      // Call the conversion endpoint with new dates.
      const response = await window.apiRequest(`/api/bookings/${currentBookingToConvert.booking_id}/convertToRenting`, {
        method: 'POST',
        body: { 
          employee_sin: employee.employee_sin,
          new_start_date: newStartDate,
          new_end_date: newEndDate
        }
      });
      alert(response.message);
      closeModal();
      // Refresh both upcoming bookings and booking history.
      loadUpcomingBookings();
      loadBookingHistory();
    } catch (err) {
      console.error('Error during booking conversion:', err);
      modalError.textContent = 'Conversion failed. Please try again.';
    }
  }
  