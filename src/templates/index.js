import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Text, /* PositionalAudio, */ OrbitControls } from "@react-three/drei";
import React, { /* useEffect, useState, */ useRef, Suspense } from "react";
import * as THREE from "three";

import oswald from "@fontsource/oswald/files/oswald-latin-700-normal.woff";
import lora from "@fontsource/lora/files/lora-latin-700-normal.woff";
import merriweather from "@fontsource/merriweather/files/merriweather-latin-900-normal.woff";
import montserrat from "@fontsource/montserrat/files/montserrat-latin-900-normal.woff";

const pickRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const fonts = [oswald, lora, merriweather, montserrat];

function Word({ children, ...props }) {
  // const color = new THREE.Color();
  const fontProps = {
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref = useRef();
  // const [hovered, setHovered] = useState(false);
  // const over = (e) => (e.stopPropagation(), setHovered(true));
  // const out = () => setHovered(false);
  // Change the mouse cursor on hover
  // useEffect(() => {
  //   if (hovered) document.body.style.cursor = "pointer";
  //   return () => (document.body.style.cursor = "auto");
  // }, [hovered]);
  // Tie component to the render-loop
  // useFrame(({ camera }) => {
  //   // Make text face the camera
  //   ref.current.quaternion.copy(camera.quaternion);
  //   // Animate font color
  //   ref.current.material.color.lerp(color.set(hovered ? "#fa2720" : "white"), 0.1);
  // });
  return (
    <React.Fragment>
      <Text
        ref={ref}
        // onPointerOver={over}
        // onPointerOut={out}
        // onClick={() => window.open(props.href, "_blank").focus()}
        {...props}
        {...fontProps}
        children={children}
      />
      {/* <PositionalAudio autoplay position={props.position} url={props.audio} /> */}
    </React.Fragment>
  );
}

function Content({ results }) {
  const data = useScroll();
  const ref = useRef();
  const { viewport } = useThree();
  useFrame((state, delta) => {
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, Math.max(0, data.delta * 1000), 4, delta);
  });
  return (
    <group ref={ref}>
      {results.map((item, index) => {
        console.log(item);
        const randomProps = {
          position: [
            index === 0 ? 0 : THREE.MathUtils.randFloatSpread(4),
            index === 0 ? 0 : -viewport.height * index * 0.25,
            index === 0 ? -4 : THREE.MathUtils.randFloatSpread(4),
          ],
          font: index === 0 ? fonts[0] : pickRandomElement(fonts),
          fontSize: index === 0 ? 4 : Math.random(),
          maxWidth: index === 0 ? viewport.width : viewport.width * Math.random(),
        };
        return (
          <React.Fragment key={index}>
            {index > results.length - 5 ? (
              <Word
                audio={item.audio}
                {...randomProps}
                position={[
                  randomProps.position[0],
                  randomProps.position[1] + viewport.height * results.length * 0.25,
                  randomProps.position[2],
                ]}
                href={item.href}
              >
                {item.title}
              </Word>
            ) : null}
            <Word audio={item.audio} {...randomProps} href={item.href}>
              {item.title}
            </Word>
            {index < 5 ? (
              <Word
                audio={item.audio}
                {...randomProps}
                position={[
                  randomProps.position[0],
                  randomProps.position[1] - viewport.height * results.length * 0.25,
                  randomProps.position[2],
                ]}
                href={item.href}
              >
                {item.title}
              </Word>
            ) : null}
          </React.Fragment>
        );
      })}
    </group>
  );
}

export default function Index({ pageContext }) {
  const { results } = pageContext;
  return (
    <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>
      <ScrollControls infinite damping={4} pages={results.length / 4 + 1} distance={1.5}>
        <Scroll>
          <Suspense fallback={null}>
            <Content results={results} />
          </Suspense>
        </Scroll>
      </ScrollControls>
      <OrbitControls enableZoom={false} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <color attach="background" args={["#e71d36"]} />
    </Canvas>
  );
}
