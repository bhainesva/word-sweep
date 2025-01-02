import { useState, forwardRef } from "react";
import classNames from "classnames";
import rawWords from "../data/words.txt?raw"
import './App.css'

interface Word { 
  word: string;
  def: string;
}

const words: Word[] = rawWords.split('\n').map((word) => word.split("|")).map(word => ({
  word: word[0],
  def: word[2],
}))

// Select 3 consecutive words that begin with the same letter
function pickWords(): Word[] {
  const startingIndex = Math.floor(Math.random() * words.length - 3);
  let index = startingIndex;
  let decreasing = true;

  while (!words[index].word.startsWith(words[index + 2].word[0])) {
    if (decreasing) {
      index -= 1;
    } else {
      index += 1;
    }

    if (index === 0) {
      index = startingIndex;
      decreasing = false;
    }
  }

  return words.slice(index, index + 3)
}

function App() {
  const [selectedWords, setSelectedWords] = useState(() => pickWords());

  const onNewWords = () => {
    setSelectedWords(pickWords());
  }

  return (
    <>
    <h1>Word Sweep!</h1>
    <h2>First Letter = <span className="mono">{selectedWords[0].word[0].toUpperCase()}</span></h2>
    <ol>
      {selectedWords.map((word, i) => (
        <li key={word.word}>
          <Word word={word} i={i} ref={el => {
            if (i === 0) {
              el?.focus();
            }
          }} />
        </li>
      ))}
    </ol>

    <button className="bold center" onClick={onNewWords}>New Words</button>
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
      <div className="word"><strong>Word {i+1}</strong>: {word.def}</div>
      <div className="flex">
        <input ref={ref} className={cls} value={value} onChange={e => setValue(e.target.value)}></input>  
        <button className="bold small" onClick={() => {setValue(word.word)}}>Reveal</button>
      </div>
    </>
  )
})

export default App
