import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import Trash from "./Components/Trash";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

interface IForm {
  category: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  useEffect(() => {
    if (localStorage.getItem("allBoards")) {
      setToDos(() => {
        return JSON.parse(localStorage.getItem("allBoards") || "");
      });
    }
  }, []);
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        const newAllBoards = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        return newAllBoards;
      });
    }

    if (destination?.droppableId === "trash") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        const newAllBoards = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        return newAllBoards;
      });
    } else if (destination?.droppableId !== source.droppableId) {
      if (!destination) return;
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination?.droppableId]];
        const sourceObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, sourceObj);
        const newAllBoards = {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination?.droppableId]: destinationBoard,
        };
        localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        return newAllBoards;
      });
    }
  };
  const onValid = ({ category }: IForm) => {
    setToDos((allBoards) => {
      const newBoards = { ...allBoards, [category]: [] };
      localStorage.setItem("allBoards", JSON.stringify(newBoards));
      return newBoards;
    });
    setValue("category", "");
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("category", { required: true })}
            type="text"
            placeholder="Add Category"
          />
        </form>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
        <Trash />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
