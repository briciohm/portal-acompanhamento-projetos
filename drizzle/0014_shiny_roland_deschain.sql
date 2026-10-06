CREATE TABLE `auth_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`event` enum('login','logout') NOT NULL,
	`userName` text,
	`email` varchar(320),
	`profile` varchar(32),
	`loginMethod` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auth_audit_logs_id` PRIMARY KEY(`id`)
);
