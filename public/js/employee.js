/**
 * employee.js
 *
 * This file handles the client‐side functionality for employee registration and login.
 * It interacts with the employeeRoutes API endpoints to register new employees and log in existing ones.
 * It also manages session state via main.js global functions.
 *
 * When an employee is already logged in, the page automatically redirects to employeehome.html.
 * Upon successful login, the employee object is stored in sessionStorage and the header is updated via main.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    // If an employee is already logged in, redirect to employeehome.html
    const currentEmployee = window.getLoggedInEmployee();
    if (currentEmployee) {
      window.location.href = 'employeehome.html';
      return; // Stop further processing
    }
  
    // Attach event listeners to the registration and login forms.
    const registerForm = document.getElementById('employeeRegisterForm');
    if (registerForm) {
      registerForm.addEventListener('submit', handleEmployeeRegister);
    }
  
    const loginForm = document.getElementById('employeeLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleEmployeeLogin);
    }
  });
  
  /**
   * Handles employee registration.
   * Gathers data from the registration form and calls the backend API to register a new employee.
   * On success, notifies the user and resets the form.
   */
  async function handleEmployeeRegister(event) {
    event.preventDefault();
  
    // Collect registration form data
    const employee_sin = document.getElementById('empRegSin').value.trim();
    const full_name = document.getElementById('empRegName').value.trim();
    const address = document.getElementById('empRegAddress').value.trim();
    const email = document.getElementById('empRegEmail').value.trim();
    const password = document.getElementById('empRegPassword').value; // No trim for password
  
    // Basic client-side validation
    if (!employee_sin || !full_name || !address || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const payload = {
      employee_sin,
      full_name,
      address,
      email,
      password
    };
  
    try {
      // Call backend registration endpoint
      await window.apiRequest('/api/employees/register', {
        method: 'POST',
        body: payload
      });
  
      alert('Registration successful! Please log in with your email and password.');
      document.getElementById('employeeRegisterForm').reset();
    } catch (error) {
      console.error('Employee registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }
  
  /**
   * Handles employee login.
   * Gathers data from the login form and calls the backend API to authenticate the employee.
   * On success, stores the employee object in sessionStorage, updates the header, and redirects to employeehome.html.
   */
  async function handleEmployeeLogin(event) {
    event.preventDefault();
  
    const email = document.getElementById('empLoginEmail').value.trim();
    const password = document.getElementById('empLoginPassword').value;
  
    if (!email || !password) {
      alert('Please provide both email and password.');
      return;
    }
  
    try {
      const employee = await window.apiRequest('/api/employees/login', {
        method: 'POST',
        body: { email, password }
      });
  
      window.setLoggedInEmployee(employee);
      window.updateHeader();
      window.location.href = 'employeehome.html';
    } catch (error) {
      console.error('Employee login error:', error);
      alert('Login failed. Please check your email and password and try again.');
    }
  }
  