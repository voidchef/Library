const bookCount = document.querySelector(".bookCount");
const totalRead = document.querySelector(".totalRead");
const totalNotRead = document.querySelector(".totalNotRead");
const sortBy = document.querySelector(".sortBy");
const orderBy = document.querySelector(".orderBy");
const table = document.querySelector(".books");
const tbody = document.querySelector("tbody");
const deleteBtn = document.querySelectorAll(".deleteBook");
const statusBtn = document.querySelectorAll(".toggleStatus");
const addBook = document.querySelector(".addBookBtn");
const cancelBtn = document.querySelector(".cancel");
const errMsg = document.querySelector(".errMsg");
const clearBtn = document.querySelector(".clear");
const submitBtn = document.querySelector(".submit");

let myLibrary = [];

class BOOK {
  constructor(id, title, author, pages, status) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }

  toggleStatus(readStatus) {
    this.status = readStatus;
  }
}

const defaultBook = new BOOK(
  "0",
  "Alice in Wonderland",
  "Lewis Carroll",
  "200",
  "NOT READ"
);

function sortLibrary() {
  myLibrary.sort((a, b) => {
    let first, second;
    if (sortBy.value === "pages") {
      first = Number(a[sortBy.value]);
      second = Number(b[sortBy.value]);
    } else {
      first = a[sortBy.value].toUpperCase();
      second = b[sortBy.value].toUpperCase();
    }
    return first == second ? 0 : first > second ? 1 : -1;
  });
}

function orderLibrary() {
  if (orderBy.value === "Descending") myLibrary.reverse();
}

sortBy.addEventListener("change", () => displayLibrary());

orderBy.addEventListener("change", () => displayLibrary());

function resetTable() {
  let rowCount = table.rows.length;

  for (let x = rowCount - 1; x > 0; x--) {
    table.deleteRow(x);
  }
}

function count(status) {
  let count = 0;

  myLibrary.forEach((book) => {
    if (book.status === status) count++;
  });

  return count;
}

function displayLog() {
  bookCount.innerHTML = myLibrary.length;
  totalRead.innerHTML = count("READ");
  totalNotRead.innerHTML = count("NOT READ");
}

function displayLibrary() {
  sortLibrary();
  orderLibrary();
  resetTable();

  myLibrary.forEach((book, indexCount) => {
    const row = document.createElement("tr");

    const title = document.createElement("td");
    title.textContent = book.title;

    const author = document.createElement("td");
    author.textContent = book.author;

    const pages = document.createElement("td");
    pages.textContent = book.pages;

    const status = document.createElement("td");
    const statusBtn = document.createElement("button");
    statusBtn.type = "button";
    statusBtn.classList.add("toggleStatus");
    statusBtn.textContent = book.status;
    status.append(statusBtn);

    statusBtn.addEventListener("click", () => {
      if (book.status === "READ") {
        book.toggleStatus("NOT READ");
        statusBtn.textContent = "NOT READ";
      } else {
        book.toggleStatus("READ");
        statusBtn.textContent = "READ";
      }

      localStorage.clear();
      localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

      displayLog();
    });

    const deleteBook = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.setAttribute("data-index", indexCount++);
    deleteBtn.classList.add("deleteBook");
    deleteBtn.textContent = "DELETE";
    deleteBook.append(deleteBtn);

    deleteBtn.addEventListener("click", () => {
      myLibrary.splice(deleteBtn.dataset.index, 1);
      localStorage.clear();

      if (myLibrary.length !== 0)
        localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

      displayLibrary();
      displayLog();
    });

    row.append(title, author, pages, status, deleteBook);
    tbody.append(row);
  });
}

function popUp(openForm) {
  if (openForm) document.querySelector(".formContainer").style.display = "flex";
  else document.querySelector(".formContainer").style.display = "none";
}

function clearForm() {
  document.querySelector("#bookTitle").value = "";
  document.querySelector("#bookAuthor").value = "";
  document.querySelector("#bookPages").value = "";
  errMsg.textContent = "*fields are mandatory";
  document.getElementById("notRead").checked = true;
}

addBook.addEventListener("click", () => popUp(true));

cancelBtn.addEventListener("click", () => popUp(false));

clearBtn.addEventListener("click", () => clearForm());

function isRead() {
  if (document.getElementById("read").checked)
    return document.getElementById("read").value;
  else if (document.getElementById("notRead").checked)
    return document.getElementById("notRead").value;
}

function getInput() {
  const id = Math.random() * (100 - 1 + 1) + 1;
  const title = document.querySelector("#bookTitle").value;
  const author = document.querySelector("#bookAuthor").value;
  const pages = document.querySelector("#bookPages").value;
  const status = isRead();

  const newBook = new BOOK(id, title, author, pages, status);

  return newBook;
}

function validateInput(book) {
  let valid = true;

  if (!book.title.length) {
    errMsg.textContent = "Book Title is empty";
    valid = false;
  } else if (!book.author.length) {
    errMsg.textContent = "Book Author is empty";
    valid = false;
  } else if (!book.pages.length) {
    errMsg.textContent = "Book Pages is empty";
    valid = false;
  }

  return valid;
}

function addBookToLibrary(newBook) {
  if (myLibrary.some((book) => book.title == newBook.title)) return false;
  else {
    myLibrary.push(newBook);
    return true;
  }
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let book = getInput();

  if (validateInput(book)) {
    if (addBookToLibrary(book)) {
      localStorage.clear();
      localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

      popUp(false);
      clearForm();
      displayLibrary();
      displayLog();
    } else {
      errMsg.textContent =
        "A book with this title already exists in the library";
    }
  }
});

if (!localStorage.getItem("myLibrary")) myLibrary.push(defaultBook);
else {
  myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  myLibrary.forEach((book) => (book.__proto__ = new BOOK()));
}

displayLibrary();
displayLog();
