"use client";

import { BookOpen, Lightbulb, Code2 } from "lucide-react";

interface SolutionExplanationProps {
  solutionExplanation?: string;
  keyConcepts?: string[];
  title: string;
}

export default function SolutionExplanation({
  solutionExplanation,
  keyConcepts,
  title,
}: SolutionExplanationProps) {
  if (!solutionExplanation && (!keyConcepts || keyConcepts.length === 0)) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Solution Explanation
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Understanding the {title} problem and its key concepts
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Concepts */}
        {keyConcepts && keyConcepts.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Key Concepts
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {keyConcepts.map((concept, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Solution Explanation */}
        {solutionExplanation && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Code2 className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                How the Solution Works
              </h4>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {solutionExplanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
