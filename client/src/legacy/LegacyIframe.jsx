import { useEffect, useMemo, useState } from "react";

export default function LegacyIframe({ src, title }) {
  const [front, setFront] = useState("a"); // "a" | "b"
  const [pending, setPending] = useState(null); // null | "a" | "b"
  const [srcA, setSrcA] = useState(src);
  const [srcB, setSrcB] = useState(null);

  useEffect(() => {
    if (!src) return;
    const current = front === "a" ? srcA : srcB;
    if (src === current) return;

    const back = front === "a" ? "b" : "a";
    if (back === "a") setSrcA(src);
    else setSrcB(src);
    setPending(back);
  }, [src, front, srcA, srcB]);

  const frameStyle = useMemo(
    () => ({
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      border: 0,
      display: "block",
      background: "transparent",
      transition: "opacity 160ms ease-out",
    }),
    [],
  );

  const onLoadA = () => {
    if (pending !== "a") return;
    setFront("a");
    setPending(null);
  };

  const onLoadB = () => {
    if (pending !== "b") return;
    setFront("b");
    setPending(null);
  };

  const opacityA = front === "a" ? 1 : 0;
  const opacityB = front === "b" ? 1 : 0;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      {srcA ? (
        <iframe
          title={title || "Legacy preview"}
          src={srcA}
          style={{ ...frameStyle, opacity: opacityA }}
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={pending === "a" ? onLoadA : undefined}
        />
      ) : null}

      {srcB ? (
        <iframe
          title={title || "Legacy preview"}
          src={srcB}
          style={{ ...frameStyle, opacity: opacityB }}
          loading="eager"
          referrerPolicy="no-referrer"
          onLoad={pending === "b" ? onLoadB : undefined}
        />
      ) : null}
    </div>
  );
}
