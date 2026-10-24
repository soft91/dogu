import { useEffect, useMemo, useRef, useState } from "react";
import { categories, formatCall, functions } from "./functions";

const stringify = (value: unknown) => {
  if (value === undefined) return "undefined";
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value, null, 2);
};

export function App() {
  const [page, setPage] = useState<"playground" | "getting-started">("playground");
  const [category, setCategory] = useState("String");
  const available = useMemo(
    () => functions.filter((item) => item.category === category),
    [category],
  );
  const [functionName, setFunctionName] = useState("slugify");
  const selected = available.find((item) => item.name === functionName) ?? available[0]!;
  const [input, setInput] = useState(() => JSON.stringify(selected.example, null, 2));
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFunctionMenuOpen, setIsFunctionMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const functionMenuRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return available;
    return functions.filter((item) =>
      `${item.name} ${item.description}`.toLocaleLowerCase().includes(query),
    );
  }, [available, searchQuery]);

  useEffect(() => {
    setFunctionName(available[0]!.name);
  }, [category, available]);

  useEffect(() => {
    setInput(JSON.stringify(selected.example, null, 2));
    setResult("");
    setError("");
  }, [selected]);

  useEffect(() => {
    const closeWhenClickedOutside = (event: MouseEvent) => {
      if (!functionMenuRef.current?.contains(event.target as Node)) setIsFunctionMenuOpen(false);
    };
    document.addEventListener("mousedown", closeWhenClickedOutside);
    return () => document.removeEventListener("mousedown", closeWhenClickedOutside);
  }, []);

  const run = async () => {
    try {
      const args: unknown = JSON.parse(input);
      if (!Array.isArray(args)) throw new Error("입력 최상위 값은 인수 배열이어야 합니다.");
      const output = await selected.run(...args);
      setResult(stringify(output));
      setError("");
    } catch (cause) {
      setResult("");
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  };

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText("pnpm add dogu");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const selectFunction = (item: (typeof functions)[number]) => {
    setCategory(item.category);
    setFunctionName(item.name);
    setSearchQuery("");
    setIsFunctionMenuOpen(false);
  };

  return (
    <main>
      <header className="hero">
        <div className="brand"><span className="mark">⌁</span><span>dogu</span></div>
        <div className="global-search">
          <div className="global-search-input">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="함수명 또는 설명으로 검색"
              aria-label="함수명 또는 설명으로 검색"
            />
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} aria-label="검색어 지우기">×</button>}
          </div>
          {searchQuery && (
            <div className="global-search-results" aria-live="polite">
              {searchResults.length ? searchResults.map((item) => (
                <button type="button" key={item.name} onClick={() => selectFunction(item)}>
                  <span><b>{item.name}</b><small>{item.description}</small></span><em>{item.category}</em>
                </button>
              )) : <p>일치하는 함수가 없습니다.</p>}
            </div>
          )}
        </div>
      </header>

      <section className="workspace">
        <nav className="categories" aria-label="유틸리티 카테고리">
          <button className={`getting-menu ${page === "getting-started" ? "active" : ""}`} onClick={() => setPage("getting-started")}>
            <span>시작하기</span><small>↗</small>
          </button>
          {categories.map((item) => (
            <button className={page === "playground" && item === category ? "active" : ""} key={item} onClick={() => { setCategory(item); setPage("playground"); }}>
              <span>{item}</span><small>{String(functions.filter((fn) => fn.category === item).length).padStart(2, "0")}</small>
            </button>
          ))}
        </nav>

        {page === "getting-started" ? (
          <section className="getting-page">
            <span className="path">DOGU / GETTING STARTED</span>
            <h2>설치하고 사용하기</h2>
            <p>Dogu는 필요한 유틸리티만 가져와 사용할 수 있는 TypeScript 유틸리티 모음입니다.</p>
            <div className="guide-step"><span>01</span><div><b>패키지 설치</b><code>pnpm add dogu</code><button type="button" onClick={() => void copyInstallCommand()}>{copied ? "복사됨" : "복사"}</button></div></div>
            <div className="guide-step"><span>02</span><div><b>필요한 함수 가져오기</b><code>import {`{ unique }`} from "dogu/array"</code></div></div>
            <div className="guide-step"><span>03</span><div><b>함수 사용</b><code>const values = unique([1, 1, 2])</code></div></div>
          </section>
        ) : <div className="runner">
          <div className="runner-head">
            <div>
              <span className="path">PACKAGE / DOGU / {category.toUpperCase()}</span>
              <div className="function-picker" ref={functionMenuRef}>
                <button
                  className="function-trigger"
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isFunctionMenuOpen}
                  onClick={() => setIsFunctionMenuOpen((open) => !open)}
                >
                  <span>{selected.name}</span><i aria-hidden="true" />
                </button>
                {isFunctionMenuOpen && (
                  <div className="function-menu" role="listbox" aria-label={`${category} 함수 선택`}>
                    {available.map((item) => (
                      <button
                        type="button"
                        role="option"
                        aria-selected={item.name === selected.name}
                        className={`function-option ${item.name === selected.name ? "selected" : ""}`}
                        key={item.name}
                        onClick={() => selectFunction(item)}
                      >
                        <span className="check">✓</span>
                        <span className="function-option-copy"><b>{item.name}</b><small>{item.description}</small></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p>{selected.description}</p>
              <div className="function-docs" aria-label={`${selected.name} 사용 방법`}>
                <div><span>IMPORT</span><code>import {`{ ${selected.name} }`} from "dogu/{category.toLowerCase()}"</code></div>
                <div><span>USAGE</span><code className="usage-code">{selected.usage ?? `const result = ${formatCall(selected.name, selected.example)}`}</code></div>
                {selected.parameters && <div className="parameter-docs"><span>PARAMS</span><dl>{selected.parameters.map((parameter) => <div key={parameter.name}><dt><code>{parameter.name}</code><em>{parameter.type}</em></dt><dd>{parameter.description}</dd></div>)}</dl></div>}
                {selected.returnType && <div className="return-docs"><span>RETURNS</span><code>{selected.returnType}</code></div>}
              </div>
            </div>
            <button className="run" onClick={run}><span className="play">▶</span> 실행 <kbd>⌘ ↵</kbd></button>
          </div>

          <div className="panels">
            <label className="panel">
              <span><b>INPUT</b><small>JSON argument array</small></span>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
            </label>
            <div className={`panel output ${error ? "has-error" : ""}`}>
              <span><b>{error ? "ERROR" : "OUTPUT"}</b><small>{result ? "complete" : "waiting for execution"}</small></span>
              <pre>{error || result || "// 실행 결과가 여기에 표시됩니다."}</pre>
            </div>
          </div>
        </div>}
      </section>

      <footer><span>dogu <b>v0.1.0</b></span><a href="https://github.com/soft91/Dogu">GitHub ↗</a></footer>
    </main>
  );
}
