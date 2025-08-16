// src/components/CopyButton.tsx
import { useState } from "react";
export function CopyButton({ text, className="" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false), 1200); }}
      className={`px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 ${className}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
