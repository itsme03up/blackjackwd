import React from "react";
import Layout from "@/components/layout";

// Markdown表示用
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

// Markdownファイルの内容をimport
import kaihatsunikkiMd from "./kaihatsunikki.md?raw";

export default function Kaihatsunikki() {
  return (
    <Layout>
      <main className="max-w-3xl mx-auto p-6 pt-20">
        <h1 className="text-2xl font-bold mb-4">開発日記</h1>
        <div className="prose prose-invert">
          <ReactMarkdown>{kaihatsunikkiMd}</ReactMarkdown>
        </div>
      </main>
    </Layout>
  );
}
