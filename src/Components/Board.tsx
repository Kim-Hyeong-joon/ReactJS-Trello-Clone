import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 10px;
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#def6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
  border-radius: 5px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    all: unset;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    width: 100%;
    background-color: white;
    border-radius: 5px;
    width: 80%;
    padding: 3px;
    padding-left: 5px;
    box-shadow: 0 0 5px 0.1px rgba(0, 0, 0, 0.5);
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 10px;
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const setToDos = useSetRecoilState(toDoState);
  const onValid = ({ toDo }: IForm) => {
    const newToDo = { id: Date.now(), text: toDo };
    setToDos((allBoards) => {
      const newAllBoards = {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
      localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
      return newAllBoards;
    });
    setValue("toDo", "");
  };
  const handleClick = () => {
    setToDos((allBoards) => {
      const boardsCopy = { ...allBoards };
      delete boardsCopy[boardId];
      localStorage.setItem("allBoards", JSON.stringify(boardsCopy));
      return boardsCopy;
    });
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <DeleteBtn onClick={handleClick}>X</DeleteBtn>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                toDoId={toDo.id}
                index={index}
                toDoText={toDo.text}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
