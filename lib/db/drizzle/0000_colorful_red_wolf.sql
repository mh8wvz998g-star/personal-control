CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" varchar(50),
	"full_name" varchar(200) NOT NULL,
	"position_id" integer,
	"role_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" integer,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" integer,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"position" varchar(150),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"issue_date" date NOT NULL,
	"expiry_date" date NOT NULL,
	"comment" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "positions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_books" ADD CONSTRAINT "medical_books_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_books" ADD CONSTRAINT "medical_books_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "medical_books_employee_idx" ON "medical_books" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "medical_books_expiry_idx" ON "medical_books" USING btree ("expiry_date");