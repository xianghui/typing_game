"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Never underestimate the power of a good book.",
  "The early bird catches the worm.",
  "Practice makes perfect.",
  "The only way to do great work is to love what you do.",
];

export default function Home() {
  const [currentText, setCurrentText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    setCurrentText(texts[randomIndex]);
    setInputValue("");
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(0);
    setErrors(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!startTime) {
      setStartTime(Date.now());
    }

    let currentErrors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        currentErrors++;
      }
    }
    setErrors(currentErrors);

    const now = Date.now();
    const timeTakenInSeconds = (now - (startTime || now)) / 1000;

    // Calculate WPM
    if (timeTakenInSeconds > 0) {
      const wordsTyped = value.length / 5; // Standard WPM calculation (characters / 5)
      const calculatedWpm = Math.round((wordsTyped / timeTakenInSeconds) * 60);
      setWpm(calculatedWpm);
    } else {
      setWpm(0);
    }

    // Calculate Accuracy
    if (value.length > 0) {
      const calculatedAccuracy =
        ((value.length - currentErrors) / value.length) * 100;
      setAccuracy(Math.round(calculatedAccuracy));
    } else {
      setAccuracy(0);
    }

    if (value.length === currentText.length) {
      setEndTime(now);
    }
  };

  // No longer needed as calculations are done in handleInputChange
  const calculateResults = (correctChars: number, currentErrors: number) => {
    // This function can be removed or left empty if not used elsewhere
  };

  const getCharClass = (char: string, index: number) => {
    if (index < inputValue.length) {
      return char === inputValue[index] ? "text-green-500" : "text-red-500";
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Typing Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-2xl p-4 border rounded-md bg-gray-50 dark:bg-gray-800 tracking-wide leading-relaxed">
            {currentText.split("").map((char, index) => (
              <span key={index} className={getCharClass(char, index)}>
                {char}
              </span>
            ))}
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="text-lg p-3"
            disabled={endTime !== null}
          />
          <div className="flex justify-around text-xl font-semibold">
            <span>WPM: {wpm}</span>
            <span>Accuracy: {accuracy}%</span>
            <span>Errors: {errors}</span>
          </div>
          <div className="flex justify-center">
            <Button onClick={resetGame} className="text-lg px-6 py-3">
              Reset Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
