import { render, screen } from "@testing-library/react";
import Title from "./Title";
import { BookStoreThemeProvider } from "../../context/themeContext";

describe("Title 컴포넌트 테스트", () => {
  it("랜더를 확인", () => {
    // 1 렌더
    render(
      <BookStoreThemeProvider>
        <Title size="large">Home</Title>
      </BookStoreThemeProvider>
    );

    // 2 확인
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("size props 적용", () => {
    const { container } = render(
      <BookStoreThemeProvider>
        <Title size="large">Home</Title>
      </BookStoreThemeProvider>
    );

    expect(container?.firstChild).toHaveStyle({
      fontSize: "2rem",
    });
  });

  it("color props 적용", () => {
    const { container } = render(
      <BookStoreThemeProvider>
        <Title size="large" color="primary">
          Home
        </Title>
      </BookStoreThemeProvider>
    );

    expect(container?.firstChild).toHaveStyle({
      color: "brown",
    });
  });
});
