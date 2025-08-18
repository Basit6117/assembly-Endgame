import { useEffect, useState } from "react";
import "./App.css";
import { languages } from "./languages";
import { clsx } from "clsx";

function App() {
  //states
  const [currentWord, setCurrentWord] = useState("react");
  const [guessedLetter, setGuessedLetter] = useState([]);
  // derived value
  const wrongGuessCount = guessedLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  console.log(wrongGuessCount);
  // static
  const keyboard = "abcdefghijklmnopqrstuvwxyz";

  const langBadges = languages.map((lang, index) => {

    const isLangLost = index < wrongGuessCount
    const className = clsx("lang-chip", isLangLost && "lost")
    return (
        <span key={index} className={className} style={{backgroundColor:lang.backgroundColor, color:lang.color}}>
      {lang.name}
    </span>
    );
  });
  const characters = currentWord.split("").map((char, index) => {
    return (
      <span key={index}>
        {guessedLetter.includes(char) ? char.toUpperCase() : ""}
      </span>
    );
  });
  function handleClick(letter) {
    setGuessedLetter((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  const keyboardElement = keyboard.split("").map((letter) => {
    const isGussed = guessedLetter.includes(letter);
    const isCorrect = isGussed && currentWord.includes(letter);
    const isWrong = isGussed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        className={className}
        onClick={() => handleClick(letter)}
        key={letter}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  return (
    <>
      <header>
        <h3>Assembly: Endgame</h3>
        <p className="desc">
          Guess the word in under 8 attempts to keep the programming world safe
          from assembly
        </p>
      </header>
      <main>
        <div className="win-card">
          <h1>You Win!</h1>
          <p>Well done 🎉</p>
        </div>
         <div className="lost-card">
          <h1>Game Over !</h1>
          <p>You loss better start learning assembly 😂</p>
        </div>
        <section className="lang-container">{langBadges}</section>
        <div className="span-container">{characters}</div>
        <section className="keyboard-container">{keyboardElement}</section>
      </main>
    </>
  );
}

export default App;
