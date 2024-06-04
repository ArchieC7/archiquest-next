"use client";
import { useEffect, useState } from "react";
import supabase from "@/supabase/supabaseClient";
import QuestionAnswer, {
  Player,
  Question,
  Quiz,
} from "@/components/QuestionAnswer";
import { useRouter } from "next/navigation";
import PlayerList from "../PlayerList";
import { questionTime } from "../page";

export const dynamic = "force-dynamic";

export default function GameshowPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    //create the quiz
    const createGame = async () => {
      //get the player
      const playerId = localStorage.getItem("player_id");
      if (!playerId) return router.push("/gameshow");
      //get the player from local storage
      const { data, error } = await supabase
        .from("player")
        .select()
        .eq("id", playerId)
        .select()
        .single();

      //Create new quiz in supabase
      const { data: quiz, error: quizError } = await supabase
        .from("quiz")
        .insert({ host_player_name: data.player_name, status: "lobby" })
        .select()
        .single();
      if (quiz) setQuiz(quiz);

      //assign the quiz to the player
      const { data: playerData, error: playerError } = await supabase
        .from("player")
        .update({ quiz_id: quiz.id })
        .eq("id", playerId)
        .select()
        .single();
      if (playerData) setPlayer(data);
    };
    createGame();
  }, []);

  const startGame = async () => {
    //Set quiz to active and update our state
    if (!quiz) return;
    const { data, error } = await supabase
      .from("quiz")
      .update({ status: "playing" })
      .eq("id", quiz.id)
      .select()
      .single();
    if (data) setQuiz(data);
    //get all of the players expertise so we can pass this to our question answer component
    const { data: pd, error: pdError } = await supabase
      .from("player")
      .select()
      .eq("quiz_id", quiz.id);
    if (pd) {
      console.log("Starting game with players: ", pd);
      setPlayers(pd);
    }
  };

  const stopGame = async () => {
    //Set quiz to active and update our state
    if (!quiz) return;
    const { data, error } = await supabase
      .from("quiz")
      .update({ status: "ended" })
      .eq("id", quiz.id)
      .select()
      .single();
    router.push("/gameshow");
  };

  const handleAnswer = async (question: Question, answer: string) => {
    //update the player
    if (!player) return;
    const correct = question.correct_answer === answer;
    const { data, error } = await supabase
      .from("player")
      .update({
        score: player.score + (correct ? question.points : 0),
        status: correct ? "playing" : "lost",
      })
      .eq("id", player.id)
      .select()
      .single();
    setPlayer(data);
  };

  const handleQuestion = async (question: Question) => {
    //save the question to supabase so other players can answer it
    if (!quiz) return;
    const { data, error } = await supabase
      .from("question")
      .insert({
        quiz_id: quiz.id,
        theme: question.theme,
        type: question.type,
        question: question.question,
        answers: question.answers,
        correct_answer: question.correct_answer,
        points: question.points,
      })
      .select()
      .single();
  };

  if (!quiz || !player) return <div>Creating Quiz...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-2xl w-full items-start justify-between font-mono text-sm lg:flex lg:flex-col gap-4 ">
        <div className="flex flex-col gap-4 w-full">
          <h1>Hosting {quiz && `${player.player_name}s`} Game</h1>
          <button
            onClick={quiz.status === "playing" ? stopGame : startGame}
            disabled={!quiz}
            className="p-2 text-white font-semibold rounded-lg bg-blue-500 mb-2 w-full shadow hover:shadow-lg transition"
          >
            {quiz.status === "playing" ? "End Game" : "Start Game"}
          </button>
          {quiz.status === "playing" && (
            <QuestionAnswer
              questionTime={questionTime}
              onQuestion={handleQuestion}
              onAnswer={handleAnswer}
              playerData={players.map((p) => p.player_data)}
            />
          )}
        </div>

        <PlayerList initPlayers={players} quiz={quiz} />
      </div>
    </main>
  );
}
