ALTER TABLE "SAVEDPLAYS" RENAME COLUMN "file" TO "server_file";--> statement-breakpoint
ALTER TABLE "SAVEDPLAYS" RENAME COLUMN "link" TO "local_file";--> statement-breakpoint
ALTER TABLE "SAVEDPLAYS" DROP CONSTRAINT "SAVEDPLAYS_link_unique";