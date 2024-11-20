"use client";

import CompanyInfo from "@/components/CompanyInfo";
import InfinitePlain from "@/components/InfinitePlain";
import PortfolioList from "@/components/PortfolioList";
import SimulatedGame from "@/components/SimulatedGame";
import { useState } from "react";
import { gsap } from "gsap";

export default function Home() {
  const [StateMachine, setStateMachine] = useState(0);
  const [Hide, setHide] = useState(" hidden ");
  const [Show, setShow] = useState("");
  const [IsLoading, setIsLoading] = useState(0);
  const [HasBuilding, setHasBuilding] = useState(false);
  const [BuildingModelName, setBuildingModelName] = useState("");
  const [planeAnimationVariables, setplaneAnimationVariables] = useState({
    SpeedPlane: 0.1,
    CameraRotationState: 0,
    CameraMovement: 5,
  });

  const tl = gsap.timeline();
  tl.to(planeAnimationVariables, {
    keyframes: {
      "100%": { SpeedPlane: 0, CameraRotationState: -1.2, CameraMovement: 2.5 },
    },
    duration: 3,
  });

  const animateBlackScreen = (toOpacity: number, onComplete?: () => void) => {
    gsap.to(".black-screen", {
      opacity: toOpacity,
      duration: 0.5,
      onComplete,
    });
  };

  const ChangeState = () => {
    if (IsLoading) return; // Prevent simultaneous triggers

    setIsLoading(1); // Set loading state
    animateBlackScreen(1, () => {
      // Callback after animation completes
      switch (StateMachine) {
        case 0:
          setStateMachine(1);
          setHide("");
          setShow(" hidden ");
          console.log(BuildingModelName);
          break;
        case 1:
          setStateMachine(0);
          setHide(" hidden ");
          setShow("");
          console.log(BuildingModelName);

          break;
        default:
          console.log("Cannot Change Scene");
      }

      animateBlackScreen(0, () => {
        setIsLoading(0); // End loading state
      });
    });
  };

  return (
    // Global Container
    <div className="w-full h-[100vh] relative bg-[#1c1c1c] text-white scroll-smooth">
      {/* Global Black Screen */}
      <div
        className="w-full h-[100vh] bg-black black-screen fixed pointer-events-none z-50"
        style={{ opacity: 0 }}
      ></div>

      {/* Content */}
      <div>
        <InfinitePlain
          visibility={Show}
          hasBuildingSelected={HasBuilding}
          ChangeState={ChangeState}
          animationVariables={planeAnimationVariables}
        />
        <PortfolioList
          visibility={Show}
          setBuildingModelName={setBuildingModelName}
          setHasBuilding={setHasBuilding}
        />
        <CompanyInfo visibility={Show} />

        <SimulatedGame visibility={Hide} modelToRender={BuildingModelName} />
      </div>

      <div>
        <button
          onClick={ChangeState}
          className=" border border-white px-4 py-2 rounded-sm my-2"
        >
          Change Scene
        </button>
        <p className="text-lg">The current scene is {StateMachine}</p>
      </div>
    </div>
  );
}
