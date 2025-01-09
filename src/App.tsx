import { useState, forwardRef } from "react";
import classNames from "classnames";
import cards from "../data/cards.json";
import { FaGear } from "react-icons/fa6";

import "./App.css";
import { IoClose } from "react-icons/io5";

interface Word {
  word: string;
  definition: string;
}

interface Card {
  level: "everyday" | "intermediate" | "challenging";
  firstLetter: string;
  words: Word[];
}

export const STORAGE_KEY = "word-sweep";

const everydayCards = cards.filter((card) => card.level === "everyday");
const intermediateCards = cards.filter((card) => card.level === "intermediate");
const challengingCards = cards.filter((card) => card.level === "challenging");

function pickCard(levels: string[]): Card {
  const level = levels[Math.floor(Math.random() * levels.length)];

  if (level === "everyday") {
    return (everydayCards as Card[])[
      Math.floor(Math.random() * everydayCards.length)
    ];
  }
  if (level === "intermediate") {
    return (intermediateCards as Card[])[
      Math.floor(Math.random() * intermediateCards.length)
    ];
  }

  return (challengingCards as Card[])[
    Math.floor(Math.random() * challengingCards.length)
  ];
}

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(
    Boolean(localStorage.getItem(STORAGE_KEY)) || false
  );

  return (
    <>
      <header className="flex justify-between items-center">
        <div></div>
        <h1>Word Sweep!</h1>
        <button
          onClick={() => {
            setSettingsOpen((old) => !old);
          }}
        >
          <FaGear />
        </button>
      </header>
      <Questions easyMode={easyMode} />
      {settingsOpen && (
        <Settings
          checked={easyMode}
          onChange={(easyMode) => {
            setEasyMode(easyMode);
            localStorage.setItem(STORAGE_KEY, easyMode ? "1" : "");
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  );
}

interface WordProps {
  word: Word;
  i: number;
  value: string;
  onChange: (value: string) => void;
  correct: boolean;
}

function Settings(props: {
  onClose: () => void;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="modal flex items-center">
      <button className="absolute top-10 right-10" onClick={props.onClose}>
        <IoClose />
      </button>
      <label className="flex justify-center gap-4">
        <input
          onChange={(val) => props.onChange(val.target.checked)}
          type="checkbox"
          id="easymode"
          checked={props.checked}
        />
        <div className="text-lg">
          If this checkbox is checked, inputs will highlight green as soon as
          the correct word is typed in them. If it is unchecked (the default),
          the inputs will only become green once all 3 words are correct.
        </div>
      </label>
    </div>
  );
}

function Questions(props: { easyMode: boolean }) {
  const { easyMode } = props;
  const [activeDifficulties, setActiveDifficulties] = useState([
    "everyday",
    "intermediate",
    "challenging",
  ]);
  const [selectedCard, setSelectedCard] = useState(() =>
    pickCard(activeDifficulties)
  );
  const [inputs, setInputs] = useState(["", "", ""]);

  const allCorrect = inputs.every(
    (input, i) => input === selectedCard.words[i].word
  );

  const onNewWords = () => {
    setSelectedCard(pickCard(activeDifficulties));
    setInputs(["", "", ""]);
  };

  const toggleDifficulty = (level: string) => {
    if (activeDifficulties.includes(level)) {
      setActiveDifficulties(activeDifficulties.filter((l) => l !== level));
    } else {
      setActiveDifficulties([...activeDifficulties, level]);
    }
  };

  return (
    <>
      <h2>
        First Letter = <span className="mono">{selectedCard.firstLetter}</span>
      </h2>
      <h2>Difficulty: {selectedCard.level}</h2>
      <ol>
        {selectedCard.words.map((word, i) => (
          <li key={word.word}>
            <Word
              word={word}
              i={i}
              value={inputs[i]}
              correct={
                inputs[i] === selectedCard.words[i].word &&
                (allCorrect || easyMode)
              }
              onChange={(value) => {
                setInputs((old) => {
                  const newInputs = [...old];
                  newInputs[i] = value;
                  return newInputs;
                });
              }}
            />
          </li>
        ))}
      </ol>

      <div className="mt-auto flex flex-col items-center">
        <button className="bold center" onClick={onNewWords}>
          New Card
        </button>

        <h2>Active Difficulties</h2>
        <div className="difficulties">
          <button
            disabled={
              activeDifficulties.includes("everyday") &&
              activeDifficulties.length === 1
            }
            className={classNames("everyday", {
              active: activeDifficulties.includes("everyday"),
            })}
            onClick={() => toggleDifficulty("everyday")}
          >
            Everyday
          </button>
          <button
            disabled={
              activeDifficulties.includes("intermediate") &&
              activeDifficulties.length === 1
            }
            className={classNames("intermediate", {
              active: activeDifficulties.includes("intermediate"),
            })}
            onClick={() => toggleDifficulty("intermediate")}
          >
            Intermediate
          </button>
          <button
            disabled={
              activeDifficulties.includes("challenging") &&
              activeDifficulties.length === 1
            }
            className={classNames("challenging", {
              active: activeDifficulties.includes("challenging"),
            })}
            onClick={() => toggleDifficulty("challenging")}
          >
            Challenging
          </button>
        </div>
      </div>
    </>
  );
}

const Word = forwardRef<HTMLInputElement, WordProps>((props, ref) => {
  const { word, i, value, onChange, correct } = props;
  const cls = classNames({
    correct: correct,
  });

  return (
    <>
      <div className="word">
        <strong>Word {i + 1}</strong>: {word.definition}
      </div>
      <div className="flex gap-4">
        <input
          value={value}
          ref={ref}
          className={cls}
          onChange={(e) => onChange(e.target.value)}
        ></input>
        <button
          className="bold small"
          onClick={() => {
            props.onChange(word.word);
          }}
        >
          Reveal
        </button>
      </div>
    </>
  );
});

export default App;
