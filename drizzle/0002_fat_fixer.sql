CREATE TABLE `project_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`fileName` varchar(240) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`category` varchar(80),
	`sizeBytes` int,
	`storageKey` varchar(500) NOT NULL,
	`url` varchar(700) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_documents_id` PRIMARY KEY(`id`)
);
