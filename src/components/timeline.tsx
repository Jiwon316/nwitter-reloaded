import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
display:flex;
gap: 10px;
flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe : Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { photo, tweet, userId, username, createdAt } = doc.data();
      //   return {
      //     photo,
      //     tweet,
      //     userId,
      //     username,
      //     createdAt,
      //     id: doc.id,
      //   };
      // });
      
      //문서를 한번만 가져오는 대신 쿼리에 리스너를 추가함
      //무언가 삭제, 편집 또는 생성되었다는 알림을 받으면 해당 쿼리의 문서에서 필요한 데이터를 추가
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) =>{
        const tweets = snapshot.docs.map((doc) => {
            const { photo, tweet, userId, username, createdAt } = doc.data();
            return {
              photo,
              tweet,
              userId,
              username,
              createdAt,
              id: doc.id,
            };
          });
          setTweets(tweets);
      });
    };
    fetchTweets();
    return () =>{
      unsubscribe && unsubscribe();
    }
  },[]);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
