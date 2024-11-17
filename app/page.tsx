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
  const [IsLoading, SetIsLoading] = useState(0);

  const animateBlackScreen = (toOpacity: number, onComplete?: () => void) => {
    gsap.to(".black-screen", {
      opacity: toOpacity,
      duration: 0.5,
      onComplete,
    });
  };

  const ChangeState = () => {
    if (IsLoading) return; // Prevent simultaneous triggers

    SetIsLoading(1); // Set loading state
    animateBlackScreen(1, () => {
      // Callback after animation completes
      switch (StateMachine) {
        case 0:
          setStateMachine(1);
          setHide("");
          setShow(" hidden ");
          break;
        case 1:
          setStateMachine(0);
          setHide(" hidden ");
          setShow("");
          break;
        default:
          console.log("Cannot Change Scene");
      }

      animateBlackScreen(0, () => {
        SetIsLoading(0); // End loading state
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
        <InfinitePlain visibility={Show} />
        <PortfolioList visibility={Show} />
        <CompanyInfo visibility={Show} />

        <SimulatedGame visibility={Hide} />
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
