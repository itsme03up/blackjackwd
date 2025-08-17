import React from "react";
// Markdown表示用
import ReactMarkdown from "react-markdown";
// Markdownファイルの内容をimport
import kaihatsunikkiMd from "./kaihatsunikki.md?raw";
import Layout from "@/components/layout";

export default function Log() {
  return (
    <Layout>
      <main className="max-w-3xl mx-auto pt-12 pl-4 pr-4 text-left">
        <h1 className="text-2xl font-bold mb-4">開発日記</h1>
        <div className="prose prose-invert text-left">
          <ReactMarkdown>{kaihatsunikkiMd}</ReactMarkdown>
        </div>
      </main>
    </Layout>
  );
}
