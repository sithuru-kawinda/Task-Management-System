-- Task Management System — full database bootstrap
--
-- Standalone script: creates the database, tables, and the seeded admin
-- user in one run. Equivalent to `npm run migrate && npm run seed` in
-- backend/ (Knex migrations under backend/src/migrations/ remain the
-- source of truth for schema changes going forward); this file is a
-- convenience for anyone who just wants to run it directly with a MySQL
-- client, no Node/Knex required.
--
-- Usage:
--   mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS `task_manager`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `task_manager`;

DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tasks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `priority` enum('Low','Medium','High') NOT NULL,
  `status` enum('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
  `due_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tasks_user_id_index` (`user_id`),
  KEY `tasks_status_index` (`status`),
  KEY `tasks_priority_index` (`priority`),
  KEY `tasks_title_index` (`title`),
  CONSTRAINT `tasks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Seed admin user: admin@test.com / 123456
-- (bcrypt hash below is that password hashed with 10 salt rounds, matching
-- backend/src/seeds/01_admin_user.ts. Change ADMIN_* in backend/.env and
-- re-run `npm run seed` if you want different credentials instead.)
INSERT INTO `users` (`name`, `email`, `password`)
VALUES ('Admin', 'admin@test.com', '$2a$10$g2rADHJtLqwd.Zc3aFDSe.sX9ACDh3iOQgbhDqF0djZnJaUoaG5LK');
