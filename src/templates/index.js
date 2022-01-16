import React from "react";
import { Howl } from "howler";
import slugify from "slugify";
import Chance from "chance";

import "../styles.css";

const chance = new Chance();

function Voice({ item, delay, setPlaying }) {
  const playVoice = () => {
    const audio = new Howl({
      src: [`${slugify(item.title, { lower: true, strict: true })}.mp3`],
      volume: chance.floating({ min: 0.5, max: 1, fixed: 2 }),
      rate: chance.floating({ min: 0.7, max: 1.5, fixed: 2 }),
      onplay: () => setPlaying(true),
      onend: () => setPlaying(false),
    });
    setTimeout(() => audio.play(), delay);
  };
  React.useEffect(() => playVoice());
  return null;
}

function Text({ item }) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <a target="_blank" rel="noopener noreferrer" href={item.href} style={{ fontWeight: playing ? "bold" : "inherit" }}>
      {item.title}. <Voice item={item} delay={chance.integer({ min: 0, max: 1000 * 100 })} setPlaying={setPlaying} />
    </a>
  );
}

function BackgroundMusic() {
  const playBackgroundMusic = () => {
    const backgroundMusic = new Howl({
      src: ["t13.mp3"],
      loop: true,
      volume: 0.5,
    });
    backgroundMusic.play();
  };
  React.useEffect(() => playBackgroundMusic());
  return null;
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
  const { results } = pageContext;
  return (
    <div>
      <p>
        {results.map((item, index) => (
          <Text key={index} item={item} />
        ))}
      </p>
      <BackgroundMusic />
    </div>
  );
}
