/**
 * customer.js
 *
 * This file handles the client‐side functionality for customer registration and login.
 * It interacts with the customerRoutes API endpoints to register new customers and log in existing ones.
 * It also manages session state via main.js global functions.
 *
 * When a customer is already logged in, the page automatically redirects to customerhome.html.
 * Upon successful login, the user is stored in sessionStorage and the header is updated via main.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    // If a customer is already logged in, redirect to customerhome.html
    const currentUser = window.getLoggedInUser();
    if (currentUser) {
      window.location.href = 'customerhome.html';
      return; // Stop further processing
    }
    
    // Attach event listeners to the registration and login forms
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
  });
  
  /**
   * Handles customer registration.
   * Gathers data from the registration form and calls the backend API to register a new customer.
   * On success, it notifies the user and optionally redirects them (or you could auto-login).
   */
  async function handleRegister(event) {
    event.preventDefault(); // Prevent form's default submission behavior
    
    // Collect registration form data
    const customer_sin = document.getElementById('regSin').value.trim();
    const full_name = document.getElementById('regName').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const id_type = document.getElementById('regIdType') ? document.getElementById('regIdType').value.trim() : ''; // If present
    const password = document.getElementById('regPassword').value; // No trim for password
    // For simplicity, payment_info is not collected at registration in this example
    const payment_info = ''; // Optionally, add a field if needed
    
    // Basic client-side validation.
    if (!customer_sin || !full_name || !address || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Build registration payload
    const payload = {
      customer_sin,
      full_name,
      address,
      email,
      phone,
      id_type,
      payment_info,
      password
    };
    
    try {
      // Call backend registration endpoint
      const response = await window.apiRequest('/api/customers/register', {
        method: 'POST',
        body: payload
      });
      
      // Notify user of success
      alert('Registration successful! Please log in with your email and password.');
      
      // Optionally, clear the form or redirect to login section
      document.getElementById('registerForm').reset();
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }
  
  /**
   * Handles customer login.
   * Gathers data from the login form and calls the backend API to authenticate the customer.
   * If authentication is successful, stores the user in sessionStorage and redirects to customerhome.html.
   */
  async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission default behavior
    
    // Collect login form data (using email and password)
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
      alert('Please provide both email and password.');
      return;
    }
    
    try {
      // Call the backend login endpoint
      const customer = await window.apiRequest('/api/customers/login', {
        method: 'POST',
        body: { email, password }
      });
      
      // If login is successful, store the customer object in sessionStorage
      window.setLoggedInUser(customer);
      
      // Update the header (global update via main.js) so that the welcome message appears
      window.updateHeader();
      
      // Redirect to the customer home page
      window.location.href = 'customerhome.html';
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your email and password and try again.');
    }
  }
  