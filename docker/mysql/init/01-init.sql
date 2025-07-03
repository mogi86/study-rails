-- MySQL初期化スクリプト
-- 文字エンコーディングの設定
SET NAMES utf8mb4;
SET character_set_server = utf8mb4;
SET collation_server = utf8mb4_unicode_ci;

-- データベースの作成（存在しない場合）
CREATE DATABASE IF NOT EXISTS study_rails_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS study_rails_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 権限の設定
GRANT ALL PRIVILEGES ON study_rails_development.* TO 'rails'@'%';
GRANT ALL PRIVILEGES ON study_rails_test.* TO 'rails'@'%';

FLUSH PRIVILEGES; 