CREATE DATABASE license_analytics;
USE license_analytics;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin','user') DEFAULT 'user'
);
CREATE TABLE license_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    license_type VARCHAR(100),
    product VARCHAR(100),
    network_type VARCHAR(100),

    mac_address VARCHAR(100),
    ip_address VARCHAR(100),

    screenshot_path VARCHAR(255),

    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
);
SELECT * FROM users;
DESCRIBE license_logs;
SELECT * FROM license_logs;
SELECT id, name, email, role
FROM users;
UPDATE users
SET role='admin'
WHERE email='admin@gmail.com';