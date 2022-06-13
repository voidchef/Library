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
