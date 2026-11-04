
import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  date,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export {
  permissionsTable,
  positionPermissionsTable,
  adminPermissionOverridesTable,
  permissionAuditLogsTable,
} from "./permissions";
// Должности
export const positionsTable = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Роли администраторов
export const rolesTable = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});

// Администраторы
export const adminsTable = pgTable("admins", {
  id: serial("id").primaryKey(),
  telegramId: varchar("telegram_id", { length: 50 }).unique(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  positionId: integer("position_id").references(
    () => positionsTable.id
  ),
  roleId: integer("role_id").references(() => rolesTable.id),
  isActive: boolean("is_active").notNull().default(true),
  isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Обычные сотрудники
export const employeesTable = pgTable("employees", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  position: varchar("position", { length: 150 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Медицинские книжки
export const medicalBooksTable = pgTable(
  "medical_books",
  {
    id: serial("id").primaryKey(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employeesTable.id),
    issueDate: date("issue_date").notNull(),
    expiryDate: date("expiry_date").notNull(),
    comment: text("comment"),
    createdBy: integer("created_by").references(
      () => adminsTable.id
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("medical_books_employee_idx").on(table.employeeId),
    index("medical_books_expiry_idx").on(table.expiryDate),
  ]
);

// История действий
export const auditLogsTable = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    adminId: integer("admin_id").references(() => adminsTable.id),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    entityId: integer("entity_id"),
    details: text("details"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_created_at_idx").on(table.createdAt),
  ]
);

// Связи сотрудников и медицинских книжек
export const employeesRelations = relations(
  employeesTable,
  ({ many }) => ({
    medicalBooks: many(medicalBooksTable),
  })
);

export const medicalBooksRelations = relations(
  medicalBooksTable,
  ({ one }) => ({
    employee: one(employeesTable, {
      fields: [medicalBooksTable.employeeId],
      references: [employeesTable.id],
    }),
  })
);

// Типы
export type Position = typeof positionsTable.$inferSelect;
export type NewPosition = typeof positionsTable.$inferInsert;

export type Admin = typeof adminsTable.$inferSelect;
export type NewAdmin = typeof adminsTable.$inferInsert;

export type Employee = typeof employeesTable.$inferSelect;
export type NewEmployee = typeof employeesTable.$inferInsert;

export type MedicalBook = typeof medicalBooksTable.$inferSelect;
export type NewMedicalBook = typeof medicalBooksTable.$inferInsert;
