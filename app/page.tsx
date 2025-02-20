"use client";

import CompanyInfo from "@/components/CompanyInfo";
import InfinitePlain from "@/components/InfinitePlain";
import PortfolioList from "@/components/PortfolioList";
import SimulatedGame from "@/components/SimulatedGame";
import { useState } from "react";
import { gsap } from "gsap";

export default function Home() {
  const [StateMachine, setStateMachine] = useState(0); // State to track scenes
  const [Hide, setHide] = useState(" hidden "); // Used to control visibility
  const [Show, setShow] = useState(""); // Used to control visibility
  const [IsLoading, setIsLoading] = useState(0); // Prevent simultaneous transitions
  const [HasBuilding, setHasBuilding] = useState(false); // Track building selection
  const [BuildingModelName, setBuildingModelName] = useState(""); // Store selected building name
  const [planeAnimationVariables, setplaneAnimationVariables] = useState({
    SpeedPlane: 5, // Speed for plane movement
    CameraRotationState: 0, // Initial rotation state
    CameraMovement: 5, // Initial camera movement
  });
  const [modelsLoaded, setModelsLoaded] = useState(false); // Add this state

  const ChangeState = () => {
    if (IsLoading) return; // Prevent simultaneous transitions

    setIsLoading(1); // Set loading state

    // Check if the current scene is 1 (Simulated Game)
    if (StateMachine === 1) {
      // Only animate the black screen fade
      gsap.to(".black-screen", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Switch state and update visibility
          setStateMachine(0);
          setHide(" hidden ");
          setShow("");
          console.log("Switching to Infinite Plane Scene");

          // Fade out the black screen after switching state
          gsap.to(".black-screen", {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
              setIsLoading(0); // Reset loading state
            },
          });
        },
      });
    } else {
      // Full animation timeline for state 0 (Infinite Plane Scene)
      const tl = gsap.timeline({
        onComplete: () => {
          // Switch state and update visibility after timeline finishes
          switch (StateMachine) {
            case 0: // Transition to 3D scene
              setStateMachine(1);
              setHide("");
              setShow(" hidden ");
              console.log("Switching to Simulated Game Scene");
              break;
            case 1: // (This branch wouldn't be hit here because of our if check above)
              setStateMachine(0);
              setHide(" hidden ");
              setShow("");
              console.log("Switching to Infinite Plane Scene");
              break;
            default:
              console.error("Invalid state");
          }

          // Fade out the black screen
          gsap.to(".black-screen", {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
              setplaneAnimationVariables((prev) => ({
                ...prev,
                SpeedPlane: 5, // Reset plane speed
                CameraRotationState: 0, // Reset camera rotation
                CameraMovement: 5, // Reset camera movement
              }));
              setIsLoading(0); // Reset loading state
            },
          });
        },
      });

      // Animate plane properties and camera position
      tl.to(planeAnimationVariables, {
        SpeedPlane: 0, // Stop the plane's movement
        duration: 0.6, // Fast abrupt stop (20% of animation)
        ease: "power2.out",
        onUpdate: () => {
          setplaneAnimationVariables((prev) => ({
            ...prev,
            SpeedPlane: planeAnimationVariables.SpeedPlane,
          }));
        },
      })
        .to(
          planeAnimationVariables,
          {
            CameraRotationState: -1.2,
            CameraMovement: 2.5,
            duration: 2.4, // Rest of the animation duration
            ease: "expo.in", // Smooth transition for fall effect
            onUpdate: () => {
              setplaneAnimationVariables((prev) => ({
                ...prev,
                CameraRotationState:
                  planeAnimationVariables.CameraRotationState,
                CameraMovement: planeAnimationVariables.CameraMovement,
              }));
            },
          },
          "<" // Start immediately after the first animation
        )
        .to(
          ".black-screen",
          { opacity: 1, duration: 0.8, ease: "power2.inOut" },
          "<75%" // Start fading black screen at 75% of total animation
        );
    }
  };

  return (
    <div className="w-full h-[100vh] relative bg-[#1c1c1c] text-white scroll-smooth">
      {/* Global Black Screen */}
      <div
        className="w-full h-[100vh] bg-[#1c1c1c] black-screen fixed pointer-events-none z-50"
        style={{ opacity: 0 }}
      ></div>

      {/* Main Content */}
      <div>
        <InfinitePlain
          visibility={Show}
          hasBuildingSelected={HasBuilding}
          ChangeState={ChangeState}
          animationVariables={planeAnimationVariables}
          modelsLoaded={modelsLoaded} // Pass the modelsLoaded state
        />
        <PortfolioList
          visibility={Show}
          setBuildingModelName={setBuildingModelName}
          setHasBuilding={setHasBuilding}
        />
        <CompanyInfo visibility={Show} />

        <SimulatedGame
          visibility={Hide}
          modelToRender={BuildingModelName}
          ChangeState={ChangeState}
          setModelsLoaded={setModelsLoaded} // Pass the state setter
        />
      </div>
    </div>
  );
}
