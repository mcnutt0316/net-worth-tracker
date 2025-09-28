-- CreateTable
CREATE TABLE "public"."snapshots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "networth" DECIMAL(15,2) NOT NULL,
    "assets" DECIMAL(15,2) NOT NULL,
    "liabilities" DECIMAL(15,2) NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);
