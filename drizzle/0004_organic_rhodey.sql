CREATE TABLE `client_diagnostic_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`route` varchar(240),
	`context` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_diagnostic_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_stage_status_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int NOT NULL,
	`previousStatus` int NOT NULL,
	`nextStatus` int NOT NULL,
	`changedBy` int,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_stage_status_history_id` PRIMARY KEY(`id`)
);
