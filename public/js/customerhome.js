/**
 * customerHome.js
 *
 * Manages the Customer Home dashboard functionalities:
 *  - Displays the logged-in customer's upcoming bookings and booking history.
 *  - Allows the customer to update their payment method (card number).
 *
 * This script uses the global functions provided in main.js, such as:
 *  - getLoggedInUser()
 *  - setLoggedInUser()
 *  - apiRequest()
 *
 * All API requests are made to the endpoints provided in the customerRoutes.
 */

document.addEventListener('DOMContentLoaded', () => {
    const customer = window.getLoggedInUser();
    if (!customer) {
      // If no customer is logged in, redirect to the customer login page
      window.location.href = 'customer.html';
      return;
    }
    // Load the dashboard data (bookings) for the logged-in customer
    loadDashboard(customer);
    
    // Set up event listener for the Payment Method form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        updatePaymentMethod(customer);
      });
    }
  });
  
  /**
   * Loads the dashboard by fetching the customer's bookings,
   * filters them into upcoming bookings and booking history.
   */
  async function loadDashboard(customer) {
    try {
      const sin = customer.customer_sin;
      // Retrieve all bookings for the customer.
      const bookings = await apiRequest(`/api/customers/${sin}/bookings`);
      const today = new Date();
      // Filter bookings: upcoming if start_date is today or later
      const upcomingBookings = bookings.filter(b => new Date(b.start_date) >= today);
      // History if start_date is in the past
      const bookingHistory = bookings.filter(b => new Date(b.start_date) < today);
      displayUpcomingBookings(upcomingBookings);
      displayBookingHistory(bookingHistory);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }
  
  /**
   * Dynamically populates the Upcoming Bookings table.
   * @param {Array} bookings - List of upcoming booking objects.
   */
  function displayUpcomingBookings(bookings) {
    const tbody = document.querySelector('.upcoming-bookings-panel .dashboard-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No upcoming bookings.</td></tr>';
      return;
    }
    
    bookings.forEach(booking => {
      // Demo: If hotel info is not part of the booking, display N/A
      const hotelName = booking.hotel || 'N/A';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${booking.booking_id}</td>
        <td>${hotelName}</td>
        <td>${booking.room_id}</td>
        <td>${booking.start_date}</td>
        <td>${booking.end_date}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  /**
   * Dynamically populates the Booking History list.
   * @param {Array} bookings - List of past booking objects.
   */
  function displayBookingHistory(bookings) {
    const historyList = document.querySelector('.booking-history-panel .dashboard-list');
    if (!historyList) return;
    historyList.innerHTML = '';
    
    if (bookings.length === 0) {
      historyList.innerHTML = '<li>No past bookings.</li>';
      return;
    }
    
    bookings.forEach(booking => {
      const li = document.createElement('li');
      li.textContent = `Booking #${booking.booking_id}: Completed on ${booking.end_date}`;
      historyList.appendChild(li);
    });
  }
  
  /**
   * Updates the payment method (card number) for the logged-in customer.
   * Sends a PUT request to update the customer's payment_info.
   * @param {Object} customer - The logged-in customer's data.
   */
  async function updatePaymentMethod(customer) {
    const cardNumberInput = document.getElementById('cardNumber');
    const newCard = cardNumberInput.value.trim();
    if (!newCard) {
      alert('Please enter a valid card number.');
      return;
    }
    
    try {
      // Create an updated customer object using the existing customer data
      const updatedCustomer = { ...customer, payment_info: newCard };
      // Prepare the payload with the fields required by the PUT endpoint
      const payload = {
        full_name: updatedCustomer.full_name,
        address: updatedCustomer.address,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        id_type: updatedCustomer.id_type,
        payment_info: updatedCustomer.payment_info,
        password: updatedCustomer.password
      };
      // Send the update request
      const response = await apiRequest(`/api/customers/${customer.customer_sin}`, {
        method: 'PUT',
        body: payload
      });
      alert('Payment method updated successfully.');
      // Update the session storage with the new customer data
      window.setLoggedInUser(response);
    } catch (error) {
      console.error('Error updating payment method:', error);
      alert('Failed to update payment method. Please try again.');
    }
  }
  