"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import CodeEditor from "./CodeEditor";
import PerformanceMetrics from "./PerformanceMetrics";
import { PerformanceTracker } from "@/lib/performance-tracker";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  solution_code: string;
  estimated_time_minutes: number;
}

interface TypingInterfaceProps {
  problem: Problem;
  sessionId: string | null;
}

export default function TypingInterface({
  problem,
  sessionId,
}: TypingInterfaceProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(0);

  const performanceTracker = useRef<PerformanceTracker>(
    new PerformanceTracker()
  );
  const [metrics, setMetrics] = useState(
    performanceTracker.current.getRealTimeMetrics()
  );

  const solutionCode = problem.solution_code.replace(/\\n/g, "\n");

  // Update metrics in real-time
  const updateMetrics = useCallback(() => {
    setMetrics(performanceTracker.current.getRealTimeMetrics());
  }, []);

  // Handle completion (automatic when 100% correct)
  const handleCompletion = useCallback(async () => {
    if (!sessionId) return;

    const finalMetrics = performanceTracker.current.getMetrics();

    try {
      await fetch(`/api/attempts/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalCharacters: finalMetrics.totalCharacters,
          correctCharacters: finalMetrics.correctCharacters,
          totalErrors: finalMetrics.totalErrors,
          sessionDurationSeconds: finalMetrics.sessionDurationSeconds,
          accuracyPercentage: finalMetrics.accuracyPercentage,
          charactersPerMinute: finalMetrics.charactersPerMinute,
          isCompleted: true,
          keystrokeEvents: finalMetrics.keystrokeEvents,
        }),
      });
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  }, [sessionId]);

  // Handle keystroke events
  const handleKeystroke = useCallback(
    (position: number, typedChar: string, expectedChar: string) => {
      if (!isStarted || isPaused || isCompleted) return;

      performanceTracker.current.recordKeystroke(
        position,
        typedChar,
        expectedChar
      );
      updateMetrics();
    },
    [isStarted, isPaused, isCompleted, updateMetrics]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (value: string) => {
      if (!isStarted || isPaused || isCompleted) return;

      setUserInput(value);
      setCurrentPosition(value.length);

      // Check if completed
      if (value === solutionCode) {
        setIsCompleted(true);
        handleCompletion();
      }
    },
    [isStarted, isPaused, isCompleted, solutionCode, handleCompletion]
  );

  // Handle manual submit
  const handleSubmit = async () => {
    if (!sessionId || isCompleted) return;

    const finalMetrics = performanceTracker.current.getMetrics();

    try {
      await fetch(`/api/attempts/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalCharacters: finalMetrics.totalCharacters,
          correctCharacters: finalMetrics.correctCharacters,
          totalErrors: finalMetrics.totalErrors,
          sessionDurationSeconds: finalMetrics.sessionDurationSeconds,
          accuracyPercentage: finalMetrics.accuracyPercentage,
          charactersPerMinute: finalMetrics.charactersPerMinute,
          isCompleted: true,
          keystrokeEvents: finalMetrics.keystrokeEvents,
        }),
      });

      // Mark as completed and show results
      setIsCompleted(true);
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  };

  // Start the typing session
  const startSession = () => {
    setIsStarted(true);
    setIsPaused(false);
    performanceTracker.current.reset();
    updateMetrics();
  };

  // Pause/Resume session
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Reset session
  const resetSession = () => {
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setUserInput("");
    setCurrentPosition(0);
    performanceTracker.current.reset();
    updateMetrics();
  };

  // Go back to dashboard
  const goBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {problem.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {problem.category} • {problem.estimated_time_minutes} min
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isStarted ? (
                <button
                  onClick={startSession}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start</span>
                </button>
              ) : (
                <>
                  {!isCompleted && (
                    <>
                      <button
                        onClick={togglePause}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        {isPaused ? (
                          <>
                            <Play className="h-4 w-4" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4" />
                            <span>Pause</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Submit</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={resetSession}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Code Editor - Takes up 3/4 of the space */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {problem.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {problem.description}
                </p>
              </div>
              <div className="p-6">
                <CodeEditor
                  solutionCode={solutionCode}
                  userInput={userInput}
                  onInputChange={handleInputChange}
                  onKeystroke={handleKeystroke}
                  isStarted={isStarted}
                  isPaused={isPaused}
                  isCompleted={isCompleted}
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics Sidebar */}
          <div className="space-y-6">
            <PerformanceMetrics
              metrics={metrics}
              isStarted={isStarted}
              isPaused={isPaused}
              isCompleted={isCompleted}
            />

            {/* Progress Indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Progress
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Characters
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {currentPosition} / {solutionCode.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            (currentPosition / solutionCode.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Completed!</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <div>
                          Accuracy:{" "}
                          {metrics.accuracyPercentage?.toFixed(1) || "0.0"}%
                        </div>
                        <div>
                          Speed:{" "}
                          {metrics.charactersPerMinute?.toFixed(0) || "0"} CPM
                        </div>
                        <div>
                          Time:{" "}
                          {Math.round(metrics.sessionDurationSeconds || 0)}s
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
