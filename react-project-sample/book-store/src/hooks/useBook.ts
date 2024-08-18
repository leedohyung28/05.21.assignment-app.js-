import { useEffect, useState } from "react";
import { BookDetail } from "../models/export.model";
import { fetchBook } from "../api/books.api";

export const useBook = (bookId: string) => {
  const [book, setBook] = useState<BookDetail | null>(null);

  useEffect(() => {
    fetchBook(bookId).then((book) => {
      setBook(book);
    });
  });

  return { book };
};
