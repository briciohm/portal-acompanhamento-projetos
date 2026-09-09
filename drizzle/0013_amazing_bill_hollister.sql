CREATE TABLE `system_settings` (
	`key` varchar(100) NOT NULL,
	`value` varchar(32) NOT NULL,
	`description` text,
	`updatedBy` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `system_settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `system_settings_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(100) NOT NULL,
	`previousValue` varchar(32),
	`newValue` varchar(32) NOT NULL,
	`changedBy` int NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `system_settings_audit_logs_id` PRIMARY KEY(`id`)
);
