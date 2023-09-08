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

// Get references to the type and category dropdowns
const typeDropdown = document.getElementById('tr-type');
const categoryDropdown = document.getElementById('tr-category');

// Define category options for Income and Expense
const categoryOptions = {
  Income: ['Work', 'Trade'],
  Expense: ['Groceries', 'Rent', 'Insurance', 'Entertainment', 'Miscellaneous']
};

// Event listener to update category options when the type is changed
typeDropdown.addEventListener('change', function() {
  const selectedType = typeDropdown.value;
  // Clear existing options
  categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
  // Add options based on the selected type
  categoryOptions[selectedType].forEach(function(option) {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      categoryDropdown.appendChild(optionElement);
  });
});

// Initialize the category dropdown with the initial placeholder option
categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';

// Set up event listeners
document.querySelector('.new-transaction-form').addEventListener('submit', newFormHandler);

const transactionButtons = document.querySelectorAll('.transaction-list button');
transactionButtons.forEach((button) => {
  button.addEventListener('click', delButtonHandler);
});
