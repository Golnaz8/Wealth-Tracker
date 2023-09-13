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



const transactionButtons = document.querySelectorAll('.transaction-list button');
transactionButtons.forEach((button) => {
  button.addEventListener('click', delButtonHandler);
});