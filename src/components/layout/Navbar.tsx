"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleTheme, setFilter } from "@/store/todoSlice";
import { FilterType } from "@/types/todo";
import Link from "next/link";

const FILTERS: FilterType[] = ["all", "진행 중", "완료"];

export default function Navbar() {
  const dispatch = useDispatch();

  // Redux 스토어에서 theme과 filter를 가져옵니다.
  const { theme, filter } = useSelector((state: RootState) => state.ui);

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <strong>TodoFlow</strong>

      {/* 필터 버튼 */}
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => dispatch(setFilter(f))}
          style={{
            fontWeight: filter === f ? "bold" : "normal",
            textDecoration: filter === f ? "underline" : "none",
          }}
        >
          {f === "all" ? "전체" : f}
        </button>
      ))}

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: "16px",
        }}
      >
        <Link href="/">목록</Link>
        <Link href="/completed">완료</Link>

        <button onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}
