import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await request.json();

    if (!problemId) {
      return NextResponse.json(
        { error: "Problem ID is required" },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(problemId)) {
      return NextResponse.json(
        { error: "Invalid problem ID format" },
        { status: 400 }
      );
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

    // Create new attempt session
    const result = await db.query(
      `
      INSERT INTO attempt_sessions (user_id, problem_id)
      VALUES ($1, $2)
      RETURNING id, started_at
    `,
      [dbUserId, problemId]
    );

    const session = result.rows[0];

    return NextResponse.json({
      sessionId: session.id,
      startedAt: session.started_at,
      message: "Attempt session created",
    });
  } catch (error) {
    console.error("Error creating attempt session:", error);
    return NextResponse.json(
      { error: "Failed to create attempt session" },
      { status: 500 }
    );
  }
}

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

    // Get user's attempt history
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
        p.category
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
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}
