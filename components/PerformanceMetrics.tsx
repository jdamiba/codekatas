import { Zap, Target, Clock, TrendingUp } from "lucide-react";

interface PerformanceMetricsProps {
  metrics: {
    totalCharacters?: number;
    correctCharacters?: number;
    totalErrors?: number;
    accuracyPercentage?: number;
    charactersPerMinute?: number;
    sessionDurationSeconds?: number;
  };
  isStarted: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

export default function PerformanceMetrics({
  metrics,
  isStarted,
  isPaused,
  isCompleted,
}: PerformanceMetricsProps) {
  const {
    totalCharacters = 0,
    totalErrors = 0,
    accuracyPercentage = 0,
    charactersPerMinute = 0,
    sessionDurationSeconds = 0,
  } = metrics;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600";
    if (accuracy >= 90) return "text-yellow-600";
    return "text-red-600";
  };

  const getSpeedColor = (speed: number) => {
    if (speed >= 100) return "text-green-600";
    if (speed >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Metrics
        </h3>

        <div className="space-y-4">
          {/* Accuracy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Accuracy
              </span>
            </div>
            <span
              className={`text-lg font-semibold ${getAccuracyColor(
                accuracyPercentage
              )}`}
            >
              {accuracyPercentage.toFixed(1)}%
            </span>
          </div>

          {/* Speed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Speed
              </span>
            </div>
            <span
              className={`text-lg font-semibold ${getSpeedColor(
                charactersPerMinute
              )}`}
            >
              {charactersPerMinute} CPM
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Time
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatTime(sessionDurationSeconds)}
            </span>
          </div>

          {/* Progress Stats */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-300">
                  Characters
                </span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {totalCharacters}
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-300">Errors</span>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {totalErrors}
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Status
              </span>
              <div className="flex items-center space-x-2">
                {!isStarted && (
                  <>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Ready
                    </span>
                  </>
                )}
                {isStarted && !isPaused && !isCompleted && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Typing</span>
                  </>
                )}
                {isPaused && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Paused</span>
                  </>
                )}
                {isCompleted && (
                  <>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-600">Completed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          {isStarted && totalCharacters > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {accuracyPercentage < 90 && (
                    <p>💡 Focus on accuracy over speed</p>
                  )}
                  {accuracyPercentage >= 95 && charactersPerMinute < 80 && (
                    <p>💡 Great accuracy! Try to increase speed gradually</p>
                  )}
                  {accuracyPercentage >= 95 && charactersPerMinute >= 80 && (
                    <p>💡 Excellent performance!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
