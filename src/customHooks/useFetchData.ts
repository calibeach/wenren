import { useCallback } from "react";
import { Action } from "../reducer/reducer";

import { findValidCombination } from "../wordSelection/wordSelection";

interface FetchDataResult {
  resultWords: string[];
  allowedCharacters: string[];
  selectedCharacter: string;
}

const useFetchData = (
  dispatch: React.Dispatch<Action>
): (() => Promise<void>) => {
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const idiomsResponse = await fetch("/idiom.json");
      const hanziDBResponse = await fetch("/hanziDB.json");

      const idioms = await idiomsResponse.json();
      const hanziDB = await hanziDBResponse.json();

      const result: FetchDataResult = findValidCombination(idioms, hanziDB);
      const pointsForCorrectGuess = 100 / result.resultWords.length;
      dispatch({ type: "SET_CHENGYU_ANSWERS", payload: result.resultWords });
      const filteredAllowedCharacters = result.allowedCharacters.filter(
        (char) => char !== result.selectedCharacter
      );
      dispatch({
        type: "SET_MASTER_TILES",
        payload: filteredAllowedCharacters,
      });
      dispatch({
        type: "SET_GAME_TILES",
        payload: filteredAllowedCharacters,
      });
      dispatch({
        type: "SET_MASTER_EMPEROR_CHARACTER",
        payload: result.selectedCharacter,
      });
      dispatch({
        type: "SET_EMPEROR_CHARACTER",
        payload: result.selectedCharacter,
      });
      dispatch({
        type: "SET_DATA",
        payload: result,
      });
      dispatch({
        type: "SET_POINTS_FOR_CORRECT_GUESS",
        payload: pointsForCorrectGuess,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching data:", error);
        dispatch({ type: "SET_FETCH_ERROR", payload: error.message });
      } else {
        console.error("Unknown error fetching data:", error);
        dispatch({
          type: "SET_FETCH_ERROR",
          payload: "An unknown error occurred",
        });
      }
    }
  }, [dispatch]);

  return fetchData;
};

export default useFetchData;
