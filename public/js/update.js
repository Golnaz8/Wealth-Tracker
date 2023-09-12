// Function to handle edit form submission
const editFormHandler = async (event) => {
  event.preventDefault();

  const type = document.querySelector('#edit-tr-type').value.trim();
  const amount = document.querySelector('#edit-tr-amount').value.trim();
  const category = document.querySelector('#edit-tr-category').value.trim();
  const description = document.querySelector('#edit-tr-desc').value.trim();
  const dateValue = document.querySelector('#edit-tr-date').value;


  const selectedDate = new Date(dateValue);
  selectedDate.setDate(selectedDate.getDate() + 1);
  // Format the adjusted date back to a string
  const date = selectedDate.toISOString().split('T')[0];



  if (type && amount && category && description && date) {
    const id = event.currentTarget.getAttribute('data-id');

    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ type, amount, category, description, date }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to update transaction');
    }
  }
};


// Set up event listener for edit form submission
document.querySelector('.edit-transaction-form').addEventListener('submit', editFormHandler);

