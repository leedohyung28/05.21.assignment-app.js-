import React from 'react';
import './App.css';
import TodoList from './Todolist';
import Timer from './Timer';
import Clock from './Timer';

function App() {
  let name = "리액트";

  return (
    <div className="container">
      <TodoList></TodoList>
      {/* <Timer></Timer> */}
      <Clock></Clock>
    </div>
  );

}

export default App;
