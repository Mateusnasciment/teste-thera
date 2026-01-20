import { db } from "~/server/db";
import { users, sessions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return Response.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return Response.json(
        { message: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    // Compare passwords
    const passwordMatch = await compare(password, user.password || "");

    if (!passwordMatch) {
      return Response.json(
        { message: "Email ou senha inválidos" },
        { status: 401 }
      );
    }
    
    // Create session
    const sessionId = nanoid();
    const sessionToken = nanoid(32);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.insert(sessions).values({
      id: sessionId,
      sessionToken,
      userId: user.id,
      expires: expiresAt,
    });

    // Return session info with cookie
    const response = Response.json(
      {
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );

    // Set session cookie
    response.headers.set(
      "Set-Cookie",
      `sessionToken=${sessionToken}; Path=/; Max-Age=${30 * 24 * 60 * 60}; HttpOnly; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return Response.json(
      { message: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
