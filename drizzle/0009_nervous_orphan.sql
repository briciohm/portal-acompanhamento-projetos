CREATE TABLE `user_profile_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int NOT NULL,
	`targetUserId` int NOT NULL,
	`action` enum('create','update') NOT NULL,
	`previousProfile` varchar(32),
	`newProfile` varchar(32) NOT NULL,
	`previousAreaIds` text,
	`newAreaIds` text,
	`previousIsActive` boolean,
	`newIsActive` boolean NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_profile_audit_logs_id` PRIMARY KEY(`id`)
);
