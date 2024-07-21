import { render, screen } from "@testing-library/react";
import InputText from "./InputText";
import { BookStoreThemeProvider } from "../../context/themeContext";
import React from "react";

describe("InputText 컴포넌트 테스트", () => {
  it("랜더를 확인", () => {
    // 1 렌더
    render(
      <BookStoreThemeProvider>
        <InputText placeholder="여기에 입력"></InputText>
      </BookStoreThemeProvider>
    );

    // 2 확인
    expect(screen.getByPlaceholderText("여기에 입력")).toBeInTheDocument();
  });

  it("forwardRef 테스트", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <BookStoreThemeProvider>
        <InputText ref={ref} placeholder="여기에 입력"></InputText>
      </BookStoreThemeProvider>
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
