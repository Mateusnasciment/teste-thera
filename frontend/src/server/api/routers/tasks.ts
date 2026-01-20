import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { tasks } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { createTaskSchema, updateTaskSchema } from "~/lib/validators";
import { nanoid } from "nanoid";

export const tasksRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, ctx.session.user.id))
      .orderBy(tasks.createdAt);
  }),

  create: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      const [newTask] = await db
        .insert(tasks)
        .values({
          id,
          userId: ctx.session.user.id,
          title: input.title,
          description: input.description || null,
          completed: false,
        })
        .returning();

      return newTask;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        ...updateTaskSchema.shape,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const [task] = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.id, id),
            eq(tasks.userId, ctx.session.user.id)
          )
        );

      if (!task) {
        throw new Error("Task not found or unauthorized");
      }

      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.completed !== undefined) updateData.completed = data.completed;

      const [updatedTask] = await db
        .update(tasks)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(tasks.id, id),
            eq(tasks.userId, ctx.session.user.id)
          )
        )
        .returning();

      return updatedTask;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      // Verify ownership before deleting
      const [task] = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.id, id),
            eq(tasks.userId, ctx.session.user.id)
          )
        );

      if (!task) {
        throw new Error("Task not found or unauthorized");
      }

      const [deletedTask] = await db
        .delete(tasks)
        .where(
          and(
            eq(tasks.id, id),
            eq(tasks.userId, ctx.session.user.id)
          )
        )
        .returning();

      return deletedTask;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const [task] = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.id, id),
            eq(tasks.userId, ctx.session.user.id)
          )
        );

      if (!task) {
        throw new Error("Task not found or unauthorized");
      }

      return task;
    }),
});
