// Function to handle form submissions
const formHandler = async (event, endpoint) => {
  event.preventDefault();

  // Collect values from the form
  const username = document.querySelector('#name-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    try {
      // Send a POST request to the specified API endpoint
      const response = await fetch(`/api/users${endpoint}`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // If successful, redirect the browser to the dashboard
        document.location.replace('/dashboard');
      } else {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing your request.');
    }
  }
};

// Event listeners for both login and signup forms
document.querySelector('.login-form').addEventListener('submit', (event) => {
  formHandler(event, '/login');
});

document.querySelector('.signup-form').addEventListener('submit', (event) => {
  formHandler(event, '');
});
