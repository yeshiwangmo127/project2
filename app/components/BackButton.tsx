"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center px-4 py-2 mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Go back"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
} 