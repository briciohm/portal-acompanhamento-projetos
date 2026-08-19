ALTER TABLE `project_stages` ADD `progressStatus` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `isManual` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `manualObservation` text;