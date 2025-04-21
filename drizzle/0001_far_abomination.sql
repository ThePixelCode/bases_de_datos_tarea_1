CREATE TABLE "DEVELOPERS_PUBLISHERS" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "DEVELOPERS_PUBLISHERS_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "DEVELOPERS_PUBLISHERS_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "FRIENDSHIP" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "FRIENDSHIP_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user1_id" integer NOT NULL,
	"user2_id" integer NOT NULL,
	"are_friends" boolean NOT NULL,
	"messages" jsonb NOT NULL,
	CONSTRAINT "messages" CHECK (validate_messages("FRIENDSHIP"."messages", (ARRAY["FRIENDSHIP"."user1_id"::TEXT, "FRIENDSHIP"."user2_id"::TEXT])::TEXT[])),
	CONSTRAINT "users" CHECK ("FRIENDSHIP"."user1_id" < "FRIENDSHIP"."user2_id")
);
--> statement-breakpoint
CREATE TABLE "GAMES" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "GAMES_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"developer" integer NOT NULL,
	"publisher" integer NOT NULL,
	CONSTRAINT "GAMES_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "GAMETOTAGS" (
	"game_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "GAMETOTAGS_game_id_tag_id_pk" PRIMARY KEY("game_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "PLAYERS" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PLAYERS_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(255) NOT NULL,
	CONSTRAINT "PLAYERS_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "PLAYERTOGAMES" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PLAYERTOGAMES_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"playtime" interval DEFAULT '0 seconds' NOT NULL,
	"recommended" boolean,
	"review" text,
	CONSTRAINT "review" CHECK (("PLAYERTOGAMES"."review" IS NULL AND "PLAYERTOGAMES"."recommended" IS NULL) OR ("PLAYERTOGAMES"."review" IS NOT NULL AND "PLAYERTOGAMES"."recommended" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "SAVEDPLAYS" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "SAVEDPLAYS_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_to_player_id" integer NOT NULL,
	"file" varchar(255) NOT NULL,
	"link" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TAGS" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "TAGS_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "TAGS_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "FRIENDSHIP" ADD CONSTRAINT "FRIENDSHIP_user1_id_PLAYERS_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."PLAYERS"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "FRIENDSHIP" ADD CONSTRAINT "FRIENDSHIP_user2_id_PLAYERS_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."PLAYERS"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GAMES" ADD CONSTRAINT "GAMES_developer_DEVELOPERS_PUBLISHERS_id_fk" FOREIGN KEY ("developer") REFERENCES "public"."DEVELOPERS_PUBLISHERS"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GAMES" ADD CONSTRAINT "GAMES_publisher_DEVELOPERS_PUBLISHERS_id_fk" FOREIGN KEY ("publisher") REFERENCES "public"."DEVELOPERS_PUBLISHERS"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GAMETOTAGS" ADD CONSTRAINT "GAMETOTAGS_game_id_GAMES_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."GAMES"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GAMETOTAGS" ADD CONSTRAINT "GAMETOTAGS_tag_id_TAGS_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."TAGS"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PLAYERTOGAMES" ADD CONSTRAINT "PLAYERTOGAMES_game_id_GAMES_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."GAMES"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "PLAYERTOGAMES" ADD CONSTRAINT "PLAYERTOGAMES_player_id_PLAYERS_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."PLAYERS"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SAVEDPLAYS" ADD CONSTRAINT "SAVEDPLAYS_game_to_player_id_PLAYERTOGAMES_id_fk" FOREIGN KEY ("game_to_player_id") REFERENCES "public"."PLAYERTOGAMES"("id") ON DELETE cascade ON UPDATE cascade;