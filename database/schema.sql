-- Volunteer Opportunity Board: database structure

CREATE DATABASE IF NOT EXISTS volunteer_board
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE volunteer_board;

DROP TABLE IF EXISTS opportunities;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(30)  NOT NULL,
  email         VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE categories (
  id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
);

CREATE TABLE opportunities (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        INT UNSIGNED NOT NULL,
  category_id    INT UNSIGNED NOT NULL,
  title          VARCHAR(120) NOT NULL,
  description    TEXT         NOT NULL,
  location       VARCHAR(150) NOT NULL,
  status         ENUM('open','closed') NOT NULL DEFAULT 'open',
  image_filename VARCHAR(255) NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_opportunities_user (user_id),
  KEY idx_opportunities_category (category_id),
  KEY idx_opportunities_status (status),
  CONSTRAINT fk_opportunities_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_opportunities_category
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);