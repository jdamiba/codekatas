"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Target, Play, Star } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  solution_explanation?: string;
  key_concepts?: string[];
  estimated_time_minutes: number;
  created_at: string;
}

export default function ProblemsList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const categories = [
    { value: "all", label: "All Problems" },
    { value: "arrays", label: "Arrays" },
    { value: "strings", label: "Strings" },
    { value: "loops", label: "Loops" },
    { value: "searching", label: "Searching" },
    { value: "algorithms", label: "Algorithms" },
  ];

  const difficultyLevels = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner (★)" },
    { value: "intermediate", label: "Intermediate (★★)" },
    { value: "advanced", label: "Advanced (★★★)" },
  ];

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === "all"
          ? "/api/problems"
          : `/api/problems?category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();

      let filteredProblems = data.problems || [];

      // Apply difficulty filter
      if (selectedDifficulty !== "all") {
        filteredProblems = filteredProblems.filter((problem: Problem) => {
          const difficulty = getDifficultyLevel(problem.estimated_time_minutes);
          return difficulty.level.toLowerCase() === selectedDifficulty;
        });
      }

      setProblems(filteredProblems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty]);

  useEffect(() => {
    fetchProblems();
  }, [selectedCategory, selectedDifficulty, fetchProblems]);

  const getDifficultyLevel = (timeMinutes: number) => {
    if (timeMinutes <= 8)
      return { level: "Beginner", color: "green", stars: 1 };
    if (timeMinutes <= 12)
      return { level: "Intermediate", color: "yellow", stars: 2 };
    return { level: "Advanced", color: "red", stars: 3 };
  };

  const getDifficultyColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "red":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const startProblem = async (problemId: string) => {
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problemId }),
      });

      if (response.ok) {
        const data = await response.json();
        // Navigate to typing interface with session ID
        window.location.href = `/practice/${problemId}?session=${data.sessionId}`;
      }
    } catch (error) {
      console.error("Error starting problem:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty Level
          </h4>
          <div className="flex flex-wrap gap-2">
            {difficultyLevels.map((difficulty) => (
              <button
                key={difficulty.value}
                onClick={() => setSelectedDifficulty(difficulty.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty.value
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {difficulty.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {problems.length} problem{problems.length !== 1 ? "s" : ""} found
          {(selectedCategory !== "all" || selectedDifficulty !== "all") && (
            <span className="ml-1">
              (
              {selectedCategory !== "all" ? `${selectedCategory} category` : ""}
              {selectedCategory !== "all" && selectedDifficulty !== "all"
                ? ", "
                : ""}
              {selectedDifficulty !== "all"
                ? `${selectedDifficulty} level`
                : ""}
              )
            </span>
          )}
        </p>
        {(selectedCategory !== "all" || selectedDifficulty !== "all") && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {problems.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No problems found with the current filters.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your category or difficulty filters.
            </p>
          </div>
        ) : (
          problems.map((problem) => {
            const difficulty = getDifficultyLevel(
              problem.estimated_time_minutes
            );
            return (
              <div
                key={problem.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {problem.title}
                      </h3>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                        {problem.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          difficulty.color
                        )}`}
                      >
                        {difficulty.level}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{problem.estimated_time_minutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span>
                          {Array(difficulty.stars).fill("★").join("")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startProblem(problem.id)}
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
