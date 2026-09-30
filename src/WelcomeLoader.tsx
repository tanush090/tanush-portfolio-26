import { useEffect, useState } from "react";
import "./WelcomeLoader.css";

export default function WelcomeLoader() {
  const [visible, setVisible] = useState(true);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);

      setTimeout(() => {
        setVisible(false);
      }, 900);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`welcome-loader ${exit ? "exit" : ""}`}>
      <div className="loader-scene">

        <div className="orb">
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              style={{
                "--i": i,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="welcome-text">
          <span className="welcome">WELCOME</span>
          <span className="name">TANUSH KUMAR</span>
        </div>

        <div className="loader-line" />
      </div>
    </div>
  );
}