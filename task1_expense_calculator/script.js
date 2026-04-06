// Array to store expenses
let expenses = [];

// DOM Elements
const expenseInput = document.getElementById('expenseInput');
const addBtn = document.getElementById('addBtn');
const expenseList = document.getElementById('expenseList');
const totalAmount = document.getElementById('totalAmount');
const clearBtn = document.getElementById('clearBtn');

// Add expense on button click
addBtn.addEventListener('click', addExpense);

// Add expense on Enter key press
expenseInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		addExpense();
	}
});

// Clear all expenses
clearBtn.addEventListener('click', clearAllExpenses);

// Function to add expense
function addExpense() {
	const inputValue = expenseInput.value.trim();

	// Validation
	if (inputValue === '') {
		alert('⚠️ Please enter an expense amount!');
		expenseInput.focus();
		return;
	}

	const amount = parseFloat(inputValue);

	if (isNaN(amount) || amount <= 0) {
		alert('⚠️ Please enter a valid positive number!');
		expenseInput.value = '';
		expenseInput.focus();
		return;
	}

	// Add to array
	expenses.push(amount);

	// Update UI
	renderExpenses();

	// Clear input
	expenseInput.value = '';
	expenseInput.focus();
}

// Function to render all expenses
function renderExpenses() {
	expenseList.innerHTML = '';

	if (expenses.length === 0) {
		expenseList.innerHTML =
			'<li class="list-group-item text-muted text-center">No expenses yet. Add one to get started!</li>';
	} else {
		expenses.forEach((amount, index) => {
			const li = document.createElement('li');
			li.className =
				'list-group-item d-flex justify-content-between align-items-center';
			li.innerHTML = `
                <span class="fw-bold text-primary">${amount.toFixed(2)} ৳</span>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${index})">Delete</button>
            `;
			expenseList.appendChild(li);
		});
	}

	updateTotal();
}

// Function to delete expense
function deleteExpense(index) {
	expenses.splice(index, 1);
	renderExpenses();
}

// Function to calculate and display total using reduce()
function updateTotal() {
	const total = expenses.reduce((sum, amount) => sum + amount, 0);
	totalAmount.textContent = total.toFixed(2);
}

// Function to clear all expenses
function clearAllExpenses() {
	if (expenses.length === 0) {
		alert('⚠️ No expenses to clear!');
		return;
	}

	if (confirm('Are you sure you want to delete all expenses?')) {
		expenses = [];
		renderExpenses();
	}
}

// Initial render
renderExpenses();
