// Function to handle the creation of a new post
const newFormHandler = async (event) => {
  event.preventDefault();

  const type = document.querySelector('#tr-type').value.trim();
  const amount = document.querySelector('#tr-amount').value.trim();
  const category = document.querySelector('#tr-category').value.trim();
  const description = document.querySelector('#tr-desc').value.trim();

  if (type && amount && category && description) {
    try {
      const response = await fetch(`/api/transactions`, {
        method: 'POST',
        body: JSON.stringify({ type, amount, category, description }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the post.');
    }
  }
};

// Function to handle the deletion of a post
const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the post.');
    }
  }
};

// Set up event listeners
document.querySelector('.new-transaction-form').addEventListener('submit', newFormHandler);

const transactionButtons = document.querySelectorAll('.transaction-list button');
transactionButtons.forEach((button) => {
  button.addEventListener('click', delButtonHandler);
});
