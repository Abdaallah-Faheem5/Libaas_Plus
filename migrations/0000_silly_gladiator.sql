CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(150),
	`lastName` varchar(150),
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255),
	`role` varchar(50) DEFAULT 'customer',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
