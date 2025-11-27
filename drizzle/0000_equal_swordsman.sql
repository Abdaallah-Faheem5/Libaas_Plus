CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(150),
	"last_name" varchar(150),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"role" varchar(50) DEFAULT 'customer',
	"image_url" varchar(500),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
