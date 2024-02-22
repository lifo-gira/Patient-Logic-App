import React, { useState, useEffect, useRef, Suspense } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const ModelRender = ({model,props,rotat}) => {
    const group = useRef();
  const rightLegGroup = useRef();
    console.log("modelrender",rotat)

  const [rotationX, setRotationX] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);

  const { nodes, materials, animations } = useGLTF(model);

  const { actions } = useAnimations(animations, group);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setRotationX((prevRotationX) => {
//         if (isIncreasing) {
//           if (prevRotationX < 120) {
//             return prevRotationX + 5;
//           } else {
//             setIsIncreasing(false);
//             return prevRotationX;
//           }
//         } else {
//           if (prevRotationX > 5) {
//             return prevRotationX - 5;
//           } else {
//             setIsIncreasing(true);
//             return prevRotationX;
//           }
//         }
//       });
//       console.log("rotation", rotationX);
//     }, 100);

//     return () => clearInterval(intervalId); // Cleanup interval on component unmount
//   }, [isIncreasing]);

  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        {/* Left Leg */}
        <group name="LeftLeg" position={[0.107, 0.161, 0.024]} rotation={[-3.133, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorig9Hips} />
          <mesh name="Ch31_Pants002" geometry={nodes.Ch31_Pants002.geometry} material={materials['Ch31_body.003']} position={[-12.761, 6.481, -7.281]} rotation={[0.136, 0, 0]} />
        </group>

        {/* Right Leg */}
        <group name="RightLeg" ref={rightLegGroup} position={[-0.08, 0.121, -0.03]} rotation={[-3.133, 0, 0]} scale={0.01}>
          {/* Apply rotation to this group */}
          <group position={[0.354, 6.12, -11.789]} rotation={[rotat * Math.PI / 180, 0, 0]}> {/* Position at the pivot point */}
            <primitive object={nodes.mixamorig9Hips_5} />
            <mesh name="Ch31_Pants001" geometry={nodes.Ch31_Pants001.geometry} material={materials['Ch31_body.004']} position={[0, 0, 0]} rotation={[0.135, 0, 0]} />
          </group>
        </group>

        {/* Rest of the model */}
        <group name="UpperModel" position={[0, 0.161, 0]} rotation={[-3.133, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorig9Hips_7} />
          <group name="Ch31_Pants003" position={[0, 6.592, 48.562]}>
            <mesh name="Mesh005" geometry={nodes.Mesh005.geometry} material={materials['Ch31_body.005']} />
            <mesh name="Mesh005_1" geometry={nodes.Mesh005_1.geometry} material={materials['Ch31_hair.001']} />
          </group>
        </group>
        <group name="Karemat_Plosk" position={[0.001, -0.03, 0.497]} rotation={[-Math.PI, 0, 0]} scale={0.01}>
          <mesh name="Mesh006" geometry={nodes.Mesh006.geometry} material={materials['Material #2097627803.001']} />
          <mesh name="Mesh006_1" geometry={nodes.Mesh006_1.geometry} material={materials['Material #2097627803d.002']} />
          <mesh name="Mesh006_2" geometry={nodes.Mesh006_2.geometry} material={materials['Material #2097627803dd.001']} />
        </group>
      </group>
    </group>
  )
}

export default ModelRender