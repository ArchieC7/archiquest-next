"use client";
import Debate from "@/components/Debate";
import { useState } from "react";

//Anything you want in your scenario to track over time goes here
//This should really be things like current challenges, disasters, successes, design issues etc
const initState = {
  structures: "Main production facility, Oregon Mill A, Port facility",
  structureStatus: "All structures are operational",
  productionCapacity: "1M Linear Board Feet",
  currentCrisis: "None",
  achievements: "None",
};

const debateTopic =
  "A timber consortium has a vision to develop a forestry plantation of sufficient scale to entirely replace the world's dependence on concrete with renewable timber.";

//Demo of simulating a debate about a given topic
export default function DebatePage() {
  const [state, setState] = useState<any>(initState);

  const handleResponse = (newState: any) => {
    //do something with the new state
    setState(newState);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col w-full">
          <div>
            {Object.keys(state).map((key) => (
              <div className="flex justify-between" key={key}>
                <span className="font-semibold">{key}: </span>
                <span>{state[key]}</span>
              </div>
            ))}
          </div>

          <Debate
            initState={state}
            debateTopic={debateTopic}
            maxTokens={256}
            handleResponse={handleResponse}
          />
        </div>
      </div>
    </main>
  );
}
