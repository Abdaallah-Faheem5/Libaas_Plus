import { mysqlTable, varchar, int, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    firstName: varchar("firstName", { length: 150 }),
    lastName: varchar("lastName", { length: 150 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }),
    role: varchar("role", { length: 50 }).default("customer"),  
    imageUrl: varchar("image_url", { length: 500 })
});