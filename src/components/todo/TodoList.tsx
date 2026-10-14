"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { db } from "@/lib/firebase";
import { Todo } from "@/types/todo";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { filter } = useSelector((state: RootState) => state.ui);

  // 💡 [과제 4] onSnapshot으로 "todos" 컬렉션을 실시간 구독하세요.
  // createdAt 기준 내림차순(desc) 정렬
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoData: Todo[] = snapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Omit<Todo, "id">),
      }));

      setTodos(todoData);
    });

    return unsubscribe;
  }, []);

  // 💡 [과제 6] 완료/미완료 토글
  const handleToggle = async (todo: Todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      isDone: !todo.isDone,
    });
  };

  // 💡 [추가 과제 1] 할 일 삭제
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  // Redux filter 상태로 목록 필터링
  const filtered = todos.filter((t) => {
    if (filter === "진행 중") return !t.isDone;
    if (filter === "완료") return t.isDone;
    return true;
  });

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {filtered.map((todo) => (
        <li
          key={todo.id}
          onClick={() => handleToggle(todo)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            marginBottom: "10px",
            backgroundColor: "white",
            border: "1px solid #eee",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            textDecoration: todo.isDone ? "line-through" : "none",
            opacity: todo.isDone ? 0.5 : 1,
          }}
        >
          <span>{todo.isDone ? "✅" : "⬜"}</span>

          <span style={{ flex: 1 }}>{todo.text}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(todo.id);
            }}
          >
            삭제
          </button>
        </li>
      ))}

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>항목이 없습니다.</p>
      )}
    </ul>
  );
}
