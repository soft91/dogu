import { useEffect, useMemo, useState } from "react";
import { categories, functions } from "./functions";

const stringify = (value: unknown) => {
  if (value === undefined) return "undefined";
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value, null, 2);
};

export function App() {
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

  useEffect(() => {
    setFunctionName(available[0]!.name);
  }, [category, available]);

  useEffect(() => {
    setInput(JSON.stringify(selected.example, null, 2));
    setResult("");
    setError("");
  }, [selected]);

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

  return (
    <main>
      <header className="hero">
        <div className="brand"><span className="mark">D</span><span>Dogu</span></div>
        <div className="hero-copy">
          <p className="eyebrow">TYPESCRIPT UTILITY LAB</p>
          <h1>작은 함수도<br /><em>직접 확인하세요.</em></h1>
          <p className="intro">Dogu 유틸리티에 값을 넣고 브라우저에서 바로 결과를 확인하는 공간입니다.</p>
        </div>
        <div className="status"><i /> LIVE PLAYGROUND</div>
      </header>

      <section className="workspace">
        <nav className="categories" aria-label="유틸리티 카테고리">
          {categories.map((item) => (
            <button className={item === category ? "active" : ""} key={item} onClick={() => setCategory(item)}>
              <span>{item}</span><small>{functions.filter((fn) => fn.category === item).length}</small>
            </button>
          ))}
        </nav>

        <div className="runner">
          <div className="runner-head">
            <div>
              <span className="path">dogu/{category.toLowerCase()}</span>
              <select value={selected.name} onChange={(event) => setFunctionName(event.target.value)}>
                {available.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
              <p>{selected.description}</p>
            </div>
            <button className="run" onClick={run}>실행 <span>⌘ ↵</span></button>
          </div>

          <div className="panels">
            <label className="panel">
              <span><b>INPUT</b><small>JSON 인수 배열</small></span>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} />
            </label>
            <div className={`panel output ${error ? "has-error" : ""}`}>
              <span><b>{error ? "ERROR" : "OUTPUT"}</b><small>{result ? "실행 완료" : "결과 대기 중"}</small></span>
              <pre>{error || result || "실행 버튼을 눌러 결과를 확인하세요."}</pre>
            </div>
          </div>
        </div>
      </section>

      <footer><span>dogu <b>v0.1.0</b></span><a href="https://github.com/soft91/Dogu">GitHub ↗</a></footer>
    </main>
  );
}
