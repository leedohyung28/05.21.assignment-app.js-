import { render } from "@testing-library/react";
import { BookStoreThemeProvider } from "../../context/themeContext";
import BookItem from "./BookItem";
import { Book } from "../../models/export.model";

const dummyBook: Book = {
  id: 2,
  title: "string",
  form: "string",
  isbn: "string",
  summary: "string",
  detail: "string",
  author: "string",
  pages: 3,
  contents: "string",
  price: 1233,
  likes: 1,
  publishedAt: "2023-01-01",
  imageId: 23,
  categoryId: 1,
};

describe("BookItem", () => {
  it("랜더 여부", () => {
    const { getByText } = render(
      <BookStoreThemeProvider>
        <BookItem book={dummyBook} />
      </BookStoreThemeProvider>
    );

    expect(getByText(dummyBook.title)).toBeInTheDocument();

    expect(getByText(dummyBook.summary)).toBeInTheDocument();

    expect(getByText(dummyBook.author)).toBeInTheDocument();

    expect(getByText(dummyBook.title)).toBeInTheDocument();

    expect(getByText("1233")).toBeInTheDocument();

    expect(getByText(dummyBook.likes)).toBeInTheDocument();

    expect(getByText(dummyBook.title)).toHaveAttribute(
      "src",
      `https://picsum.photos/id/${dummyBook.imageId}/600/600`
    );
  });
});
