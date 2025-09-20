"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import TypingInterface from "@/components/TypingInterface";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  solution_code: string;
  estimated_time_minutes: number;
}

export default function PracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const problemId = (params.id as string) || "";
  const sessionId = searchParams.get("session");

  const fetchProblem = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/problems/${problemId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch problem");
      }

      const data = await response.json();
      setProblem(data.problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      setError("Failed to load problem. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (problemId) {
      fetchProblem();
    }
  }, [problemId, fetchProblem]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Problem Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The problem you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <SignedIn>
      <TypingInterface problem={problem} sessionId={sessionId} />
    </SignedIn>
  );
}
