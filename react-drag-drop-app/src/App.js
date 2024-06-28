import "./App.css";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const finalSpaceCharacters = [
  {
    id: "gary",
    name: "Gary Goodspeed",
  },
  {
    id: "cato",
    name: "Little Cato",
  },
  {
    id: "kvn",
    name: "KVN",
  },
];

function App() {
  const [characters, setCharacters] = useState(finalSpaceCharacters);

  const handleEnd = (result) => {
    console.log(result);

    // 목적지가 없으면 이 함수를 종료
    if (!result.destination) return;

    const items = Array.from(characters);

    const [reorderedItem] = items.splice(result.source.index, 1);

    // 원하는 자리에 reorderedItem을 insert
    items.splice(result.destination.index, 0, reorderedItem);
    setCharacters(items);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Final Space Characters</h1>

        <DragDropContext onDragEnd={handleEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul
                className="characters"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {characters.map(({ id, name }, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{name}</p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  );
}

export default App;
