"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Award, Target, Clock } from "lucide-react";

interface UserStats {
  streak: {
    current: number;
    longest: number;
    lastPracticeDate: string | null;
  };
  progress: {
    totalProblemsCompleted: number;
    totalCompletions: number;
    averageAccuracy: string;
    averageSpeed: number;
    totalPracticeTime: number;
  };
  trends: {
    accuracy: number;
    speed: number;
  };
  achievements: {
    count: number;
  };
}

export default function UserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getWeekProgress = () => {
    // Simple calculation - in a real app, you'd calculate based on actual practice dates
    const currentStreak = stats?.streak.current || 0;
    const weekProgress = Math.min((currentStreak / 7) * 100, 100);
    const daysPracticed = Math.min(currentStreak, 7);
    return { percentage: weekProgress, days: daysPracticed };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const weekProgress = getWeekProgress();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Your Progress
        </h3>

        <div className="space-y-4">
          {/* Weekly Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                This Week
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {weekProgress.days}/7 days
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${weekProgress.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Accuracy Trend */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Accuracy Trend
              </span>
              <span
                className={`text-sm font-medium ${
                  (stats?.trends.accuracy || 0) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(stats?.trends.accuracy || 0) >= 0 ? "+" : ""}
                {stats?.trends.accuracy || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    Math.max(
                      stats?.progress.averageAccuracy
                        ? parseFloat(stats.progress.averageAccuracy)
                        : 0,
                      0
                    ),
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Speed Trend */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Speed Trend
              </span>
              <span
                className={`text-sm font-medium ${
                  (stats?.trends.speed || 0) >= 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {(stats?.trends.speed || 0) >= 0 ? "+" : ""}
                {stats?.trends.speed || 0} CPM
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    Math.max((stats?.progress.averageSpeed || 0) / 2, 0),
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Completion Statistics */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-green-600" />
            Completion Stats
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Unique Problems
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.progress.totalProblemsCompleted || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Completions
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.progress.totalCompletions || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Award className="h-4 w-4 mr-2 text-yellow-600" />
            Recent Milestones
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Best Accuracy
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.progress.averageAccuracy || "0.0"}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Fastest Speed
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.progress.averageSpeed || 0} CPM
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Longest Streak
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats?.streak.longest || 0} days
              </span>
            </div>
          </div>
        </div>

        {/* Practice Time */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Practice Time
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatTime(stats?.progress.totalPracticeTime || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
