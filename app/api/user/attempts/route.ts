import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Cap at 50
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0); // Ensure non-negative

    // Get user ID from database
    const userResult = await db.query(
      "SELECT id FROM users WHERE clerk_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUserId = userResult.rows[0].id;

    // Get user's recent attempts
    const result = await db.query(
      `
      SELECT 
        a.id,
        a.started_at,
        a.completed_at,
        a.accuracy_percentage,
        a.characters_per_minute,
        a.session_duration_seconds,
        a.is_completed,
        p.title as problem_title,
        p.category,
        p.id as problem_id
      FROM attempt_sessions a
      JOIN problems p ON a.problem_id = p.id
      WHERE a.user_id = $1
      ORDER BY a.started_at DESC
      LIMIT $2 OFFSET $3
      `,
      [dbUserId, limit, offset]
    );

    return NextResponse.json({
      attempts: result.rows,
      pagination: {
        limit,
        offset,
        total: result.rowCount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch user attempts" },
      { status: 500 }
    );
  }
}
