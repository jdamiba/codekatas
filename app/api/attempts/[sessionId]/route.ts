import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
        { status: 400 }
      );
    }

    const {
      totalCharacters,
      correctCharacters,
      totalErrors,
      sessionDurationSeconds,
      accuracyPercentage,
      charactersPerMinute,
      isCompleted,
      keystrokeEvents,
    } = await request.json();

    // Validate numeric inputs
    if (typeof totalCharacters !== "number" || totalCharacters < 0) {
      return NextResponse.json(
        { error: "Invalid totalCharacters" },
        { status: 400 }
      );
    }
    if (
      typeof correctCharacters !== "number" ||
      correctCharacters < 0 ||
      correctCharacters > totalCharacters
    ) {
      return NextResponse.json(
        { error: "Invalid correctCharacters" },
        { status: 400 }
      );
    }
    if (typeof totalErrors !== "number" || totalErrors < 0) {
      return NextResponse.json(
        { error: "Invalid totalErrors" },
        { status: 400 }
      );
    }
    if (
      typeof sessionDurationSeconds !== "number" ||
      sessionDurationSeconds < 0 ||
      sessionDurationSeconds > 3600
    ) {
      return NextResponse.json(
        { error: "Invalid sessionDurationSeconds" },
        { status: 400 }
      );
    }
    if (
      typeof accuracyPercentage !== "number" ||
      accuracyPercentage < 0 ||
      accuracyPercentage > 100
    ) {
      return NextResponse.json(
        { error: "Invalid accuracyPercentage" },
        { status: 400 }
      );
    }
    if (
      typeof charactersPerMinute !== "number" ||
      charactersPerMinute < 0 ||
      charactersPerMinute > 1000
    ) {
      return NextResponse.json(
        { error: "Invalid charactersPerMinute" },
        { status: 400 }
      );
    }
    if (typeof isCompleted !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isCompleted" },
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

    // Verify session belongs to user
    const sessionResult = await db.query(
      "SELECT id FROM attempt_sessions WHERE id = $1 AND user_id = $2",
      [sessionId, dbUserId]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update attempt session
    await db.transaction(async (client) => {
      // Update session
      await client.query(
        `
        UPDATE attempt_sessions 
        SET 
          completed_at = CASE WHEN $3 THEN NOW() ELSE completed_at END,
          total_characters = $4,
          correct_characters = $5,
          total_errors = $6,
          session_duration_seconds = $7,
          accuracy_percentage = $8,
          characters_per_minute = $9,
          is_completed = $3
        WHERE id = $1 AND user_id = $2
      `,
        [
          sessionId,
          dbUserId,
          isCompleted,
          totalCharacters,
          correctCharacters,
          totalErrors,
          sessionDurationSeconds,
          accuracyPercentage,
          charactersPerMinute,
        ]
      );

      // Insert keystroke events if provided
      if (keystrokeEvents && keystrokeEvents.length > 0) {
        const keystrokeValues = keystrokeEvents
          .map(
            (
              event: {
                characterPosition: number;
                typedCharacter: string;
                expectedCharacter: string;
                isCorrect: boolean;
                timestampMs: number;
                timeSinceLastKeystrokeMs: number;
              },
              index: number
            ) =>
              `($1, $${index * 6 + 2}, $${index * 6 + 3}, $${index * 6 + 4}, $${
                index * 6 + 5
              }, $${index * 6 + 6}, $${index * 6 + 7})`
          )
          .join(", ");

        const keystrokeParams = keystrokeEvents.flatMap(
          (event: {
            characterPosition: number;
            typedCharacter: string;
            expectedCharacter: string;
            isCorrect: boolean;
            timestampMs: number;
            timeSinceLastKeystrokeMs: number;
          }) => [
            sessionId,
            event.characterPosition,
            event.typedCharacter,
            event.expectedCharacter,
            event.isCorrect,
            event.timestampMs,
            event.timeSinceLastKeystrokeMs,
          ]
        );

        await client.query(
          `
          INSERT INTO keystroke_events 
          (session_id, character_position, typed_character, expected_character, is_correct, timestamp_ms, time_since_last_keystroke_ms)
          VALUES ${keystrokeValues}
        `,
          [sessionId, ...keystrokeParams]
        );
      }

      // Update user progress if completed
      if (isCompleted) {
        const sessionData = await client.query(
          `
          SELECT problem_id, accuracy_percentage, characters_per_minute, session_duration_seconds
          FROM attempt_sessions 
          WHERE id = $1
        `,
          [sessionId]
        );

        if (sessionData.rows.length > 0) {
          const {
            problem_id,
            accuracy_percentage,
            characters_per_minute,
            session_duration_seconds,
          } = sessionData.rows[0];

          await client.query(
            `
            INSERT INTO user_progress (user_id, problem_id, best_accuracy, best_wpm, total_attempts, average_time_seconds, last_attempted)
            VALUES ($1, $2, $3, $4, 1, $5, NOW())
            ON CONFLICT (user_id, problem_id) 
            DO UPDATE SET
              best_accuracy = GREATEST(user_progress.best_accuracy, $3),
              best_wpm = GREATEST(user_progress.best_wpm, $4),
              total_attempts = user_progress.total_attempts + 1,
              average_time_seconds = (
                (user_progress.average_time_seconds * user_progress.total_attempts + $5) / 
                (user_progress.total_attempts + 1)
              ),
              last_attempted = NOW(),
              updated_at = NOW()
          `,
            [
              dbUserId,
              problem_id,
              accuracy_percentage,
              characters_per_minute,
              session_duration_seconds,
            ]
          );
        }
      }
    });

    return NextResponse.json({
      message: "Attempt session updated successfully",
    });
  } catch (error) {
    console.error("Error updating attempt session:", error);
    return NextResponse.json(
      { error: "Failed to update attempt session" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid session ID format" },
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

    // Get session details
    const sessionResult = await db.query(
      `
      SELECT 
        a.*,
        p.title as problem_title,
        p.solution_code
      FROM attempt_sessions a
      JOIN problems p ON a.problem_id = p.id
      WHERE a.id = $1 AND a.user_id = $2
    `,
      [sessionId, dbUserId]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: sessionResult.rows[0] });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
