const newFormHandler = async (event) => {
  event.preventDefault();

  const type = document.querySelector('#tr-type').value.trim();
  const amount = document.querySelector('#tr-amount').value.trim();
  const category = document.querySelector('#tr-category').value.trim();
  const description = document.querySelector('#tr-desc').value.trim();
  const date = document.querySelector('#datepicker').value;



  if (type && amount && category && description && date) {
    try {
      const response = await fetch(`/api/transactions`, {
        method: 'POST',
        body: JSON.stringify({ type, amount, category, description, date }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        throw new Error('Failed to create transaction');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the transaction.');
    }
  } else {
    alert('Please fill in all fields, including the date.');
  }
};



// Function to handle the deletion of a transaction
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
        throw new Error('Failed to delete transaction');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the transaction.');
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
typeDropdown.addEventListener('change', function () {
  const selectedType = typeDropdown.value;
  // Clear existing options
  categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
  // Add options based on the selected type
  categoryOptions[selectedType].forEach(function (option) {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    categoryDropdown.appendChild(optionElement);
  });
});


const reportHandler = async () => {

  // I shoul write some thing like this here but how can I pass it to router? it is a GET router I should ask Sean
   const start = document.querySelector('#datepicker1').value;
   const end = document.querySelector('#datepicker2').value;

   const foStart = start.split("/");
   const startDate = foStart[2] + "-" + foStart[0] + "-" + foStart[1];

   const foEnd = end.split("/");
   const endDate = foEnd[2] + "-" + foEnd[0] + "-" + foEnd[1];


  const url = `/report?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
  
     const response = await fetch(url , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`);
      console.log('Formatted Start Date:', startDate);
      console.log('Formatted End Date:', endDate);
       document.location.replace(url);
    } else {
      alert('Failed to render chart');
    }
  
};

// Initialize the category dropdown with the initial placeholder option
categoryDropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';

// Set up event listeners
document.querySelector('.new-transaction-form').addEventListener('submit', newFormHandler);
const transactionButtons = document.querySelectorAll('.transaction-list button');
transactionButtons.forEach((button) => {
  button.addEventListener('click', delButtonHandler);
});
document.querySelector('#report-btn').addEventListener('click', reportHandler);


// Get references to the amount input field and the formatted amount display element
const amountInput = document.getElementById('tr-amount');
const formattedAmount = document.getElementById('formattedAmount');

// Add a "blur" event listener to the amount input
amountInput.addEventListener('blur', () => {
  // Get the user-entered amount as a number
  const amount = parseFloat(amountInput.value);

  if (!isNaN(amount)) {
    // Create an Intl.NumberFormat instance for formatting in Canada (English)
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2,
    });

    // Format the amount
    const formatted = formatter.format(amount);

    // Display the formatted amount in the span element
    formattedAmount.textContent = formatted;
  }
});

// document.getElementById('history-btn').addEventListener('click', () => {
//   window.location.href = '/history'; // Redirect to the history page
// });
