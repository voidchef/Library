const table = document.querySelector(".books");
const tbody = document.querySelector("tbody");
const bookCount = document.querySelector(".bookCount");
const totalRead = document.querySelector(".totalRead");
const totalNotRead = document.querySelector(".totalNotRead");

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
