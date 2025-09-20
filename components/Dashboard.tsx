import { UserButton } from "@clerk/nextjs";
import { Code, Trophy, Target } from "lucide-react";
import ProblemsList from "./ProblemsList";
import UserStats from "./UserStats";
import QuickStats from "./QuickStats";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                CodeKatas
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to practice some coding katas? Choose a problem below to get
            started.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Problems List - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            {/* Learning Path */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl shadow-sm border border-blue-200 dark:border-blue-700 mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  🎯 Learning Path
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Start with beginner problems and work your way up to advanced
                  algorithms
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-blue-800 p-3 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 font-bold">
                      ★
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Beginner
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      5-8 min
                    </div>
                  </div>
                  <div className="bg-white dark:bg-blue-800 p-3 rounded-lg">
                    <div className="text-yellow-600 dark:text-yellow-400 font-bold">
                      ★★
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Intermediate
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      9-12 min
                    </div>
                  </div>
                  <div className="bg-white dark:bg-blue-800 p-3 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 font-bold">
                      ★★★
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Advanced
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      15+ min
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Practice Problems
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Select a problem to start practicing
                </p>
              </div>
              <div className="p-6">
                <ProblemsList />
              </div>
            </div>
          </div>

          {/* User Stats Sidebar - Takes up 1/3 of the space */}
          <div className="space-y-6">
            <UserStats />

            {/* Achievements Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">🎯</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        First Steps
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Completed your first kata
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">⚡</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Speed Demon
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        100+ CPM achieved
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Achievements
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Random Problem
                  </button>
                  <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    View Leaderboard
                  </button>
                  <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Practice History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
