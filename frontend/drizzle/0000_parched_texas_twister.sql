CREATE TABLE "t3-app_account" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refreshToken" text,
	"accessToken" text,
	"expiresAt" integer,
	"tokenType" varchar(255),
	"scope" text,
	"idToken" text,
	"sessionToken" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "t3-app_product" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(128) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"imageUrl" text,
	"stockQuantity" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "t3-app_session" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"sessionToken" varchar(255) NOT NULL,
	"userId" varchar(256) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "t3-app_session_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "t3-app_task" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"completed" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "t3-app_user" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"name" varchar(255),
	"password" text,
	"image" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "t3-app_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "t3-app_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "t3-app_account" ADD CONSTRAINT "t3-app_account_userId_t3-app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."t3-app_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-app_session" ADD CONSTRAINT "t3-app_session_userId_t3-app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."t3-app_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t3-app_task" ADD CONSTRAINT "t3-app_task_userId_t3-app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."t3-app_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_idx" ON "t3-app_product" USING btree ("category");--> statement-breakpoint
CREATE INDEX "price_idx" ON "t3-app_product" USING btree ("price");--> statement-breakpoint
CREATE INDEX "name_idx" ON "t3-app_product" USING btree ("name");--> statement-breakpoint
CREATE INDEX "userId_idx" ON "t3-app_task" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "completed_idx" ON "t3-app_task" USING btree ("completed");--> statement-breakpoint
CREATE INDEX "email_idx" ON "t3-app_user" USING btree ("email");