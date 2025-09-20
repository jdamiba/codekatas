import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Initialize webhook with your Clerk webhook secret
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const wh = new Webhook(webhookSecret!);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred", {
      status: 400,
    });
  }

  const { type, data } = evt;

  try {
    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

async function handleUserCreated(data: {
  id: string;
  email_addresses?: Array<{ email_address: string }>;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  profile_image_url?: string | null;
}) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    profile_image_url,
  } = data;

  const email = email_addresses?.[0]?.email_address;

  await db.query(
    `
    INSERT INTO users (clerk_id, email, username, first_name, last_name, profile_image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (clerk_id) DO NOTHING
  `,
    [
      id,
      email || null,
      username || null,
      first_name || null,
      last_name || null,
      profile_image_url || null,
    ]
  );

  // Initialize user streak
  await db.query(
    `
    INSERT INTO user_streaks (user_id)
    SELECT id FROM users WHERE clerk_id = $1
    ON CONFLICT (user_id) DO NOTHING
  `,
    [id]
  );

  console.log(`User created: ${id}`);
}

async function handleUserUpdated(data: {
  id: string;
  email_addresses?: Array<{ email_address: string }>;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  profile_image_url?: string | null;
}) {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    profile_image_url,
  } = data;

  const email = email_addresses?.[0]?.email_address;

  await db.query(
    `
    UPDATE users 
    SET email = $2, username = $3, first_name = $4, last_name = $5, 
        profile_image_url = $6, updated_at = NOW()
    WHERE clerk_id = $1
  `,
    [
      id,
      email || null,
      username || null,
      first_name || null,
      last_name || null,
      profile_image_url || null,
    ]
  );

  console.log(`User updated: ${id}`);
}

async function handleUserDeleted(data: { id?: string }) {
  const { id } = data;

  if (!id) {
    console.log("User deleted but no ID provided");
    return;
  }

  // Cascade delete will handle related records
  await db.query(
    `
    DELETE FROM users WHERE clerk_id = $1
  `,
    [id]
  );

  console.log(`User deleted: ${id}`);
}
