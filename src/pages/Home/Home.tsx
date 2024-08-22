import React, { useEffect, useReducer } from "react";

import {
  StyledHomeContainer,
  StyledWinningChengyuBoard,
  StyledPlayingArea,
  StyledBackgroundImage,
  StyledImperialSeal,
} from "./StyledHome";
import { WinningChengyu } from "../../components/WinningChengyu/WinningChengyu";
import ChosenTilesArea from "../../components/PlayingArea/PlayingArea";
import { reducer, initialState } from "../../reducer/reducer";
import useFetchData from "../../customHooks/useFetchData";
import { CharacterArea } from "../../components/CharacterArea/CharacterArea";

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    data,
    winningChengyu,
    gameTiles,
    chengyuAnswers,
    selectedTiles,
    emperorCharacter,
    isEmperorAnimationComplete,
    isAnimating,
    isGuessCorrect,
  } = state;
  useFetchData(dispatch);

  const handleEmperorAnimationEnd = () => {
    dispatch({ type: "SET_IS_EMPEROR_ANIMATION_COMPLETE", payload: true });
  };

  useEffect(() => {
    console.log("Answers", chengyuAnswers);
  }, [chengyuAnswers]);

  useEffect(() => {
    console.log("isGuessCorrect", isGuessCorrect);
  }, [isGuessCorrect]);

  const checkWinningChengyu = () => {
    if (selectedTiles.length < 4) {
      return;
    }
    const joinedTiles = selectedTiles.join("");
    if (chengyuAnswers.includes(joinedTiles)) {
      dispatch({ type: "SET_IS_ANIMATING", payload: true });
      setTimeout(() => {
        dispatch({ type: "SET_IS_ANIMATING", payload: false });
      }, 2500);

      dispatch({
        type: "SET_CHENGYU_ANSWERS",
        payload: state.chengyuAnswers.filter(
          (chengyu: string) => chengyu !== joinedTiles
        ),
      });
      setTimeout(() => {
        console.log("Correct Guess");
        dispatch({
          type: "SET_IS_GUESS_CORRECT",
          payload: true,
        });
      }, 1000);
      setTimeout(() => {
        console.log("Winning Chengyu", joinedTiles);
        resetTiles();
        dispatch({
          type: "SET_WINNING_CHENGYU",
          payload: [...state.winningChengyu, joinedTiles],
        });
      }, 5000);
    } else {
      setTimeout(() => {
        resetTiles();
      }, 5000);
    }
  };

  useEffect(() => {
    checkWinningChengyu();
  }, [selectedTiles]);

  const resetTiles = () => {
    dispatch({ type: "SET_GAME_TILES", payload: state.masterTiles });
    dispatch({
      type: "SET_EMPEROR_CHARACTER",
      payload: state.masterEmperorCharacter,
    });
    dispatch({ type: "SET_SELECTED_TILES", payload: [] });
    dispatch({ type: "SET_IS_GUESS_CORRECT", payload: false });
  };

  const onEmperorClick = (chengyu: string) => {
    dispatch({
      type: "SET_SELECTED_TILES",
      payload: [...state.selectedTiles, chengyu],
    });
    dispatch({ type: "SET_EMPEROR_CHARACTER", payload: " " });
  };

  const onEunuchClick = (eunuchCharacter: string) => {
    dispatch({
      type: "SET_SELECTED_TILES",
      payload: [...state.selectedTiles, eunuchCharacter],
    });
    dispatch({
      type: "SET_GAME_TILES",
      payload: state.gameTiles.map((char: string) =>
        char === eunuchCharacter ? "" : char
      ),
    });
  };

  return (
    <StyledHomeContainer>
      <StyledBackgroundImage
        src="/src/assets/Chinese Tree.jpg"
        alt="Chinese Tree"
      />
      {isGuessCorrect && (
        <StyledImperialSeal
          src="/src/assets/Imperial_Seal_transparent.png"
          alt="Imperial Seal"
        />
      )}
      {data && emperorCharacter && (
        <StyledPlayingArea>
          <CharacterArea
            emperorCharacter={emperorCharacter}
            onEmperorClick={onEmperorClick}
            handleEmperorAnimationEnd={handleEmperorAnimationEnd}
            isEmperorAnimationComplete={isEmperorAnimationComplete}
            gameTiles={gameTiles}
            onEunuchClick={onEunuchClick}
          />
          <ChosenTilesArea
            chosenCharacters={selectedTiles}
            className={isAnimating ? "fade-out" : ""}
          />
          {winningChengyu && (
            <StyledWinningChengyuBoard className={isAnimating ? "fade-in" : ""}>
              {winningChengyu.map((chengyu: string, index: number) => (
                <WinningChengyu key={index} winningChengYu={chengyu} />
              ))}
            </StyledWinningChengyuBoard>
          )}
        </StyledPlayingArea>
      )}
    </StyledHomeContainer>
  );
};

export default Home;
export { Home };
