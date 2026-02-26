import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "./Loader";




const Drone = () => {
  const { scene } = useGLTF("/animated-drone/animated_drone.glb");
    return (
    <primitive
  object={scene}
  scale={30}
  position={[0, -1, 0]}
/>
      
    );
};

  const DroneCanvas = () => {
    return (
      <Canvas
        shadows
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{
            fov: 45,
            near: 0.1,
            far: 1000,
            position: [0, 0, 10],
            }}
            style={{ width: "100%", height: "100vh" }}
      >

        <ambientLight intensity={1} />
<directionalLight position={[5,5,5]} intensity={2} />

        <Suspense fallback={<CanvasLoader />}>
          {/* <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          /> */}
          <OrbitControls
  autoRotate
  autoRotateSpeed={2}
  enableZoom={false}
  enablePan={false}
  minPolarAngle={Math.PI / 4}
  maxPolarAngle={(Math.PI / 4) * 3}
/>
          <Drone />
          <Preload all />
        </Suspense>
      </Canvas>
    );
  };
export default DroneCanvas;