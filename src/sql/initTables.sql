CREATE DATABASE centcom;

USE centcom;

CREATE TABLE servers (name VARCHAR(50), url VARCHAR(100), port INT, access_level VARCHAR(20));

CREATE TABLE config (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    cfg_key VARCHAR(50) UNIQUE NOT NULL,
    cfg_value VARCHAR(200) NOT NULL
);

CREATE TABLE book_categories (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(6)
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(2000) CHARACTER SET utf8 NOT NULL,
    content MEDIUMTEXT CHARACTER SET utf8,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES book_categories(id) ON DELETE SET NULL
);

CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(100)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    byond_key VARCHAR(100)
);

CREATE TABLE user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    permission_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(300)
);

CREATE TABLE user_group_members (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE
);

CREATE TABLE user_group_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    permission_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(100) NOT NULL,
    aggregate BOOLEAN DEFAULT FALSE
);

CREATE TABLE bans (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    byond_key VARCHAR(100) NOT NULL,
    reason VARCHAR(1000) NOT NULL,
    expiration_date DATETIME,
    ip VARCHAR(15),
    computer_id VARCHAR(100),
    issuer_id INT,
    FOREIGN KEY (issuer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE job_bans (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    job_id INT NOT NULL,
    ban_id INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (ban_id) REFERENCES bans(id) ON DELETE CASCADE
);

CREATE TABLE theme_settings (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    theme_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(300),
    default_value VARCHAR(1000)
);

CREATE TABLE user_theme_settings (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    theme_id INT NOT NULL,
    theme_value VARCHAR(1000) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (theme_id) REFERENCES theme_settings(id) ON DELETE CASCADE
);