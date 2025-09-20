"use client";

import { useState, useEffect } from "react";
import { Zap, Target, Calendar, TrendingUp } from "lucide-react";

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

export default function QuickStats() {
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

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Current Streak */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.streak.current || 0}
            </p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 w-10 h-10 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Average Accuracy */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avg Accuracy
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.progress.averageAccuracy || "0.0"}%
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 w-10 h-10 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Average Speed */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Avg Speed
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.progress.averageSpeed || 0} CPM
            </p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Completions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completions
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.progress.totalCompletions || 0}
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 w-10 h-10 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
