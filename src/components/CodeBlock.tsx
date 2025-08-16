// src/components/CodeBlock.tsx
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import oneDark  from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark';


export function CodeBlock({ code, lang = 'txt' }: { code: string; lang?: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <SyntaxHighlighter language={lang} style={oneDark} customStyle={{ margin: 0, background: 'transparent' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}


