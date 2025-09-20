"use client";

import { useState, useEffect, useRef } from "react";

interface CodeEditorProps {
  solutionCode: string;
  userInput: string;
  onInputChange: (value: string) => void;
  onKeystroke: (
    position: number,
    typedChar: string,
    expectedChar: string
  ) => void;
  isStarted: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

export default function CodeEditor({
  solutionCode,
  userInput,
  onInputChange,
  onKeystroke,
  isStarted,
  isPaused,
  isCompleted,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Focus the textarea when session starts
  useEffect(() => {
    if (isStarted && !isPaused && !isCompleted) {
      textareaRef.current?.focus();
    }
  }, [isStarted, isPaused, isCompleted]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;

    setCursorPosition(position);

    // Only allow input if session is started and not paused/completed
    if (!isStarted || isPaused || isCompleted) {
      e.preventDefault();
      return;
    }

    // Prevent going beyond the solution length
    if (value.length > solutionCode.length) {
      return;
    }

    // Record keystroke for performance tracking
    if (value.length > userInput.length) {
      const newChar = value[value.length - 1];
      const expectedChar = solutionCode[value.length - 1];
      onKeystroke(value.length - 1, newChar, expectedChar);
    }

    onInputChange(value);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Tab for indentation - this is essential for code
    if (e.key === "Tab") {
      e.preventDefault();
      // Insert tab character at cursor position
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        userInput.substring(0, start) + "\t" + userInput.substring(end);

      // Update input
      onInputChange(newValue);

      // Set cursor position after the tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Prevent backspace beyond current input
    if (e.key === "Backspace" && cursorPosition <= userInput.length) {
      // Allow normal backspace behavior
      return;
    }

    // Allow arrow keys for navigation within the textarea
    // Only prevent copy/paste and other unwanted shortcuts
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Render the code with syntax highlighting and error indicators
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderCodeDisplay = () => {
    if (!solutionCode) {
      return (
        <div className="absolute inset-0 p-4 font-mono text-sm leading-relaxed text-gray-500">
          No solution code available
        </div>
      );
    }

    const lines = solutionCode.split("\n");
    const userLines = userInput.split("\n");

    return (
      <div className="absolute inset-0 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap pointer-events-none overflow-auto">
        {lines.map((line, lineIndex) => {
          const userLine = userLines[lineIndex] || "";

          return (
            <div key={lineIndex} className="flex">
              <span className="text-gray-400 mr-4 select-none w-8 text-right">
                {lineIndex + 1}
              </span>
              <span className="flex-1">
                {line.split("").map((char, charIndex) => {
                  const globalIndex =
                    lineIndex === 0
                      ? charIndex
                      : lines.slice(0, lineIndex).join("\n").length +
                        1 +
                        charIndex;

                  const userChar = userLine[charIndex];
                  const isTyped = globalIndex < userInput.length;
                  const isCorrect = userChar === char;
                  const isCurrent = globalIndex === userInput.length;

                  let className = "inline-block";

                  if (isTyped) {
                    className += isCorrect
                      ? " bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                      : " bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100";
                  } else if (isCurrent) {
                    className += " bg-blue-100 dark:bg-blue-900";
                  }

                  return (
                    <span key={charIndex} className={className}>
                      {char === " " ? "\u00A0" : char}
                    </span>
                  );
                })}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Simple Code Display */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 min-h-[400px]">
        <div className="text-gray-400 text-xs mb-2">Solution Code:</div>
        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
          {solutionCode}
        </pre>
      </div>

      {/* Typing Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Type the solution code below:
          </div>
          <textarea
            ref={textareaRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full h-64 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              isStarted
                ? "Start typing the solution..."
                : "Click Start to begin typing..."
            }
            disabled={!isStarted || isPaused || isCompleted}
          />

          {/* Status Messages */}
          {!isStarted && (
            <div className="mt-2 text-center text-gray-500 dark:text-gray-400 text-sm">
              Click &quot;Start&quot; button above to begin typing
            </div>
          )}
          {isPaused && (
            <div className="mt-2 text-center text-yellow-600 dark:text-yellow-400 text-sm">
              Session is paused. Click &quot;Resume&quot; to continue.
            </div>
          )}
          {isCompleted && (
            <div className="mt-2 text-center text-green-600 dark:text-green-400 text-sm">
              🎉 Problem submitted! Check your results in the progress panel.
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Instructions:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Type the solution code exactly as shown above</li>
          <li>• Focus on accuracy over speed</li>
          <li>• Use Tab for indentation and arrow keys to navigate</li>
          <li>
            • Click &quot;Submit&quot; when done or continue until 100% complete
          </li>
          <li>• Your progress will be tracked in real-time</li>
        </ul>
      </div>
    </div>
  );
}
