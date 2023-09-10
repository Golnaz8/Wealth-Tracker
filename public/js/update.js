// Function to handle edit form submission
const editFormHandler = async (event) => {
  event.preventDefault();

  const type = document.querySelector('#edit-tr-type').value.trim();
  const amount = document.querySelector('#edit-tr-amount').value.trim();
  const category = document.querySelector('#edit-tr-category').value.trim();
  const description = document.querySelector('#edit-tr-desc').value.trim();
  const dateValue = document.querySelector('#edit-tr-date').value.trim();


  const selectedDate = new Date(dateValue);
  selectedDate.setDate(selectedDate.getDate() + 1);
  // Format the adjusted date back to a string
  const date = selectedDate.toISOString().split('T')[0];



  if (type && amount && category && description && date) {
    const id = event.currentTarget.getAttribute('data-id');
    console.log(`Edit button clicked for post ID: ${id}`);

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



// Function to update category options based on selected type
const updateCategoryOptions = () => {

  const transactionType = document.querySelector('#edit-tr-type').value;
  const categoryDropdown = document.querySelector('#edit-tr-category').value;


  // Clear existing options
  categoryDropdown.innerHTML = '';

  // Add placeholder option for category
  const placeholderOption = document.createElement('option');
  placeholderOption.value = '';
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.textContent = 'Select Category';
  categoryDropdown.appendChild(placeholderOption);

  // Add options based on transaction type
  if (transactionType === 'Income') {
    const workOption = document.createElement('option');
    workOption.value = 'Work';
    workOption.textContent = 'Work';
    categoryDropdown.appendChild(workOption);

    const tradeOption = document.createElement('option');
    tradeOption.value = 'Trade';
    tradeOption.textContent = 'Trade';
    categoryDropdown.appendChild(tradeOption);
  } else if (transactionType === 'Expense') {
    const groceriesOption = document.createElement('option');
    groceriesOption.value = 'Groceries';
    groceriesOption.textContent = 'Groceries';
    categoryDropdown.appendChild(groceriesOption);

    const rentOption = document.createElement('option');
    rentOption.value = 'Rent';
    rentOption.textContent = 'Rent';
    categoryDropdown.appendChild(rentOption);

    const insuranceOption = document.createElement('option');
    insuranceOption.value = 'Insurance';
    insuranceOption.textContent = 'Insurance';
    categoryDropdown.appendChild(insuranceOption);

    const entertainmentOption = document.createElement('option');
    entertainmentOption.value = 'Entertainment';
    entertainmentOption.textContent = 'Entertainment';
    categoryDropdown.appendChild(entertainmentOption);

    const miscellaneousOption = document.createElement('option');
    miscellaneousOption.value = 'Miscellaneous';
    miscellaneousOption.textContent = 'Miscellaneous';
    categoryDropdown.appendChild(miscellaneousOption);
  }
};

// Set up event listener for "transaction-type" change
document.querySelector('#edit-tr-type').addEventListener('submit', updateCategoryOptions);

// Set up event listener for edit form submission
document.querySelector('.edit-transaction-form').addEventListener('submit', editFormHandler);

// Initial category options setup based on default transaction type
updateCategoryOptions();
