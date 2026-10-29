import React from "react";

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  if (!content) {
    return <p className="text-slate-400 italic text-xs">No content to preview.</p>;
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inBulletList = false;
  let bulletItems: string[] = [];
  let inOrderedList = false;
  let orderedItems: string[] = [];

  const flushLists = () => {
    if (inBulletList && bulletItems.length > 0) {
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="my-4 space-y-2 pl-5 list-disc text-slate-700 leading-relaxed text-sm sm:text-base marker:text-easyva-purple-600"
        >
          {bulletItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
      bulletItems = [];
      inBulletList = false;
    }

    if (inOrderedList && orderedItems.length > 0) {
      elements.push(
        <ol
          key={`ol-${elements.length}`}
          className="my-4 space-y-2 pl-5 list-decimal text-slate-700 leading-relaxed text-sm sm:text-base marker:font-bold marker:text-easyva-purple-700"
        >
          {orderedItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ol>
      );
      orderedItems = [];
      inOrderedList = false;
    }
  };

  const parseInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-purple-50 text-easyva-purple-700 px-1.5 py-0.5 rounded font-mono text-xs font-semibold border border-purple-200/60">$1</code>'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-easyva-purple-600 underline hover:text-easyva-purple-800 font-semibold" target="_blank" rel="noopener noreferrer">$1</a>'
      );
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushLists();
      continue;
    }

    // Horizontal Rule
    if (line === "---" || line === "***" || line === "___") {
      flushLists();
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-slate-200/80" />
      );
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      flushLists();
      const text = line.replace("# ", "");
      elements.push(
        <h1
          key={`h1-${i}`}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-8 mb-4 leading-tight"
        >
          {text}
        </h1>
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      flushLists();
      const text = line.replace("## ", "");
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      elements.push(
        <h2
          id={id}
          key={`h2-${i}`}
          className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-10 mb-3 pt-4 border-t border-slate-100 flex items-center gap-2"
        >
          <span className="w-1.5 h-5 rounded-full bg-easyva-purple-600 inline-block shrink-0"></span>
          <span>{text}</span>
        </h2>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      flushLists();
      const text = line.replace("### ", "");
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2 text-easyva-purple-950 flex items-center gap-1.5"
        >
          <span className="text-easyva-purple-500 font-mono text-sm">▸</span>
          <span>{text}</span>
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      flushLists();
      const text = line.replace("> ", "");
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 p-4 border-l-4 border-easyva-purple-600 bg-purple-50/60 rounded-r-2xl text-slate-700 italic text-sm sm:text-base leading-relaxed"
        >
          <span dangerouslySetInnerHTML={{ __html: parseInline(text) }} />
        </blockquote>
      );
      continue;
    }

    // Bullet List
    if (line.startsWith("- ") || line.startsWith("* ")) {
      inBulletList = true;
      bulletItems.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Ordered List (1. 2. etc.)
    if (/^\d+\.\s+/.test(line)) {
      inOrderedList = true;
      orderedItems.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }

    // Regular Paragraph
    flushLists();
    elements.push(
      <p
        key={`p-${i}`}
        className="my-3.5 text-slate-700 text-sm sm:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parseInline(line) }}
      />
    );
  }

  flushLists();

  return <div className={`prose-clean space-y-1 ${className}`}>{elements}</div>;
}

