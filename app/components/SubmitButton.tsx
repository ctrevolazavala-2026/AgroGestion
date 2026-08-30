"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-green-700 px-4 py-3 text-base font-medium text-white active:bg-green-800 disabled:opacity-60"
    >
      {pending ? "Guardando…" : children}
    </button>
  );
}
