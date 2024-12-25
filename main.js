// Setting up the calendar 
const daysInMonth = 30; // Number of days to track (30 days for simplicity)
const calendar = document.getElementById('calendar'); //creates const
const progressText = document.getElementById('progress-text'); //creates const for Progress Bar
const resetButton = document.getElementById('reset-btn'); //creates const for the Reset Button

// Book tracker functionality
const bookInput = document.getElementById('book-input'); //creates const for inputting the book
const addBookBtn = document.getElementById('add-book'); //creates const for button to add books
const bookList = document.getElementById('book-list'); //creates const for the book list that users add
        //DELETE ITEM FROM LIST?

// Notes functionality
const notesInput = document.getElementById('daily-notes'); //creates const for the notes users add
const saveNotesBtn = document.getElementById('save-notes'); //creates const for the note saving button
const savedNotesDiv = document.getElementById('saved-notes'); //creates const for saving the notes
const deleteNotesBtn = document.getElementById('delete-notes'); // Add a button to delete notes

// Function to create the calendar grid
function createCalendar() {
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.dataset.day = i;
        
        dayDiv.addEventListener('click', toggleDay);
        calendar.appendChild(dayDiv);
    }
}

// Function to toggle the 'read' status of a day
function toggleDay(event) {
    const dayDiv = event.target;

    // Toggle the "read" class
    dayDiv.classList.toggle('read');

    updateProgress();
}

// Function to update the progress bar and text
function updateProgress() {
    const totalDays = document.querySelectorAll('.day').length;
    const readDays = document.querySelectorAll('.day.read').length;
    const percentage = (readDays / totalDays) * 100;

    // Update progress text
    progressText.innerText = `${readDays} / ${totalDays}`;
    
    // Update the width of the progress bar
    document.getElementById('progress-text').style.width = `${percentage}%`;
}

// Reset the calendar (clear all readings)
resetButton.addEventListener('click', function() {
    const allDays = document.querySelectorAll('.day');
    allDays.forEach(day => {
        day.classList.remove('read');
    });
    updateProgress();
});

// Initialize the calendar
createCalendar();

const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

// Tab switching functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
        
        // Toggle delete notes button visibility when "Notes" tab is active
        if (tab.dataset.tab === 'notes') {
            deleteNotesBtn.style.display = 'block';
        } else {
            deleteNotesBtn.style.display = 'none';
        }
    });
});

// Load saved notes
const savedNotes = localStorage.getItem('notes') || '';
notesInput.value = savedNotes;

// Save notes
saveNotesBtn.addEventListener('click', () => {
    const notes = notesInput.value;
    localStorage.setItem('notes', notes);
    savedNotesDiv.innerText = `Saved Notes: ${notes}`;
});

// Load saved books
const savedBooks = JSON.parse(localStorage.getItem('books')) || [];
savedBooks.forEach(book => addBookToList(book));

// Add new book
addBookBtn.addEventListener('click', () => {
    const book = bookInput.value.trim();
    if (book) {
        savedBooks.push(book);
        localStorage.setItem('books', JSON.stringify(savedBooks));
        addBookToList(book);
        bookInput.value = '';
    }
});

// Function to add a book to the list
function addBookToList(book) {
    const li = document.createElement('li');
    li.innerText = book;

    // Create delete button for each book
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.classList.add('delete-btn');
    li.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', function() {
        deleteBook(book, li);
    });

    bookList.appendChild(li);
}

// Delete book functionality
function deleteBook(book, li) {
    // Remove book from localStorage
    const index = savedBooks.indexOf(book);
    if (index > -1) {
        savedBooks.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(savedBooks));
    }

    // Remove book from the list in the UI
    li.remove();
}

// Delete notes functionality
deleteNotesBtn.addEventListener('click', () => {
    localStorage.removeItem('notes');
    savedNotesDiv.innerText = 'Saved Notes: None';
    notesInput.value = '';
});
