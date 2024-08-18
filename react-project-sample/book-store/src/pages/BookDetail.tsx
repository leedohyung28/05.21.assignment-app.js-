import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useBook } from "../hooks/useBook";
import { getImgSrc } from "../utils/image";
import Title from "../components/common/Title";

function BookDetail() {
  const { bookId } = useParams();
  const { book } = useBook(bookId);

  if (!book) return null;

  return (
    <BookDetailStyle>
      <header className="header">
        <div className="img">
          <img src={getImgSrc(book.imageId)} alt={book.title} />
        </div>
        <div className="info">
          <Title size="large" color="text">
            {book.title}
          </Title>
          <dl>
            <dt>카테고리</dt>
            <dd>{book.categoryName}</dd>
          </dl>
        </div>
      </header>
    </BookDetailStyle>
  );
}

const BookDetailStyle = styled.div``;

export default BookDetail;
