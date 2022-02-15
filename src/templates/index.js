import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useScroll, Text, PositionalAudio, useIntersect, Loader } from "@react-three/drei";
import * as THREE from "three";

import oswald from "@fontsource/oswald/files/oswald-latin-700-normal.woff";
import lora from "@fontsource/lora/files/lora-latin-700-normal.woff";
import merriweather from "@fontsource/merriweather/files/merriweather-latin-900-normal.woff";
import montserrat from "@fontsource/montserrat/files/montserrat-latin-900-normal.woff";

const pickRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const fonts = [oswald, lora, merriweather, montserrat];

function Word({ children, ...props }) {
  const fontProps = { letterSpacing: -0.05, lineHeight: 1, "material-toneMapped": false };
  const sound = useRef();
  const ref = useIntersect(() => {
    if (!sound.current.isPlaying) {
      sound.current.play();
    }
  });
  return (
    <group>
      <Text {...props} {...fontProps} children={children} />
      <mesh ref={ref} position={props.position}>
        <planeBufferGeometry attach="geometry" args={[0, 0]} />
        <meshBasicMaterial attach="material" color="white" />
        <PositionalAudio ref={sound} autoplay={false} loop={false} url={props.audio} detune={Math.random()} />
      </mesh>
    </group>
  );
}

function Content({ results }) {
  const data = useScroll();
  const ref = useRef();
  const { viewport } = useThree();
  useFrame((state, delta) => {
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, Math.max(0, data.delta * 1000), 4, delta);
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, state.mouse.x * -0.4, 0.1);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, state.mouse.y * 0.4, 0.1);
  });
  return (
    <group ref={ref} position={[0, 0, 8]}>
      {results.map((item, index) => {
        const randomProps = {
          position: [
            index === 0 ? 0 : THREE.MathUtils.randFloatSpread(8),
            index === 0 ? 0 : -viewport.height * index * 0.5,
            index === 0 ? -4 : THREE.MathUtils.randFloatSpread(8),
          ],
          font: index === 0 ? fonts[0] : pickRandomElement(fonts),
          fontSize: 1,
          maxWidth: index === 0 ? viewport.width : viewport.width * Math.random(),
        };
        return (
          <React.Fragment key={index}>
            {index > results.length - 8 ? (
              <Word
                audio={item.audio}
                {...randomProps}
                position={[
                  randomProps.position[0],
                  randomProps.position[1] + viewport.height * results.length * 0.5,
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
            {index < 8 ? (
              <Word
                audio={item.audio}
                {...randomProps}
                position={[
                  randomProps.position[0],
                  randomProps.position[1] - viewport.height * results.length * 0.5,
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
    <React.Fragment>
      <Canvas style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        <ScrollControls infinite damping={4} pages={results.length / 2 + 1} distance={1.5}>
          <Scroll>
            <Suspense fallback={null}>
              <Content results={results} />
            </Suspense>
          </Scroll>
        </ScrollControls>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <color attach="background" args={["#e71d36"]} />
      </Canvas>
      <Loader />
    </React.Fragment>
  );
}
