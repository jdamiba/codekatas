export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
  points: number;
}

export interface AchievementCriteria {
  type:
    | "first_completion"
    | "speed_threshold"
    | "accuracy_threshold"
    | "streak_threshold"
    | "problem_count"
    | "perfect_accuracy"
    | "consecutive_days";
  value?: number;
}

export interface UserAchievement {
  achievementId: string;
  earnedAt: Date;
  achievement: Achievement;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date | null;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profileImageUrl?: string;
  metricValue: number;
  rank: number;
}

export class GamificationEngine {
  static async checkAchievements(
    userId: string,
    performanceData: {
      accuracy?: number;
      speed?: number;
      problemsCompleted?: number;
      perfectAccuracy?: boolean;
      consecutiveDays?: number;
    }
  ): Promise<UserAchievement[]> {
    // This would typically query the database for user's current achievements
    // and check against criteria. For now, returning mock implementation.

    const newAchievements: UserAchievement[] = [];

    // Example achievement checks
    if (performanceData.accuracy && performanceData.accuracy >= 95) {
      // Check if user already has this achievement
      // newAchievements.push(...)
    }

    if (performanceData.speed && performanceData.speed >= 100) {
      // Speed demon achievement
    }

    return newAchievements;
  }

  static async updateStreak(
    userId: string,
    practiceDate: Date
  ): Promise<StreakData> {
    // This would update the user's streak in the database
    // For now, returning mock data

    return {
      currentStreak: 5,
      longestStreak: 12,
      lastPracticeDate: practiceDate,
    };
  }

  static async calculateLeaderboard(): Promise<LeaderboardEntry[]> {
    // This would query the database for leaderboard data
    // For now, returning mock data

    return [
      {
        userId: "user1",
        username: "CoderPro",
        metricValue: 98.5,
        rank: 1,
      },
      {
        userId: "user2",
        username: "TypeMaster",
        metricValue: 96.2,
        rank: 2,
      },
    ];
  }

  static async getUserRank(): Promise<{
    rank: number;
    totalUsers: number;
  } | null> {
    // This would query the database to find user's rank
    // For now, returning mock data

    return {
      rank: 15,
      totalUsers: 150,
    };
  }

  static async getUserStats(): Promise<{
    totalPoints: number;
    achievementsCount: number;
    currentStreak: number;
    longestStreak: number;
    totalProblemsCompleted: number;
    averageAccuracy: number;
    averageSpeed: number;
  }> {
    // This would query the database for comprehensive user stats
    // For now, returning mock data

    return {
      totalPoints: 450,
      achievementsCount: 8,
      currentStreak: 5,
      longestStreak: 12,
      totalProblemsCompleted: 25,
      averageAccuracy: 89.3,
      averageSpeed: 78,
    };
  }
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first coding kata",
    icon: "🎯",
    criteria: { type: "first_completion" },
    points: 10,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Achieve 100+ characters per minute",
    icon: "⚡",
    criteria: { type: "speed_threshold", value: 100 },
    points: 25,
  },
  {
    id: "accuracy_master",
    name: "Accuracy Master",
    description: "Achieve 95%+ accuracy on any problem",
    icon: "🎯",
    criteria: { type: "accuracy_threshold", value: 95 },
    points: 20,
  },
  {
    id: "streak_starter",
    name: "Streak Starter",
    description: "Maintain a 3-day practice streak",
    icon: "🔥",
    criteria: { type: "streak_threshold", value: 3 },
    points: 15,
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day practice streak",
    icon: "💪",
    criteria: { type: "streak_threshold", value: 7 },
    points: 50,
  },
  {
    id: "month_master",
    name: "Month Master",
    description: "Maintain a 30-day practice streak",
    icon: "👑",
    criteria: { type: "streak_threshold", value: 30 },
    points: 200,
  },
  {
    id: "problem_solver",
    name: "Problem Solver",
    description: "Complete 10 different problems",
    icon: "🧩",
    criteria: { type: "problem_count", value: 10 },
    points: 30,
  },
  {
    id: "code_master",
    name: "Code Master",
    description: "Complete 50 different problems",
    icon: "🏆",
    criteria: { type: "problem_count", value: 50 },
    points: 150,
  },
  {
    id: "perfect_score",
    name: "Perfect Score",
    description: "Complete a problem with 100% accuracy",
    icon: "💯",
    criteria: { type: "perfect_accuracy" },
    points: 40,
  },
  {
    id: "daily_grind",
    name: "Daily Grind",
    description: "Practice for 5 consecutive days",
    icon: "📅",
    criteria: { type: "consecutive_days", value: 5 },
    points: 35,
  },
];

// Utility functions for gamification
export function calculateExperiencePoints(performance: {
  accuracy: number;
  speed: number;
  isFirstTime: boolean;
  streakBonus: number;
}): number {
  let points = 0;

  // Base points for completion
  points += 10;

  // Accuracy bonus
  if (performance.accuracy >= 95) points += 15;
  else if (performance.accuracy >= 90) points += 10;
  else if (performance.accuracy >= 80) points += 5;

  // Speed bonus
  if (performance.speed >= 100) points += 10;
  else if (performance.speed >= 80) points += 5;

  // First time bonus
  if (performance.isFirstTime) points += 5;

  // Streak bonus
  points += performance.streakBonus;

  return points;
}

export function calculateMasteryLevel(
  totalAttempts: number,
  bestAccuracy: number
): number {
  // Mastery levels 0-5 based on attempts and accuracy
  if (totalAttempts >= 10 && bestAccuracy >= 95) return 5; // Master
  if (totalAttempts >= 5 && bestAccuracy >= 90) return 4; // Expert
  if (totalAttempts >= 3 && bestAccuracy >= 85) return 3; // Advanced
  if (totalAttempts >= 2 && bestAccuracy >= 80) return 2; // Intermediate
  if (totalAttempts >= 1 && bestAccuracy >= 70) return 1; // Beginner
  return 0; // New
}
