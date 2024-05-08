import { getGroqCompletion, getGroqCompletionParallel } from "@/ai/groq";
import { useState } from "react";

//function that runs multiple prompts for expert analysis and updates a given state object
export default function Debate({
  initState,
  debateTopic,
  maxTokens,
  handleResponse,
}: {
  initState: any;
  debateTopic: string;
  maxTokens: number;
  handleResponse: (response: any) => void;
}) {
  const [state, setState] = useState<any>(initState);
  const [generating, setGenerating] = useState<boolean>(false);
  const [debate, setDebate] = useState<string[]>([]);

  const runPrompts = async () => {
    setGenerating(true);

    //argue for the merits of the project
    const forArgument = await getGroqCompletion(
      debateTopic,
      maxTokens,
      "You are an expert debator. You will be arguing on the FOR team, and should advocate for the merits of the topic described by the user."
    );
    const againstArgument = await getGroqCompletion(
      `Debate topic: ${debateTopic}, for team arguments: ${forArgument}`,
      maxTokens,
      "You are an expert debator. You will be arguing on the AGAINST team, and should rebut the arguments of the for team (provided by the user) for the debate topic."
    );
    const analysis = await getGroqCompletion(
      `Debate topic: ${debateTopic}, for team arguments: ${forArgument}, against team arguments: ${againstArgument}`,
      maxTokens,
      "You are an expert debator. You will be judging the debate between the for and against teams, and should determine the winner based on the arguments provided."
    );

    //Then try to work out
    const newState = await updateAnalysis(analysis);
    setState(newState);
    setDebate([forArgument, againstArgument, analysis]);
    handleResponse(newState);
    setGenerating(false);
  };

  const updateAnalysis = async (analysis: string) => {
    //Dumb system prompt to try to incorporate all of the analysis into the updated state
    //remove the previous annual report from the state to prevent it from being included in the analysis
    const stateString = JSON.stringify(state);
    const newState = await getGroqCompletion(
      `Project being debated: ${stateString}, Debate arguments and judgement: ${debate.join(
        ","
      )}`,
      maxTokens,
      "You are a simulation that uses debates to predict likely changes in a project over the near term future. Use the analysis to predict changes in the project state JSON object. Only return the JSON object with no other text or explanation.",
      true
    );
    return JSON.parse(newState);
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className="p-2 bg-white rounded-lg my-4"
        onClick={() => runPrompts()}
      >
        {generating ? "Generating..." : "Analyze"}
      </button>
      <div className="flex justify-between w-full flex-wrap">
        {debate.map((t, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg bg-white p-2 hover:shadow m-2"
          >
            <span>{generating ? "Generating..." : debate[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
