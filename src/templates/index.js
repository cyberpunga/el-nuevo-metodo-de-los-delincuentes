import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Text, PositionalAudio, useIntersect, Loader } from "@react-three/drei";
import * as THREE from "three";
import create from "zustand";

import oswald from "@fontsource/oswald/files/oswald-latin-700-normal.woff";
import lora from "@fontsource/lora/files/lora-latin-700-normal.woff";
import merriweather from "@fontsource/merriweather/files/merriweather-latin-900-normal.woff";
import montserrat from "@fontsource/montserrat/files/montserrat-latin-900-normal.woff";

const useStore = create((set) => ({
  audio: false,
  toggle: () => set((state) => ({ audio: !state.audio })),
}));

const fonts = [oswald, lora, merriweather, montserrat];
const colors = ["#e71d36", "#e85d04", "#fb8b24", "#faa307", "#ffba08", "#f4d35e", "#fef9ef"];
const yDistance = 0.32;

function Words({ children, ...props }) {
  const sound = useRef();
  const ref = useIntersect(() => {
    if (sound.current && !sound.current.isPlaying) {
      sound.current.play();
    }
  });
  return (
    <React.Fragment>
      <Text {...props} fontSize={1} letterSpacing={-0.05} lineHeight={1}>
        {children}
      </Text>
      <mesh ref={ref} position={props.position}>
        <planeBufferGeometry attach="geometry" args={[0, 0]} />
        <meshBasicMaterial attach="material" color="white" />
      </mesh>
      <Suspense fallback={null}>
        <PositionalAudio
          ref={sound}
          distance={1}
          url={props.audio}
          position={props.position}
          autoplay={false}
          loop={false}
        />
      </Suspense>
    </React.Fragment>
  );
}

function Poem({ results }) {
  const scroll = useScroll();
  const group = useRef();
  const { viewport } = useThree();
  useFrame(({ camera, mouse }, delta) => {
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, mouse.x * -0.4, 0.1);
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, mouse.y * 0.4, 0.1);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, Math.max(0, scroll.delta * 10), 4, delta);
  });

  const withPositions = results.map((item, index) => {
    const x = THREE.MathUtils.randFloatSpread(8);
    const y = -viewport.height * index * yDistance;
    const z = Math.sin(index) * -2;
    return {
      ...item,
      position: [x, y, z],
      font: fonts[Math.floor(Math.random() * fonts.length)],
      maxWidth: viewport.width * Math.random(),
      color: colors.slice(1)[Math.floor(Math.random() * colors.slice(1).length)],
    };
  });

  const last = JSON.parse(JSON.stringify(withPositions.slice(-4))).map((el) => {
    el.position[1] = el.position[1] + viewport.height * withPositions.length * yDistance;
    return el;
  });

  const first = JSON.parse(JSON.stringify(withPositions.slice(0, 4))).map((el) => {
    el.position[1] = el.position[1] - viewport.height * withPositions.length * yDistance;
    return el;
  });

  const all = last.concat(withPositions.concat(first));

  return (
    <group ref={group} position={[0, 0, 0]}>
      {all.map((el, idx) => {
        return (
          <Words key={idx} {...el}>
            {el.title}
          </Words>
        );
      })}
    </group>
  );
}

export default function Index({ pageContext }) {
  const { results } = pageContext;
  const { audio } = useStore();
  if (!audio) {
    return <Intro />;
  }
  return (
    <React.Fragment>
      <Loader />
      <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        <ScrollControls infinite damping={4} pages={results.length * yDistance + 1} distance={1.5}>
          <Scroll>
            <Poem results={results} />
          </Scroll>
        </ScrollControls>
        <color attach="background" args={[colors[0]]} />
      </Canvas>
    </React.Fragment>
  );
}

function Intro() {
  const { toggle } = useStore();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        background: "#222222",
        color: "#eeeeee",
        display: "flex",
        placeItems: "center",
        fontFamily: "monospace",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      <div style={{ margin: "auto", padding: "2em", maxWidth: 480, display: "flex", flexDirection: "column" }}>
        <p style={{ textAlign: "justify" }}>
          Este proyecto utiliza la API de Web Audio para reproducir sonido, por lo que necesita alguna interacción
          previa de tu parte.
          <br />
          <br />
          Dicho esto, continúa cuando gustes.
        </p>
        <button
          style={{
            background: "#222222",
            color: "#eeeeee",
            border: "3px solid #eeeeee",
            padding: "1em",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "24px",
            fontWeight: "bold",
          }}
          onClick={() => toggle()}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
