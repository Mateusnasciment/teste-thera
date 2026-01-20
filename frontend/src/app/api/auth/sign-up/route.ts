import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return Response.json(
        { message: "Email, senha e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return Response.json(
        { message: "Email já registrado" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const userId = nanoid();
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        email,
        name,
        password: hashedPassword,
        emailVerified: false,
      })
      .returning();

    return Response.json(
      {
        message: "Usuário criado com sucesso",
        user: {
          id: newUser[0]?.id,
          email: newUser[0]?.email,
          name: newUser[0]?.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return Response.json(
      { message: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
