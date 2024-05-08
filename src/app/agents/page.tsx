"use client";
import Agents from "@/components/Agents";
import { useState } from "react";

//Anything you want in your scenario to track over time goes here
//This should really be things like current challenges, disasters, successes, design issues etc
const initResources = {
  land: "2000 acres",
  owner: "Oregon State",
  use: "Forestry",
  marketDemand: "",
  environmentalImpact: "",
  revenue: "",
};

const initAgents = [
  {
    goal: "increase market demand for timber while maintaining environmental awareness",
    plan: "lobby congress for timber subsidies, increase marketing spend, criticise concrete industry",
    currentTask: "",
    resourcesRequired: "",
  },
  {
    goal: "increase revenue and decrease environmental awareness",
    plan: "develop marketing strategy, cut expenses, improve efficiency in manufacturing and production",
    currentTask: "",
    resourcesRequired: "",
  },
  {
    goal: "reduce environmental impact and market demand for timber",
    plan: "research activist strategies, implement anarchist praxis, develop a new environmental policy, interfere with local production",
    currentTask: "",
    resourcesRequired: "",
  },
];

//Demo of running multiple agents that all compete for resources
export default function AgentsPage() {
  const [resources, setResources] = useState<any>(initResources);
  const [agents, setAgents] = useState<string[]>(
    initAgents.map((a) => JSON.stringify(a))
  );

  const handleResponse = (newResources: any, newAgents: any[]) => {
    //update resources and agents
    setResources(newResources);
    setAgents(newAgents);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col w-full">
          <div>
            {Object.keys(resources).map((key) => (
              <div className="flex justify-between" key={key}>
                <span className="font-semibold">{key}: </span>
                <span>{resources[key]}</span>
              </div>
            ))}
          </div>

          <Agents
            initResources={resources}
            initAgents={agents}
            maxTokens={128}
            handleResponse={handleResponse}
          />
        </div>
      </div>
    </main>
  );
}
