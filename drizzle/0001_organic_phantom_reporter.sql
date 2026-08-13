CREATE TABLE `project_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`code` varchar(32) NOT NULL,
	`description` text,
	`accent` varchar(16) NOT NULL DEFAULT '#e30613',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `project_areas_id` PRIMARY KEY(`id`),
	CONSTRAINT `project_areas_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `project_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`label` varchar(120) NOT NULL,
	`value` decimal(12,2) NOT NULL,
	`unit` varchar(32),
	`target` decimal(12,2),
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`milestoneDate` timestamp NOT NULL,
	`icon` varchar(32) NOT NULL DEFAULT 'target',
	CONSTRAINT `project_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(160),
	`description` text,
	`storageKey` varchar(500) NOT NULL,
	`url` varchar(700) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_stages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`status` enum('pendente','em andamento','concluída') NOT NULL DEFAULT 'pendente',
	`orderIndex` int NOT NULL DEFAULT 0,
	`dueDate` timestamp,
	CONSTRAINT `project_stages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`areaId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`code` varchar(32) NOT NULL,
	`summary` text,
	`status` enum('estruturação','andamento','execução','concluído','pausado') NOT NULL DEFAULT 'andamento',
	`owner` varchar(160),
	`progress` int NOT NULL DEFAULT 0,
	`nextSteps` text,
	`startDate` timestamp,
	`targetDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_code_unique` UNIQUE(`code`)
);
