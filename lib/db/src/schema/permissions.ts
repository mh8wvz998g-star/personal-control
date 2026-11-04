import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { adminsTable } from "./index";
import { positionsTable } from "./index";
export const permissionsTable = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const positionPermissionsTable = pgTable("position_permissions", {
  id: serial("id").primaryKey(),
  positionId: integer("position_id")
    .notNull()
    .references(() => positionsTable.id),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permissionsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniquePair: uniqueIndex("position_permission_unique")
    .on(table.positionId, table.permissionId),
}));
export const adminPermissionOverridesTable = pgTable("admin_permission_overrides", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => adminsTable.id),
  permissionId: integer("permission_id")
    .notNull()
    .references(() => permissionsTable.id),
  isAllowed: boolean("is_allowed").notNull(),
  changedBy: integer("changed_by")
    .references(() => adminsTable.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const permissionAuditLogsTable = pgTable("permission_audit_logs", {
  id: serial("id").primaryKey(),
  actorAdminId: integer("actor_admin_id") 
    .notNull()
    .references(() => adminsTable.id),
  targetAdminId: integer("target_admin_id")
    .references(() => adminsTable.id),
  targetPositionId: integer("target_position_id")
    .references(() => positionsTable.id),
  permissionId: integer("permission_id")
    .references(() => permissionsTable.id),
  action: varchar("action", { length: 50 }).notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("permission_audit_logs_created_at_idx").on(table.createdAt),
]);