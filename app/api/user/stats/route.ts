import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from database
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUserId = userResult.rows[0].id;

    // Get user streak data
    const streakResult = await db.query(
      "SELECT current_streak, longest_streak, last_practice_date FROM user_streaks WHERE user_id = $1",
      [dbUserId]
    );

    // Get user progress summary
    const progressResult = await db.query(
      `
      SELECT 
        COUNT(DISTINCT problem_id) as unique_problems_completed,
        AVG(best_accuracy) as average_accuracy,
        AVG(best_wpm) as average_speed,
        SUM(total_attempts) as total_completions,
        SUM(average_time_seconds * total_attempts) / NULLIF(SUM(total_attempts), 0) as total_practice_time
      FROM user_progress 
      WHERE user_id = $1
      `,
      [dbUserId]
    );

    // Get recent attempts for trend calculation
    const recentAttemptsResult = await db.query(
      `
      SELECT accuracy_percentage, characters_per_minute, started_at
      FROM attempt_sessions 
      WHERE user_id = $1 AND is_completed = true
      ORDER BY started_at DESC 
      LIMIT 10
      `,
      [dbUserId]
    );

    // Calculate trends
    const recentAttempts = recentAttemptsResult.rows;
    const accuracyTrend = calculateTrend(
      recentAttempts.map((a) => a.accuracy_percentage)
    );
    const speedTrend = calculateTrend(
      recentAttempts.map((a) => a.characters_per_minute)
    );

    // Get achievements count
    const achievementsResult = await db.query(
      "SELECT COUNT(*) as achievement_count FROM user_achievements WHERE user_id = $1",
      [dbUserId]
    );

    const stats = {
      streak: {
        current: streakResult.rows[0]?.current_streak || 0,
        longest: streakResult.rows[0]?.longest_streak || 0,
        lastPracticeDate: streakResult.rows[0]?.last_practice_date || null,
      },
      progress: {
        totalProblemsCompleted: parseInt(
          progressResult.rows[0]?.unique_problems_completed || 0
        ),
        totalCompletions: parseInt(
          progressResult.rows[0]?.total_completions || 0
        ),
        averageAccuracy: parseFloat(
          progressResult.rows[0]?.average_accuracy || 0
        ).toFixed(1),
        averageSpeed: parseInt(progressResult.rows[0]?.average_speed || 0),
        totalPracticeTime: parseInt(
          progressResult.rows[0]?.total_practice_time || 0
        ),
      },
      trends: {
        accuracy: accuracyTrend,
        speed: speedTrend,
      },
      achievements: {
        count: parseInt(achievementsResult.rows[0]?.achievement_count || 0),
      },
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}

function calculateTrend(values: number[]): number {
  if (values.length < 2) return 0;

  const recent = values.slice(0, Math.floor(values.length / 2));
  const older = values.slice(Math.floor(values.length / 2));

  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;

  return parseFloat((recentAvg - olderAvg).toFixed(1));
}
