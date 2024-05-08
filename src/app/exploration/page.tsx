"use client";

import GenerateChart, { Chart, MapLocation } from "@/components/Chart";
import { getMapCoordinates, saveMapCoordinates } from "./supabaseMaps";
import { useState } from "react";

//Demo of generating a map of coordinates that can be selected
export default function ExplorationPage() {
  const [mapDescription, setMapDescription] = useState<string>("");
  const [mapBounds, setMapBounds] = useState<string>("");
  const [mapPrompt, setMapPrompt] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );
  const [locations, setLocations] = useState<MapLocation[]>([]);

  const saveCreatedLocations = async (locations: MapLocation[]) => {
    //get locations from database
    const map = await getMapCoordinates();
    if (!map) return;
    setLocations(
      map.map((l) => ({
        description: l.description,
        coordinates: { x: l.x, y: l.y },
      }))
    );

    saveMapCoordinates(
      locations.map((l: MapLocation) => ({
        x: l.coordinates.x,
        y: l.coordinates.y,
        z: 0,
        description: l.description,
        image: "",
      }))
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col">
          <input
            className="p-2 rounded-lg w-full"
            type="text"
            onChange={(e) => setMapDescription(e.target.value)}
            placeholder="What do you want to do?"
          />
          <input
            className="p-2 rounded-lg w-full"
            type="text"
            onChange={(e) => setMapBounds(e.target.value)}
            placeholder="Bounds in (0,0),(100,100) format"
          />
          <button className="p-4" onClick={() => setMapPrompt(mapDescription)}>
            Create Map
          </button>
          <span className="text-xl">{selectedLocation?.description}</span>
          <GenerateChart
            bounds={mapBounds}
            prompt={mapPrompt}
            onSelect={(location: MapLocation) => setSelectedLocation(location)}
            onCreate={saveCreatedLocations}
          />
          <Chart
            locations={locations}
            onSelect={(location: MapLocation) => setSelectedLocation(location)}
          />
        </div>
      </div>
    </main>
  );
}
