export let books = [];

const generatePrice = (bookId) => {
  let sum = 0;
  for (let i = 0; i < bookId.length; i++) {
    sum += bookId.charCodeAt(i);
  }
  return (sum % 90 + 10) * 100;
};

export const loadBooks = async () => {
  try {
    const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=40");
    const booksData = await response.json();
  
    books = booksData.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title || "No Title",
      priceCents: generatePrice(item.id),
      authors: item.volumeInfo.authors || ["Unknown Author"],
      description: item.volumeInfo.description || "No Description",
      cover: item.volumeInfo.imageLinks?.thumbnail || "No Image",
      publishedDate: item.volumeInfo.publishedDate || "Unknown Date",
      category: item.volumeInfo.categories || "No Cateogry",
      publisher: item.volumeInfo.publisher || "Unknown Publisher",
      pageCount: item.volumeInfo.pageCount || "Undefined",
    }));

  } catch (error) {
    console.error("Unexpected error!", error);
  }
};

export const getBook = (bookId) => {
  let matchingBook;

  books.forEach(book => {
    if(book.id === bookId) {
      matchingBook = book;
    }
  });

  return matchingBook;
};

export const calculatePrice = (price) => {
  return (price / 100).toFixed(2);
};