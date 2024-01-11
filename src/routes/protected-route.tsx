import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  //children: 컴포넌트 내부의 모든 것
  children: React.ReactNode;
}) {
  //firebase에 유저 정보를 요청
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login"></Navigate>;
  }
  return children;
}
