-- Drizzle initial migration for OweManager v2
CREATE TYPE "debt_type" AS ENUM ('borrowed', 'lent');
CREATE TYPE "debt_status" AS ENUM ('unpaid', 'paid');

CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "name" text,
  "email" text NOT NULL UNIQUE,
  "image" text,
  "email_verified" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "user_id" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "provider_account_id" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  "oauth_token_secret" text,
  "oauth_token" text,
  CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY ("provider","provider_account_id"),
  CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "session_token" text PRIMARY KEY,
  "user_id" text NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE cascade
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY ("identifier","token")
);

CREATE TABLE IF NOT EXISTS "debts" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users" ("id") ON DELETE cascade,
  "partner_name" varchar(50) NOT NULL,
  "amount" integer NOT NULL,
  "type" debt_type NOT NULL,
  "status" debt_status NOT NULL DEFAULT 'unpaid',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS debts_user_id_idx ON debts ("user_id");
CREATE INDEX IF NOT EXISTS debts_status_idx ON debts ("status");
CREATE INDEX IF NOT EXISTS debts_type_idx ON debts ("type");
