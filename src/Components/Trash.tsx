import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Wrapper = styled.div<{ isDraggingOver: boolean }>`
  margin-top: 20px;
  width: 50px;
  height: 50px;
  background-color: ${(props) => (props.isDraggingOver ? "tomato" : "#dadfe9")};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  div {
    position: absolute;
  }
`;

function Trash() {
  return (
    <Droppable droppableId="trash">
      {(magic, info) => (
        <Wrapper ref={magic.innerRef} isDraggingOver={info.isDraggingOver}>
          <div>✕</div> {magic.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Trash;
