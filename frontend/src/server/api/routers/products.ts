import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { eq, like, lte, gte, asc, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";

const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().optional(),
  price: z.string().or(z.number()).refine(
    (v) => {
      const num = typeof v === "string" ? parseFloat(v) : v;
      return !isNaN(num) && num > 0;
    },
    "Preço deve ser um número positivo"
  ),
  imageUrl: z.string().url("URL da imagem deve ser válida").optional(),
  stockQuantity: z.number().int().default(0),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const productsRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        searchName: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        category: z.string().optional(),
        sortBy: z.enum(["name", "price", "createdAt"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().default(10),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];

      if (input.searchName) {
        conditions.push(like(products.name, `%${input.searchName}%`));
      }

      if (input.minPrice !== undefined) {
        conditions.push(gte(products.price, input.minPrice.toString()));
      }

      if (input.maxPrice !== undefined) {
        conditions.push(lte(products.price, input.maxPrice.toString()));
      }

      if (input.category) {
        conditions.push(eq(products.category, input.category));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Determine sort column
      let sortColumn: any = products.createdAt;
      if (input.sortBy === "name") {
        sortColumn = products.name;
      } else if (input.sortBy === "price") {
        sortColumn = products.price;
      }

      const sortFn = input.sortOrder === "asc" ? asc : desc;

      // Get total count
      const countResult = await db
        .select()
        .from(products)
        .where(whereClause);

      const total = countResult.length;

      // Get paginated results
      const offset = (input.page - 1) * input.limit;
      const result = await db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(sortFn(sortColumn))
        .limit(input.limit)
        .offset(offset);

      return {
        items: result,
        total,
        page: input.page,
        limit: input.limit,
        pages: Math.ceil(total / input.limit),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));

      return product || null;
    }),

  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const id = nanoid();
      const price =
        typeof input.price === "string" ? parseFloat(input.price) : input.price;

      const [newProduct] = await db
        .insert(products)
        .values({
          id,
          name: input.name,
          category: input.category,
          description: input.description || null,
          price: price.toString(),
          imageUrl: input.imageUrl || null,
          stockQuantity: input.stockQuantity,
        })
        .returning();

      return newProduct;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        ...createProductSchema.partial().shape,
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) {
        const price = typeof data.price === "string" ? parseFloat(data.price) : data.price;
        updateData.price = price.toString();
      }
      if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
      if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;

      const [updated] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      return updated || null;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning();

      return deleted || null;
    }),

  getCategories: publicProcedure.query(async () => {
    const result = await db.select({ category: products.category }).from(products);
    const categories = [...new Set(result.map((r) => r.category))];
    return categories;
  }),
});
