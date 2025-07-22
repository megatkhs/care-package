CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"plan_id" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"monthly_fee" numeric(10, 2) NOT NULL,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"store_id" uuid,
	"contract_id" uuid,
	"invitation_token" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"invited_by" uuid NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_invitation_token_unique" UNIQUE("invitation_token")
);
--> statement-breakpoint
ALTER TABLE "stores" RENAME COLUMN "owner_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "stores" DROP CONSTRAINT "stores_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "stores" ALTER COLUMN "business_hours" SET DATA TYPE jsonb USING business_hours::jsonb;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "category" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "customer_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "invitation_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_admins_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE no action ON UPDATE no action;