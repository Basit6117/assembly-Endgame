import { useState } from "react";
import "./App.css";
import { languages } from "./languages";
import { clsx } from "clsx";
import { getFarewellText, getRandomWords } from "./utile";
import Confetti from 'react-confetti'

function App() {
  //states
  const [currentWord, setCurrentWord] = useState(()=>getRandomWords());
  const [guessedLetter, setGuessedLetter] = useState([]);

  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetter
    .filter((letter) => !currentWord.includes(letter)).length;
  const isGameWon = currentWord.split("")
    .every((letter) => guessedLetter.includes(letter));
  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameLost || isGameWon;
  const lastGuessed = guessedLetter[guessedLetter.length - 1];
  const incorrectGuessed = lastGuessed && !currentWord.includes(lastGuessed)

  // console.log(incorrectGuessed)
  const winLossStatus = clsx("game-status", {
    won: isGameWon,
    loss: isGameLost,
    farewellMsg: incorrectGuessed && !isGameOver
  })
  // static
  const keyboard = "abcdefghijklmnopqrstuvwxyz";

 function startNewGame(){
  setCurrentWord(getRandomWords())
  setGuessedLetter([])
 }
  const langBadges = languages.map((lang, index) => {
    const isLangLost = index < wrongGuessCount;
    const className = clsx("lang-chip", isLangLost && "lost");
    return (
      <span
        key={index}
        className={className}
        style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
      >
        {lang.name}
      </span>
    );
  });
  const characters = currentWord.split("").map((char, index) => {
    const shouldRevealLetter = guessedLetter.includes(char) || isGameLost
     const notGuessed =  !guessedLetter.includes(char)  && currentWord.includes(char)
     const notSelectedChar = clsx(notGuessed &&  "wrong-char")
    return (
      <span key={index} className={notSelectedChar} >
        {shouldRevealLetter ? char.toUpperCase() : ""}
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
        disabled={isGameOver}
        aria-disabled={guessedLetter.includes(letter)}
        aria-label={`Letter ${letter}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  function gameStatus() {
    if (incorrectGuessed && !isGameOver) {
      return (
        <p>
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }
    if (!isGameOver) {
      return null;
    }
    if (isGameLost) {
      return (
        <>
          <h1>Game Over !</h1>
          <p>You loss better start learning assembly 😂</p>
        </>
      )
    } else {
      return (
        <>
          <h1>You Win!</h1>
          <p>Well done 🎉</p>

        </>
      )
    }

  }

  return (
    <div className="container">
      {isGameWon &&
       <Confetti 
            recycle={false}
            numberOfPieces={1000}
          />}
      <header>
        <h3>Assembly: Endgame</h3>
        <p className="desc">
          Guess the word in under 8 attempts to keep the programming world safe
          from assembly
        </p>
      </header>
      <main>
        <div
          aria-live="polite"
          role="status"
          className={winLossStatus}>
          {gameStatus()}
        </div>

        <section className="lang-container">{langBadges}</section>
        <div className="span-container" >
          {characters}
        </div>

        {/* screen reader only */}
        <section
          className="sr-only"
          aria-live="polite"
          role="status"
        >
          <p>
            {currentWord.includes(lastGuessed) ?
              `Correct! The letter ${lastGuessed} is in the word.` :
              `Sorry, the letter ${lastGuessed} is not in the word.`
            }
            You have {numGuessesLeft} attempts left.
          </p>
          <p>Current word: {currentWord.split("").map(letter =>
            guessedLetter.includes(letter) ? letter + "." : "blank.")
            .join(" ")}</p>

        </section>

        <section
          className="keyboard-container"
        >
          {keyboardElement}
        </section>
        {isGameOver && <button onClick={startNewGame} className="newGame-btn">Start New Game</button>}
      </main>
    </div>
  );
}

export default App;
