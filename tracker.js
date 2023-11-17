document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const itemsList = document.getElementById('items');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form values
        const amount = document.getElementById('amount').value;
        const usage = document.getElementById('useage').value;
        const category = document.querySelector('select').value;

        // Validate input
        if (!amount || !usage || category === '...Choose Category...') {
            alert('Please fill in all fields.');
            return;
        }

        // Check if it's an edit or a new expense
        const editIndex = form.getAttribute('data-edit-index');
        if (editIndex !== null) {
            // If it's an edit, update the expense
            updateExpense(editIndex, { amount, usage, category });
            form.removeAttribute('data-edit-index');
        } else {
            // If it's a new expense, save it
            saveExpense({ amount, usage, category });
        }

        // Clear form inputs
        form.reset();

        // Update the list of items
        updateItemsList();
    });

    function saveExpense(expense) {
        // Retrieve existing expenses from localStorage
        const existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

        // Add the new expense to the array
        existingExpenses.push(expense);

        // Save the updated expenses array back to localStorage
        localStorage.setItem('expenses', JSON.stringify(existingExpenses));
    }

    function updateItemsList() {
        // Clear the current list
        itemsList.innerHTML = '';

        // Retrieve expenses from localStorage
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

        // Create list items for each expense
        expenses.forEach(function (expense, index) {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `Amount: ${expense.amount}, Usage: ${expense.usage}, Category: ${expense.category}`;

            // Add Edit and Delete buttons
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'btn btn-warning btn-sm mx-2';
            editButton.addEventListener('click', function () {
                editExpense(index, expense);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.addEventListener('click', function () {
                deleteExpense(index);
            });

            // Append buttons to the list item
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            // Append list item to the list
            itemsList.appendChild(listItem);
        });
    }

    function editExpense(index, expense) {
        // Set form values for editing
        document.getElementById('amount').value = expense.amount;
        document.getElementById('useage').value = expense.usage;
        document.querySelector('select').value = expense.category;

        // Set data attribute to mark it as an edit
        form.setAttribute('data-edit-index', index);
    }

    function updateExpense(index, updatedExpense) {
        // Retrieve existing expenses from localStorage
        const existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

        // Update the expense in the array
        existingExpenses[index] = updatedExpense;

        // Save the updated expenses array back to localStorage
        localStorage.setItem('expenses', JSON.stringify(existingExpenses));

        // Update the displayed list
        updateItemsList();
    }

    function deleteExpense(index) {
        // Retrieve existing expenses from localStorage
        const existingExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

        // Remove the expense from the array
        existingExpenses.splice(index, 1);

        // Save the updated expenses array back to localStorage
        localStorage.setItem('expenses', JSON.stringify(existingExpenses));

        // Update the displayed list
        updateItemsList();
    }

    // Initial update of the list
    updateItemsList();
});
