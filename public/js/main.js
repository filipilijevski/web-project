"use strict";
/**
 * main.js
 *
 * Global JS utilities for The Bebstore Hotel Booking App.
 * This file manages session & authentication, updates the header UI,
 * provides a global API request helper, and registers global event listeners.
 *
 * We will eventually implement secure tokens (e.g JWT) and hash passwords.
 */

/* -------------------------------
   Session & Authentication Management
---------------------------------*/

/**
 * Customer session management
 */
function getLoggedInUser() {
  const userData = sessionStorage.getItem('loggedInUser');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing loggedInUser data:', error);
      return null;
    }
  }
  return null;
}

function setLoggedInUser(user) {
  sessionStorage.setItem('loggedInUser', JSON.stringify(user));
}

function clearLoggedInUser() {
  sessionStorage.removeItem('loggedInUser');
}

/**
 * Employee session management
 */
function getLoggedInEmployee() {
  const empData = sessionStorage.getItem('loggedInEmployee');
  if (empData) {
    try {
      return JSON.parse(empData);
    } catch (error) {
      console.error('Error parsing loggedInEmployee data:', error);
      return null;
    }
  }
  return null;
}

function setLoggedInEmployee(employee) {
  sessionStorage.setItem('loggedInEmployee', JSON.stringify(employee));
}

function clearLoggedInEmployee() {
  sessionStorage.removeItem('loggedInEmployee');
}

/* -------------------------------
     Header Update Functions
---------------------------------*/
/**
 * Updates navigation links based on authentication state.
 * The Customer and Employee links change based on their respective login states.
 */
function updateHeaderLinks() {
  // Update Customer link
  const customerLink = document.querySelector('.link-section a[href="customer.html"]');
  if (customerLink) {
    const user = getLoggedInUser();
    customerLink.href = user ? 'customerhome.html' : 'customer.html';
  }

  // Update Employee link
  const employeeLink = document.querySelector('.link-section a[href="employee.html"]');
  if (employeeLink) {
    const employee = getLoggedInEmployee();
    employeeLink.href = employee ? 'employeehome.html' : 'employee.html';
  }
}

/**
 * Updates the header to display the logged-in user's name and a logout button,
 * or a login button if no user is authenticated.
 * Checks both customer and employee sessions.
 */
function updateHeader() {
  updateHeaderLinks();
  let userInfoEl = document.getElementById('user-info');
  if (!userInfoEl) {
    userInfoEl = document.createElement('div');
    userInfoEl.id = 'user-info';
    userInfoEl.classList.add('user-info');
    const headerSection = document.querySelector('.header-section');
    if (headerSection) {
      headerSection.appendChild(userInfoEl);
    }
  }
  
  // Check for employee first
  const employee = getLoggedInEmployee();
  const customer = getLoggedInUser();
  
  if (employee) {
    userInfoEl.innerHTML = `
      <span class="user-welcome">Welcome, ${employee.full_name} (Employee)</span>
      <button id="logoutBtn" class="logout-btn">Log Out</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      clearLoggedInEmployee();
      updateHeader();
      window.location.href = 'employee.html';
    });
  } else if (customer) {
    userInfoEl.innerHTML = `
      <span class="user-welcome">Welcome, ${customer.full_name}</span>
      <button id="logoutBtn" class="logout-btn">Log Out</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      clearLoggedInUser();
      updateHeader();
      window.location.href = 'customer.html';
    });
  } else {
    // If no one is logged in, show a generic login button (could be improved to show separate options)
    userInfoEl.innerHTML = `
      <button id="loginBtn" class="login-btn">Login</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', () => {
      // Redirect to customer.html
      window.location.href = 'customer.html';
    });
  }
}

/* -------------------------------
     Global API Helper Function
---------------------------------*/
async function apiRequest(url, options = {}) {
  try {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    options.headers = { ...defaultHeaders, ...(options.headers || {}) };

    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    return await response.json();
  } catch (err) {
    console.error('API Request error:', err);
    throw err;
  }
}

/* -------------------------------
     Global Event Listeners
---------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  updateHeader();
});

// Expose global functions
window.apiRequest = apiRequest;
window.getLoggedInUser = getLoggedInUser;
window.setLoggedInUser = setLoggedInUser;
window.clearLoggedInUser = clearLoggedInUser;
window.getLoggedInEmployee = getLoggedInEmployee;
window.setLoggedInEmployee = setLoggedInEmployee;
window.clearLoggedInEmployee = clearLoggedInEmployee;
window.updateHeader = updateHeader;
