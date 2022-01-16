import React, { useRef } from "react";
import slugify from "slugify";

import "../styles.css";

function Sentence({ item, delay }) {
  const audio = useRef();
  const [playing, setPlaying] = React.useState(false);
  const playAudio = () => {
    setTimeout(() => {
      setPlaying(true);
      audio.current.play();
      audio.current.playbackRate = Math.random() * 1.5 + 0.5;
      audio.current.volume = Math.random() * 0.5 + 0.5;
    }, delay);
  };
  React.useEffect(() => playAudio());
  return (
    <React.Fragment>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={item.href}
        style={{ fontWeight: playing ? "bold" : "inherit", background: playing ? "#333" : "#fff", color: playing ? "#fff" : "#333" }}
      >
        {item.title}.{" "}
      </a>
      <audio src={`/${slugify(item.title, { lower: true })}.mp3`} ref={audio} />
    </React.Fragment>
  );
}

export default function Index({ pageContext }) {
  const [playing, setPlaying] = React.useState(false);
  if (!playing) {
    return (
      <div>
        <p>el nuevo método de los delincuentes</p>
        <button onClick={() => setPlaying(true)}>???</button>
      </div>
    );
  }
  return (
    <p>
      {pageContext.results.map((item, index) => (
        <Sentence key={index} item={item} delay={index * 1000} />
      ))}
    </p>
  );
}
