ALTER TABLE `user_profile_audit_logs` MODIFY COLUMN `targetUserId` int;--> statement-breakpoint
ALTER TABLE `user_profile_audit_logs` MODIFY COLUMN `action` enum('create','update','blocked') NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profile_audit_logs` MODIFY COLUMN `newProfile` varchar(32);--> statement-breakpoint
ALTER TABLE `user_profile_audit_logs` MODIFY COLUMN `newIsActive` boolean;--> statement-breakpoint
ALTER TABLE `user_profile_audit_logs` ADD `reason` text;