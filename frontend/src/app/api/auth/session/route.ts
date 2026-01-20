import { db } from "~/server/db";
import { sessions, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Get session token from cookie
    const cookieHeader = request.headers.get("cookie");
    const sessionToken = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("sessionToken="))
      ?.split("=")[1];

    if (!sessionToken) {
      return Response.json(null, { status: 401 });
    }

    // Find session in database
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, sessionToken),
    });

    if (!session || new Date() > session.expires) {
      return Response.json(null, { status: 401 });
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    if (!user) {
      return Response.json(null, { status: 401 });
    }

    return Response.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        session: {
          expires: session.expires,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session error:", error);
    return Response.json(null, { status: 401 });
  }
}
