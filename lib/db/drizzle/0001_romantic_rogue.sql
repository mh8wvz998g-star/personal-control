CREATE TABLE "admin_permission_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"is_allowed" boolean NOT NULL,
	"changed_by" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_admin_id" integer NOT NULL,
	"target_admin_id" integer,
	"target_position_id" integer,
	"permission_id" integer,
	"action" varchar(50) NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "position_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"position_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_permission_overrides" ADD CONSTRAINT "admin_permission_overrides_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position_permissions" ADD CONSTRAINT "position_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "position_permission_unique" ON "position_permissions" USING btree ("position_id","permission_id");