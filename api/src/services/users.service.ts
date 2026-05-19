import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import type { User, UserResponse } from "@/types/user";
import type { RegisterDto, UpdateUserDto } from "@/models/user";
import { NotFoundError, ConflictError, AppError } from "@/utils/errors";

function publicColumns() {
  const { password: _, ...rest } = getTableColumns(users);
  return rest;
}

export const usersService = {
  async findById(id: string): Promise<UserResponse> {
    const [user] = await db
      .select(publicColumns())
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user ?? null;
  },

  async create(data: RegisterDto): Promise<UserResponse> {
    const existing = await usersService.findByEmail(data.email);
    if (existing) throw new ConflictError("Email already in use");

    const [user] = await db
      .insert(users)
      .values(data)
      .returning(publicColumns());
    if (!user) throw new AppError(500, "INTERNAL_ERROR", "Failed to create user");
    return user;
  },

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const [user] = await db
      .update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning(publicColumns());
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async delete(id: string): Promise<void> {
    const [user] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (!user) throw new NotFoundError("User");
  },
};
