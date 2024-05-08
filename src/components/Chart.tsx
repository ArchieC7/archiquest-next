//Component for generating a map of coordinates

import { getGroqCompletion } from "@/ai/groq";
import { generateCoordinatesPrompt } from "@/ai/prompts";
import { useEffect, useState } from "react";
export type MapLocation = {
  description: string;
  coordinates: { x: number; y: number };
};

//Component for generating features within a given bounds of max - min coordinates
export default function GenerateChart({
  bounds,
  prompt,
  onSelect,
  onCreate,
}: {
  bounds: string;
  prompt: string;
  onSelect: (location: MapLocation) => void;
  onCreate: (locations: MapLocation[]) => void;
}) {
  const [locations, setLocations] = useState<MapLocation[]>([]);

  //create some coordinates when the prompt changes
  useEffect(() => {
    //call Groq to generate coordinates
    const generateCoordinates = async () => {
      const coordinatesString = await getGroqCompletion(
        `Description: ${prompt}, Bounds: ${bounds}`,
        256,
        generateCoordinatesPrompt,
        true
      );
      const coordinates = JSON.parse(coordinatesString);
      onCreate(coordinates.map);
      setLocations(coordinates.map);
    };
    if (prompt !== "") generateCoordinates();
  }, [prompt]);

  //display coordinates as a full screen map
  return <Chart locations={locations} onSelect={onSelect} />;
}

//Component for rendering an array of Location objects as buttons
export function Chart({
  locations,
  onSelect,
}: {
  locations: MapLocation[];
  onSelect: (location: MapLocation) => void;
}) {
  //display coordinates as a full screen map
  return (
    <div className="h-full w-full bg-gray-200">
      {locations.map((location, i) => (
        <button
          key={i}
          onClick={() => onSelect(location)}
          className="p-2 bg-white rounded-lg hover:shadow absolute"
          style={{
            top: `${location.coordinates.y}%`,
            left: `${location.coordinates.x}%`,
          }}
        >
          {location.description}
        </button>
      ))}
    </div>
  );
}
