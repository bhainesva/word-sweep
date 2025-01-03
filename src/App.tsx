import { useState, forwardRef } from "react";
import classNames from "classnames";
import cards from "../data/cards.json"

import './App.css'

interface Word  {
  word: string;
  definition: string;
}

interface Card {
  level: "everyday" | "intermediate" | "challenging"
  firstLetter: string
  words: Word[]
}

const everydayCards = cards.filter(card => card.level === "everyday");
const intermediateCards = cards.filter(card => card.level === "intermediate");
const challengingCards = cards.filter(card => card.level === "challenging");

function pickCard(levels: string[]): Card {
  const level = levels[Math.round(Math.random() * levels.length)]
  console.log("Picked: ", level, " from ", levels);

  if (level === "everyday") return (everydayCards as Card[])[Math.floor(Math.random() * everydayCards.length)];
  if (level === "intermediate") return (intermediateCards as Card[])[Math.floor(Math.random() * intermediateCards.length)];

  return (challengingCards as Card[])[Math.floor(Math.random() * challengingCards.length)];
}

function App() {
  const [activeDifficulties, setActiveDifficulties] = useState(["everyday", "intermediate", "challenging"]);
  const [selectedCard, setSelectedCard] = useState(() => pickCard(activeDifficulties));

  const onNewWords = () => {
    setSelectedCard(pickCard(activeDifficulties));
  }

  const toggleDifficulty = (level: string) => {
    if (activeDifficulties.includes(level)) {
      setActiveDifficulties(activeDifficulties.filter(l => l !== level));
    } else {
      setActiveDifficulties([...activeDifficulties, level]);
    }
  }

  return (
    <>
    <h1>Word Sweep!</h1>
    <h2>First Letter = <span className="mono">{selectedCard.firstLetter}</span></h2>
    <h2>Difficulty: {selectedCard.level}</h2>
    <ol>
      {selectedCard.words.map((word, i) => (
        <li key={word.word}>
          <Word word={word} i={i} ref={el => {
            if (i === 0) {
              el?.focus();
            }
          }} />
        </li>
      ))}
    </ol>

    

    <button className="bold center" onClick={onNewWords}>New Card</button>

    <h2>Active Difficulties</h2>
    <div className="difficulties">
      <button disabled={activeDifficulties.includes("everyday") && activeDifficulties.length === 1} className={classNames("everyday", {"active": activeDifficulties.includes("everyday")})} onClick={() => toggleDifficulty("everyday")}>Everyday</button>
      <button disabled={activeDifficulties.includes("intermediate") && activeDifficulties.length === 1} className={classNames("intermediate", {"active": activeDifficulties.includes("intermediate")})} onClick={() => toggleDifficulty("intermediate")}>Intermediate</button>
      <button disabled={activeDifficulties.includes("challenging") && activeDifficulties.length === 1} className={classNames("challenging", {"active": activeDifficulties.includes("challenging")})} onClick={() => toggleDifficulty("challenging")}>Challenging</button>
    </div>
    </>
  )
}

interface WordProps {
  word: Word;
  i: number;
}

const Word = forwardRef<HTMLInputElement, WordProps>((props: {word: Word, i: number}, ref) => {
  const { word, i }  = props;
  const [value, setValue] = useState("");
  const cls = classNames({
    correct: value.toLowerCase() === word.word.toLowerCase(),
  })

  return (
    <>
      <div className="word"><strong>Word {i+1}</strong>: {word.definition}</div>
      <div className="flex">
        <input ref={ref} className={cls} value={value} onChange={e => setValue(e.target.value)}></input>  
        <button className="bold small" onClick={() => {setValue(word.word)}}>Reveal</button>
      </div>
    </>
  )
})

export default App
