import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  ContactShadows,
  Sparkles,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   MAIN PRODUCT
========================================================= */

const MainProduct = () => {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    const { x, y } = state.pointer;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      x * 0.6,
      0.05
    );

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -y * 0.4,
      0.05
    );
  });

  return (
    <group ref={group}>
      <Float
        speed={2}
        rotationIntensity={0.4}
        floatIntensity={1.5}
      >

        {/* MAIN BOX */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 2.5, 2.5]} />

          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.15}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>


        {/* FRONT PANEL */}
        <mesh position={[0, 0, 1.27]}>
          <boxGeometry args={[1.7, 1.7, 0.05]} />

          <meshPhysicalMaterial
            color="#111111"
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>


        {/* CENTER GLOW */}
        <mesh position={[0, 0, 1.32]}>
          <circleGeometry args={[0.5, 64]} />

          <meshBasicMaterial color="#6366f1" />
        </mesh>


        {/* PINK BOX */}
        <mesh
          position={[1.8, 1, 0]}
          rotation={[0.4, 0.5, 0.3]}
          castShadow
        >
          <boxGeometry args={[0.65, 0.65, 0.65]} />

          <meshStandardMaterial
            color="#ec4899"
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>


        {/* GREEN BOX */}
        <mesh
          position={[-1.8, -1, 0.5]}
          rotation={[0.5, 0.3, 0.2]}
          castShadow
        >
          <boxGeometry args={[0.6, 0.6, 0.6]} />

          <meshStandardMaterial
            color="#22c55e"
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>

      </Float>
    </group>
  );
};


/* =========================================================
   RINGS
========================================================= */

const Rings = () => {
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state, delta) => {
    if (!ring1.current || !ring2.current) return;

    ring1.current.rotation.z += delta * 0.5;
    ring1.current.rotation.x += delta * 0.2;

    ring2.current.rotation.z -= delta * 0.35;
    ring2.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <mesh
        ref={ring1}
        rotation={[1.2, 0.2, 0]}
      >
        <torusGeometry
          args={[2.4, 0.025, 16, 100]}
        />

        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.7}
        />
      </mesh>


      <mesh
        ref={ring2}
        rotation={[0.5, 1, 0]}
      >
        <torusGeometry
          args={[3, 0.018, 16, 100]}
        />

        <meshBasicMaterial
          color="#ec4899"
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  );
};


/* =========================================================
   FLOATING SPHERES
========================================================= */

const FloatingSpheres = () => {
  return (
    <>
      <Float speed={3} floatIntensity={2}>
        <mesh position={[-3, 1.8, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />

          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={3}
          />
        </mesh>
      </Float>


      <Float speed={2} floatIntensity={3}>
        <mesh position={[3, -1.5, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />

          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={3}
          />
        </mesh>
      </Float>


      <Float speed={4} floatIntensity={2}>
        <mesh position={[2.7, 1.8, -1]}>
          <sphereGeometry args={[0.12, 32, 32]} />

          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={3}
          />
        </mesh>
      </Float>
    </>
  );
};


/* =========================================================
   SCENE
========================================================= */

const Scene = () => {
  return (
    <>

      {/* LIGHTING */}

      <ambientLight intensity={0.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
        castShadow
      />

      <pointLight
        position={[-4, 2, 3]}
        color="#6366f1"
        intensity={12}
      />

      <pointLight
        position={[4, -2, 2]}
        color="#ec4899"
        intensity={10}
      />


      {/* PRODUCT */}

      <MainProduct />


      {/* RINGS */}

      <Rings />


      {/* SPHERES */}

      <FloatingSpheres />


      {/* PARTICLES */}

      <Sparkles
        count={100}
        scale={8}
        size={2}
        speed={0.4}
        color="#ffffff"
      />

      <Sparkles
        count={40}
        scale={6}
        size={3}
        speed={0.8}
        color="#6366f1"
      />


      {/* ENVIRONMENT */}

      <Environment preset="city" />


      {/* SHADOW */}

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
      />

    </>
  );
};


/* =========================================================
   HERO
========================================================= */

const Hero3D = () => {

  const heroRef = useRef(null);
  const sceneRef = useRef(null);


  useEffect(() => {

    const hero = heroRef.current;
    const scene = sceneRef.current;

    if (!hero || !scene) return;


    /* ================================================
       GSAP CONTEXT
    ================================================= */

    const ctx = gsap.context(() => {

      /* ================================================
         INITIAL STATE
      ================================================= */

      gsap.set(hero, {
        transformPerspective: 1200,
        transformOrigin: "center center",
        willChange: "transform",
      });

      gsap.set(scene, {
        transformPerspective: 1000,
        transformOrigin: "center center",
        willChange: "transform",
      });


      /* ================================================
         HERO SCROLL 3D
      ================================================= */

      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })

      /* WHOLE 3D CONTAINER */
      .to(
        hero,
        {
          y: -80,
          scale: 0.88,
          rotateX: 10,
          rotateY: -5,
          rotateZ: 2,
          borderRadius: "0 0 40px 40px",
          ease: "none",
        },
        0
      )

      /* THREE.JS AREA */
      .to(
        scene,
        {
          scale: 1.15,
          rotateY: 8,
          rotateX: -5,
          rotateZ: -4,
          x: 30,
          y: -20,
          ease: "none",
        },
        0
      );


      /* ================================================
         EXTRA HERO PARALLAX
      ================================================= */

      gsap.to(hero, {
        boxShadow: "0 50px 120px rgba(0,0,0,0.5)",

        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "center top",
          scrub: true,
        },
      });

    }, hero);


    /* ================================================
       CLEANUP
    ================================================= */

    return () => {
      ctx.revert();
    };

  }, []);


  return (
    <div
      ref={heroRef}
      className="hero-3d"
    >

      <div
        ref={sceneRef}
        className="hero-3d-scene"
      >

        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 45,
          }}

          dpr={[1, 2]}

          gl={{
            antialias: true,
            alpha: true,
          }}
        >

          <Scene />

        </Canvas>

      </div>

    </div>
  );
};


export default Hero3D;