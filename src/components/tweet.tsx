import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 30px 0px;
  font-size: 18px;
  border-radius: 15px;
`;
const EditTweet = styled.textarea`
  background-color: black;
  width: 80%;
  margin: 30px 10px;
  font-size: 18px;
  resize: none;
  border: none;
  color: white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
  }
`;
const Photo = styled.img`
  width: 150px;
  height: 150px;
`;

const EditButton = styled.button`
  color: white;
  font-weight: 600;
  background-color: black;
  border: 1px solid tomato;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 1px solid tomato;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  color: white;
  font-weight: 600;
  background-color: black;
  border: 1px solid tomato;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${id}`
        );
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //
    }
  };
  const [edit, setEdit] = useState(false);
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    try {
      setEdit(true);
    } catch (error) {}
  };
  const [edittedTweet, setTweet] = useState(tweet);
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(event.target.value);
  };
  const onSave = async () => {
    if (!edittedTweet) return;
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: edittedTweet,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEdit(false);
    }
  };
  return (
    <Wrapper>
      {edit ? (
        <Column>
          <EditTweet
            required
            rows={3}
            maxLength={180}
            value={edittedTweet}
            onChange={onChange}
          ></EditTweet>
          <ButtonContainer>
            <SaveButton onClick={onSave}>Save</SaveButton>
          </ButtonContainer>
        </Column>
      ) : (
        <Column>
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
          <ButtonContainer>
          {user?.uid === userId ? (
            <EditButton onClick={onEdit}>Edit</EditButton>
          ) : null}
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          ) : null}
          </ButtonContainer>
        </Column>
      )}
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
