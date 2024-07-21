export interface Book {
  id: number;
  title: string;
  form: string;
  isbn: string;
  summary: string;
  detail: string;
  author: string;
  pages: number;
  contents: string;
  price: number;
  likes: number;
  publishedAt: string;
  imageId: number;
  categoryId: number;
}

export interface BookDetail extends Book {
  categoryName: string;
  liked: boolean;
}
