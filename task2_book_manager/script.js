// Array to store books
let books = [];

// LocalStorage key
const STORAGE_KEY = 'bookList';

// DOM Elements
const bookNameInput = document.getElementById('bookNameInput');
const authorNameInput = document.getElementById('authorNameInput');
const addBookBtn = document.getElementById('addBookBtn');
const tableBody = document.getElementById('tableBody');
const clearAllBtn = document.getElementById('clearAllBtn');

// Event listeners
addBookBtn.addEventListener('click', addBook);
bookNameInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		authorNameInput.focus();
	}
});
authorNameInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		addBook();
	}
});
clearAllBtn.addEventListener('click', clearAllBooks);

// Event delegation for delete buttons using bubbling
tableBody.addEventListener('click', handleTableClick);

// Function to handle table click events (Event Bubbling)
function handleTableClick(e) {
	if (e.target.classList.contains('delete-btn')) {
		const index = parseInt(e.target.getAttribute('data-index'));
		deleteBook(index);
	}
}

// Function to add a book
function addBook() {
	const bookName = bookNameInput.value.trim();
	const authorName = authorNameInput.value.trim();

	// Validation
	if (bookName === '') {
		alert('⚠️ Please enter a book name!');
		bookNameInput.focus();
		return;
	}

	if (authorName === '') {
		alert('⚠️ Please enter an author name!');
		authorNameInput.focus();
		return;
	}

	// Create book object
	const book = {
		id: Date.now(), // Unique ID
		name: bookName,
		author: authorName,
	};

	// Add to array
	books.push(book);

	// Save to localStorage
	saveToLocalStorage();

	// Render table
	renderTable();

	// Clear inputs
	bookNameInput.value = '';
	authorNameInput.value = '';
	bookNameInput.focus();
}

// Function to delete a book
function deleteBook(index) {
	if (confirm('Are you sure you want to delete this book?')) {
		books.splice(index, 1);
		saveToLocalStorage();
		renderTable();
	}
}

// Function to render table
function renderTable() {
	tableBody.innerHTML = '';

	if (books.length === 0) {
		tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="4" class="text-center text-muted">No books added yet. Start by adding a book!</td>
            </tr>
        `;
	} else {
		books.forEach((book, index) => {
			const tr = document.createElement('tr');
			tr.innerHTML = `
                <td><strong>${index + 1}</strong></td>
                <td>${escapeHtml(book.name)}</td>
                <td>${escapeHtml(book.author)}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
			tableBody.appendChild(tr);
		});
	}
}

// Function to save books to localStorage
function saveToLocalStorage() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
		console.log('✅ Books saved to localStorage');
	} catch (e) {
		alert('❌ Failed to save books. Storage might be full.');
		console.error('LocalStorage error:', e);
	}
}

// Function to load books from localStorage
function loadFromLocalStorage() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			books = JSON.parse(stored);
			console.log('✅ Books loaded from localStorage');
		} else {
			books = [];
		}
	} catch (e) {
		alert('⚠️ Failed to load books from storage.');
		console.error('LocalStorage error:', e);
		books = [];
	}
}

// Function to clear all books
function clearAllBooks() {
	if (books.length === 0) {
		alert('⚠️ No books to delete!');
		return;
	}

	if (
		confirm(
			'Are you sure you want to delete ALL books? This action cannot be undone.',
		)
	) {
		books = [];
		saveToLocalStorage();
		renderTable();
		alert('✅ All books have been deleted.');
	}
}

// Utility function to escape HTML special characters (security)
function escapeHtml(text) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
	loadFromLocalStorage();
	renderTable();
});

// Optional: Auto-save when page unloads
window.addEventListener('beforeunload', () => {
	saveToLocalStorage();
});
