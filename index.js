let books = [];
const RENDER_EVENT = 'render-book';

// Utility function to get HTML elements by ID
function getById(id) {
    return document.getElementById(id);
}

// Utility function to create an HTML element
function createElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

// Utility function to create a book view
function createBookView(bookObject) {
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.appendChild(createElement('h3', bookObject.title));
    textContainer.appendChild(createElement('p', `Penulis: ${bookObject.author}`));
    textContainer.appendChild(createElement('p', `Tahun: ${bookObject.year}`));

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const moveButton = document.createElement('button');
    moveButton.textContent = bookObject.isCompleted ? 'Belum selesai dibaca' : 'Selesai dibaca';
    moveButton.classList.add(bookObject.isCompleted ? 'green' : 'blue');
    moveButton.style.backgroundColor = 'green';
    moveButton.style.color = 'white';
    moveButton.style.padding = '8px';
    moveButton.addEventListener('click', () => toggleBookStatus(bookObject.id));
    actionContainer.appendChild(moveButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', () => removeBook(bookObject.id));
    actionContainer.appendChild(deleteButton);

    container.appendChild(textContainer);
    container.appendChild(actionContainer);

    return container;
}

// Utility function to update the book view
function updateBookView() {
    const incompleteBooksList = getById('incompleteBookshelfList');
    const completeBooksList = getById('completeBookshelfList');

    incompleteBooksList.innerHTML = '';
    completeBooksList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = createBookView(bookItem);
        if (bookItem.isCompleted) {
            bookElement.querySelector('button').classList.add('green');
            completeBooksList.appendChild(bookElement);
        } else {
            incompleteBooksList.appendChild(bookElement);
        }
    }
}

// Function to add a new book
function addBook() {
    const titleBook = getById('inputBookTitle').value;
    const authorBook = getById('inputBookAuthor').value;
    const yearBook = parseInt(getById('inputBookYear').value); // Mengubah tipe data year menjadi number
    const isCompleted = getById('inputBookIsComplete').checked;

    const generatedID = Date.now();
    const bookObject = {
        id: generatedID,
        title: titleBook,
        author: authorBook,
        year: yearBook,
        isCompleted: isCompleted // Merubah nama properti menjadi isCompleted
    };

    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    // Reset input form
    getById('inputBookTitle').value = '';
    getById('inputBookAuthor').value = '';
    getById('inputBookYear').value = '';
    getById('inputBookIsComplete').checked = false;

    // Save data to local storage
    saveBooksData();
}

// Function to toggle the status of a book (completed or not)
function toggleBookStatus(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].isCompleted = !books[bookIndex].isCompleted;
        document.dispatchEvent(new Event(RENDER_EVENT));

        // Save data to local storage
        saveBooksData();
    }
}

// Function to remove a book by ID
function removeBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));

        // Menyimpan data ke local storage
        saveBooksData();
    }
}

// Function to search for books by title
function searchBooks(event) {
    event.preventDefault();
    const query = getById('searchBookTitle').value.toLowerCase();

    const allBookElements = document.querySelectorAll('.item.shadow');
    allBookElements.forEach(bookElement => {
        const title = bookElement.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            bookElement.style.display = 'block'; // Menampilkan buku yang sesuai dengan pencarian
        } else {
            bookElement.style.display = 'none'; // Menyembunyikan buku yang tidak sesuai dengan pencarian
        }
    });
}

// Adding an event listener for the search form
getById('searchBook').addEventListener('submit', searchBooks);

// Function to save book data to local storage
function saveBooksData() {
    localStorage.setItem('books', JSON.stringify(books));
}

// Function to load book data from local storage
function loadBooksData() {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
        books = JSON.parse(storedBooks);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// Adding an event listener when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    getById('inputBook').addEventListener('submit', event => {
        event.preventDefault();
        addBook();
    });

    loadBooksData();
});

// Adding an event listener when the page is unloaded (to save data)
window.addEventListener('unload', () => {
    saveBooksData();
});

// Adding an event listener to update the book view
document.addEventListener(RENDER_EVENT, updateBookView);

// Fungsi untuk mencari buku berdasarkan judul
