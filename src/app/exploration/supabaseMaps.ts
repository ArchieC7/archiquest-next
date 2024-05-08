"use server";
import { supabase } from "@/supabase/supabase";

//These functions are specific to my supabase project and save the locations generated in the map example to a table called Map.
//If you want to work with supabase, you will likely need some help getting your database set up on discord.
export async function saveMapCoordinates(locations: any) {
  const { data, error } = await supabase.from("map").insert(locations).select();
}

export async function getMapCoordinates() {
  let { data: map, error } = await supabase.from("map").select("*");
  return map;
}
