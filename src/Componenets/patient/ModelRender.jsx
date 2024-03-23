import React, { useState, useEffect, useRef, Suspense } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const ModelRender = ({ model, props, rotat, name }) => {
  const group = useRef();
  const rightLegGroup = useRef();
  const leftLegRef = useRef();
  const leftLegGroup = useRef();
  const upperModelRef = useRef();
  const thighRef = useRef();
  console.log("modelrender", rotat);
  console.log("Modelname", name);

  const [rotationX, setRotationX] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);

  const { nodes, materials } = useGLTF(model);

  // const { actions } = useAnimations(animations, group);

  const calculateUpperModelPosition = () => {
    const orbitRadius = 1.9; // Adjust the radius of the orbit
    const offsetY = Math.sin(rotat * Math.PI / 180) * orbitRadius;
    const offsetZ = -Math.cos(rotat * Math.PI / 180) * orbitRadius;
    // Move up and to the right
    return [0.1, offsetY - 1.9, offsetZ]; // Adjusted z-axis position
  };

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
    <>
      {name === "Right-Leg-Bend" && (
        <group {...props} position={[0, 0, -0.4]} rotation={[0, -0.2, 0]} scale={1} dispose={null}>
          <group name="Scene">
            <group
              name="LeftLeg"
              position={[0.107, 0.161, 0.024]}
              rotation={[-3.133, 0, 0]}
              scale={0.01}
            >
              <primitive object={nodes.mixamorig9Hips} />
              <mesh
                name="Ch31_Pants002"
                geometry={nodes.Ch31_Pants002.geometry}
                material={materials["Ch31_body.003"]}
                position={[-12.761, 6.481, -7.281]}
                rotation={[0.136, 0, 0]}
              />
            </group>

            <group
              name="RightLeg"
              ref={rightLegGroup}
              position={[-0.08, 0.121, -0.03]}
              rotation={[-3.133, 0, 0]}
              scale={0.01}
            >
              <group
                position={[0.354, 6.12, -11.789]}
                rotation={[(rotat * Math.PI) / 180, 0, 0]}
              >
                {" "}
                <primitive object={nodes.mixamorig9Hips_5} />
                <mesh
                  name="Ch31_Pants001"
                  geometry={nodes.Ch31_Pants001.geometry}
                  material={materials["Ch31_body.004"]}
                  position={[0, 0, 0]}
                  rotation={[0.135, 0, 0]}
                />
              </group>
            </group>

            <group
              name="UpperModel"
              position={[0, 0.161, 0]}
              rotation={[-3.133, 0, 0]}
              scale={0.01}
            >
              <primitive object={nodes.mixamorig9Hips_7} />
              <group name="Ch31_Pants003" position={[0, 6.592, 48.562]}>
                <mesh
                  name="Mesh005"
                  geometry={nodes.Mesh005.geometry}
                  material={materials["Ch31_body.005"]}
                />
                <mesh
                  name="Mesh005_1"
                  geometry={nodes.Mesh005_1.geometry}
                  material={materials["Ch31_hair.001"]}
                />
              </group>
            </group>
            <group
              name="Karemat_Plosk"
              position={[0.001, -0.03, 0.497]}
              rotation={[-Math.PI, 0, 0]}
              scale={0.01}
            >
              <mesh
                name="Mesh006"
                geometry={nodes.Mesh006.geometry}
                material={materials["Material #2097627803.001"]}
              />
              <mesh
                name="Mesh006_1"
                geometry={nodes.Mesh006_1.geometry}
                material={materials["Material #2097627803d.002"]}
              />
              <mesh
                name="Mesh006_2"
                geometry={nodes.Mesh006_2.geometry}
                material={materials["Material #2097627803dd.001"]}
              />
            </group>
          </group>
        </group>
      )}
      {name === "Left-Leg-Bend" && (
        <group {...props} position={[-0.4, 0, 0]} rotation={[0, 1.5, 0]} scale={1} dispose={null}>
        <group name="Scene">
          {/* Left Leg Group */}
          <group name="UpperModel" position={[0, 0.161, 0]} rotation={[-3.133, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorig9Hips_4} />
            <group name="Ch31_Pants003" position={[0, 9.118, 43.405]}>
              <mesh name="Mesh007" geometry={nodes.Mesh007.geometry} material={materials['Ch31_body.002']} />
              <mesh name="Mesh007_1" geometry={nodes.Mesh007_1.geometry} material={materials['Ch31_hair.001']} />
            </group>
          </group>
          <group name="LeftLeg" ref={leftLegGroup} position={[-0.02, 0.064, 0.18]} rotation={[rotat * Math.PI / 180, 0, 0]} scale={0.01}>
            {/* Left Leg */}
            <primitive object={nodes.mixamorig9Hips} />
            <mesh name="Ch31_Pants002" geometry={nodes.Ch31_Pants002.geometry} material={materials.Ch31_body} position={[0, 0, 0]} rotation={[-3, 0, 0]} />
          </group>
          <group name="RightLeg" position={[0, 0.161, 0]} rotation={[-3.133, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorig9Hips_1} />
            <mesh name="Ch31_Pants001" geometry={nodes.Ch31_Pants001.geometry} material={materials['Ch31_body.001']} position={[-0.708, 10, -16.983]} rotation={[0.2, 0, 0]} />
          </group>
          <group name="Armature002" position={[0.107, 0.161, 0.024]} rotation={[-3.133, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorig9Hips_2} />
          </group>
          <group name="Armature003" position={[0, 0.161, 0]} rotation={[-3.133, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorig9Hips_3} />
          </group>
          <group name="Karemat_Plosk" position={[-0.002, -0.049, 0.492]} rotation={[-Math.PI, 0, 0]} scale={0.01}>
            <mesh name="Mesh002" geometry={nodes.Mesh002.geometry} material={materials['Material #2097627803']} />
            <mesh name="Mesh002_1" geometry={nodes.Mesh002_1.geometry} material={materials['Material #2097627803d']} />
            <mesh name="Mesh002_2" geometry={nodes.Mesh002_2.geometry} material={materials['Material #2097627803dd']} />
          </group>
        </group>
      </group>
      )}
      {/* {name === "Right-Knee-Bend (squats)" && (
        <group {...props} dispose={null}>
          <group name="Scene">
            <group
              name="UpperModel"
              position={[0, -0.33, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <primitive object={nodes.mixamorig9Hips_1} />
              <group name="Ch31_Collar" position={[0, -40.726, 50.457]}>
                <mesh
                  name="Mesh003"
                  geometry={nodes.Mesh003.geometry}
                  material={materials["Ch31_body.004"]}
                />
                <mesh
                  name="Mesh003_1"
                  geometry={nodes.Mesh003_1.geometry}
                  material={materials.Ch31_hair}
                />
              </group>
            </group>
            <group
              name="LeftLeg"
              position={[0, -0.31, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <primitive object={nodes.mixamorig9Hips} />
              <mesh
                name="Ch31_Shoes"
                geometry={nodes.Ch31_Shoes.geometry}
                material={materials["Ch31_body.003"]}
                position={[12.829, 0.681, -38.031]}
                rotation={[1.604, 0, 0]}
              />
            </group>
            <group
              ref={rightLegGroup}
              name="RightLeg"
              position={[-0.14, 0.01, 0]}
              rotation={[(rotat * Math.PI) / 180, 0, 0]}
              scale={0.01}
            >
              
              <primitive object={nodes.mixamorig9Hips_2} />
              <mesh
                name="Ch31_Shoes001"
                geometry={nodes.Ch31_Shoes001.geometry}
                material={materials["Ch31_body.005"]}
                position={[0, 0, 0]}
                rotation={[1.517, -0.1, -0.16]}
              />
            </group>
            <group
              name="Line010"
              position={[-0.005, -0.302, -0.469]}
              scale={0.011}
            >
              <mesh
                name="Mesh004"
                geometry={nodes.Mesh004.geometry}
                material={materials["21 - Default"]}
              />
              <mesh
                name="Mesh004_1"
                geometry={nodes.Mesh004_1.geometry}
                material={materials["17 - Default"]}
              />
            </group>
          </group>
        </group>
      )}  */}
      {name === "Left-Knee-Bend" && (
        <group {...props} scale={0.75} position={[0, -0.15, 0]} rotation={[0, 15.5, 0.2]} dispose={null}>
        <group name="Scene">
        <group name="UpperModel" position={[0, -0.33, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorig9Hips_1} />
            <group name="Ch31_Collar" position={[0, -40.456, 49.742]}>
              <mesh name="Mesh003" geometry={nodes.Mesh003.geometry} material={materials['Ch31_body.001']} />
              <mesh name="Mesh003_1" geometry={nodes.Mesh003_1.geometry} material={materials.Ch31_hair} />
            </group>
          </group>
        <group name="LeftLeg" position={[0.14, 0.04, -0.03]} rotation={[0, 0, 0]} scale={0.01}>
          <group ref={leftLegGroup} rotation={[(180 - rotat) * Math.PI / 180, 0, 0]}>
            <primitive object={nodes.mixamorig9Hips} />
            <mesh name="Ch31_Shoes" geometry={nodes.Ch31_Shoes.geometry} material={materials.Ch31_body} position={[0, 0, 0]} rotation={[0 * Math.PI / 180, 0, 0]} />
          </group>
        </group>
          <group name="RightLeg" position={[0, -0.33, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <primitive object={nodes.mixamorig9Hips_2} />
            <mesh name="Ch31_Shoes001" geometry={nodes.Ch31_Shoes001.geometry} material={materials['Ch31_body.002']} position={[-14.17, 1.217, -36.088]} rotation={[1.517, 0, 0]} />
          </group>
          <group name="Line010" position={[-0.005, -0.295, -0.567]} scale={0.011}>
            <mesh name="Mesh002" geometry={nodes.Mesh002.geometry} material={materials['21 - Default']} />
            <mesh name="Mesh002_1" geometry={nodes.Mesh002_1.geometry} material={materials['17 - Default']} />
          </group>
        </group>
      </group>
      )}
      {name === "Sit-Stand" && (
        <group ref={group} scale={0.15} position={[0, -0.15, 0]} rotation={[0, 15.5, 0.2]} {...props} dispose={null}>
          <group name="Scene">
            <group
              ref={upperModelRef}
              name="UpperModel"
              position={calculateUpperModelPosition()}
              rotation={[Math.PI / 2, 0, 0]}
              scale={0.01}
            >
              <primitive object={nodes.mixamorig9Hips} />
              <group name="Ch31_Collar" scale={4.879}>
                <mesh
                  name="Mesh003"
                  geometry={nodes.Mesh003.geometry}
                  material={materials["Ch31_body.002"]}
                />
                <mesh
                  name="Mesh003_1"
                  geometry={nodes.Mesh003_1.geometry}
                  material={materials.Ch31_hair}
                />
              </group>
            </group>
            <mesh
              ref={thighRef}
              name="Thigh"
              geometry={nodes.Thigh.geometry}
              material={materials["Ch31_body.001"]}
              position={[0.16, -0.17, 0.01]}
              rotation={[rotat * Math.PI / 180, 0, 0]}
              scale={0.047}
            />
            <mesh
              name="Legs"
              geometry={nodes.Legs.geometry}
              material={materials.Ch31_body}
              position={[0.157, -2.316, 0.094]}
              rotation={[1.552, 0, 0]}
              scale={0.047}
            />
            <mesh
              name="Box001"
              geometry={nodes.Box001.geometry}
              material={materials["17 - Default"]}
              position={[0.095, -0.436, -1.851]}
              scale={0.046}
            />
            <mesh
              name="Line009"
              geometry={nodes.Line009.geometry}
              material={materials["21 - Default"]}
              position={[0.075, -1.224, -1.54]}
              scale={0.046}
            />
            <mesh
              name="Line010"
              geometry={nodes.Line010.geometry}
              material={materials["21 - Default"]}
              position={[0.057, -1.224, -2.419]}
              scale={0.046}
            />
            <mesh
              name="Plane009"
              geometry={nodes.Plane009.geometry}
              material={materials["17 - Default"]}
              position={[0.077, 0.225, -2.422]}
              scale={0.046}
            />
          </group>
        </group>
      )}
    </>
  );
};

export default ModelRender;
