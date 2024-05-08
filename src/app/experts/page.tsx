"use client";
import Experts from "@/components/Experts";
import { useState } from "react";

//Anything you want in your scenario to track over time goes here
//This should really be things like current challenges, disasters, successes, design issues etc
const initState = {
  project:
    "A change in the worlds transport through the Panama Canal sees the canal reduced to 50% usage to save the Lake Gutan from drought. The other 50% of transport through this area will be a blimp ferrying system where blimps ferry cargo from each side of the canal in order to bypass using the canal. This range will increase overtime in order for the lake to be 100% free of shipping and restored to being an undisturbed envirnoment. When airships reach this point the technology of blimps have becomed so advanced that the worlds reliance of shipping will be reshaped to involve airshipping ",
  location: "Panama Canal, Panama",
  year: 2024,
  transportQuota: "1,000,000 tonnes per day",
  airshipCapacity: "500 tonnes",
  airshipSpeed: "90 Kilometres per hour",
  airshipLoadingTime: "1 hour",
  yearlyCost: "$800,000 per year",
  airshipCanalRatio: "50% / 50%",
  environmentalImpact: "Low",

  annualReport: "",

  significantEvent: "",
};

//Examples of macroeconomic experts
const economicExperts = [
  "based on the current state of the project, predict likely changes in the global economy that may impact project revenue over the next 3 years.",
  "based on the current state of the project, predict likely infrastructure costs required to increase supply output by 15% over the next 3 years. ",
  "based on current state of the project, predict bottlenecks in supply logistics over the next 3 years. ",
  "based on current state of the project, predict the most likely 5 environmental challenges that will impact the project over the next 3 years.",
  "based on current state of the project, predict the most likely political and policy barriers to project success over the next 3 years. ",
  "based on current state of the project, predict the most likely economic and financial barriers to project success over the next 3 years. ",
  "based on current state of the project, predict the most likely blimp technologicial advancements that aid in project success over the next 3 years. ",
];

//Examples of stakeholder experts
const stakeholders = [
  "You are a transport consortium responsible for increasing efficiency year over year. Conduct a one-paragraph SWOT analysis of the project. Your evaluation should be a perfect mix of positive and negative points to the effect of the progression through the years will stay relatively even",
  "You are a local climate activist responsible for preserving existing national and state environmental areas. Conduct a one-paragraph  SWOT analysis of the project. Your evaluation should be crictical however overall the envirnomental impact should be relative to the impact that ships have that use the canal as it will be replacing this process. this points to the effect of the progression through the years",
  "You are a state government politician responsible to constituents to deliver stable economic growth and social welfare. Conduct a one-paragraph  SWOT analysis of the project. Your evaluation should be a perfect mix of positive and negative points to the effect of the progression through the years will stay relatively even",
  "You are a local community leader responsible for ensuring that the project does not negatively impact the local community. Conduct a one-paragraph  SWOT analysis of the project.  Your evaluation should be a perfect mix of positive and negative points to the effect of the progression through the years will stay relatively even",
  "You are a shipping company responsible for delivering your cargo on time. You stand to benefit if the project is efficent and you dont care if something is effecting the environment positively your only issue is getting your cargo delivered efficently. develop a paragraph of complaints you have with the system that need to be covered in order to make it better",
  "You are the CEO of the airship company responsible for the efficency of the airship ferry system. You stand to benefit from ongoing growth in the project. From my research in the first 10 years the increase in speed and capacity will only rise by 1-10% and increase after that. Conduct a one-paragraph  SWOT analysis of the project. Your evaluation should be a perfect mix of positive and negative points to the effect of the progression through the years will stay relatively even",
  "You are the chief of the weather forecasting station in the panama canal. You determine if the weather is too dangerous for blimps to be used and open the canal to be used as replacement. From my research, weather in this region only reaches dangerous levels 10-15 days a year however this will increase overtime if climate change isnt mitigated. Your aim is to try and use the blimp ferrying as much as the safety isn't compromised. Conduct a weather analysis and outline how often the blimps werent able to be used because of weather",
  "You are a journalist who is commiting his life to researching the debate between whether Airship can replace cargo ships. you are incredibly thorough in your work and will only post results when blimps are safe enough, long ranged heavy enough lift capacity and fast enough to replace the worlds reliance on ships. the world shipping reliance on airships should not increase from 0% until the airship canal ratio is 100% reliant of airships. Conduct a one-paragraph  SWOT analysis of the project.",
  "You are a public figure protestor who's parents died of the hindeberg bimp disaster. your role is to spread as much negativity around the use of blimps as you think they're too unsafe. provide a paragraph of all the negtives with this situation",
  "You are the chief of budgetting of this project. Your role is specifically to reduce the operation cost of the project through mitigation strategies however you need to find a balance between this while considering the advancements in technology. provide these mitigation strategies in a paragraph based on the latest update of the project.",
];

//Demo of generating a forecast
export default function ExpertPage() {
  const [state, setState] = useState<any>(initState);
  const [systemPrompts, setSystemPrompts] = useState<string[]>(stakeholders);

  function handleResponse(newState: any) {
    //do something with the new state
    newState.year += 3;
    setState(newState);
  }

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
          <span className="font-bold my-4">Select Expert Analysis</span>
          <select
            className="p-2 bg-white rounded-lg"
            onChange={(e) =>
              setSystemPrompts(
                e.target.value === "economic" ? economicExperts : stakeholders
              )
            }
          >
            <option value="stakeholders">Stakeholders</option>
            <option value="economic">Economic</option>
          </select>
          <Experts
            initState={state}
            systemPrompts={systemPrompts}
            analysisPrompt={`You will be provided with the current state of a forestry project as well as 
            A series of SWOT analysis of the project from the point of view of different stakeholder groups. 
            Use the analysis to predict changes in the project state JSON object. 
             Only return the JSON object with no other text or explanation.`}
            maxTokens={512}
            handleResponse={handleResponse}
          />
        </div>
      </div>
    </main>
  );
}
