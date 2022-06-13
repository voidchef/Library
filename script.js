const bookCount = document.querySelector(".bookCount");
const totalRead = document.querySelector(".totalRead");
const totalNotRead = document.querySelector(".totalNotRead");
const sortBy = document.querySelector(".sortBy");
const orderBy = document.querySelector(".orderBy");
const table = document.querySelector(".books");
const tbody = document.querySelector("tbody");
const addBook = document.querySelector(".addBookBtn");

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

addBook.addEventListener("click", () => popUp(true));

cancelBtn.addEventListener("click", () => popUp(false));

if (!localStorage.getItem("myLibrary")) myLibrary.push(defaultBook);
else {
  myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
  myLibrary.forEach((book) => (book.__proto__ = new BOOK()));
}

displayLibrary();
displayLog();
