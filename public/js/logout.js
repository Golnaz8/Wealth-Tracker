// Function to handle logout
const logout = async () => {
  try {
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If logout is successful, redirect to the homepage
      document.location.replace('/');
    } else {
      // Display an alert with the error message
      const errorMessage = await response.text();
      alert(`Logout failed: ${errorMessage}`);
    }
  } catch (error) {
    console.error(error);
    alert('An error occurred during logout.');
  }
};

// Add a click event listener to the logout button
document.querySelector('#logout').addEventListener('click', logout);