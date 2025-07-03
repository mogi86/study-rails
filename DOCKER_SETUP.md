# Docker Compose セットアップガイド

このプロジェクトはDocker ComposeでRailsアプリケーションとMySQLデータベースを構築できます。

## 📋 前提条件

- Docker
- Docker Compose

## 🚀 セットアップ手順

### 1. 環境変数の設定

`.env`ファイルを作成し、以下の内容を記載してください：

```env
# MySQL Database Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=study_rails_development
MYSQL_TEST_DATABASE=study_rails_test
MYSQL_USER=rails
MYSQL_PASSWORD=password
MYSQL_HOST=db

# Rails Configuration
RAILS_ENV=development
RAILS_MAX_THREADS=5
```

### 2. Dockerイメージのビルド

```bash
docker-compose build
```

### 3. データベースの起動

```bash
docker-compose up -d db
```

### 4. データベースの初期化

```bash
docker-compose run --rm web bundle exec rails db:create
docker-compose run --rm web bundle exec rails db:migrate
```

### 5. アプリケーションの起動

```bash
docker-compose up
```

または、バックグラウンドで実行：

```bash
docker-compose up -d
```

### 6. アプリケーションへのアクセス

ブラウザで http://localhost:3000 にアクセスしてください。

## 🛠️ 開発時のコマンド

### Railsコンソール

```bash
docker-compose run --rm web bundle exec rails console
```

### データベースマイグレーション

```bash
docker-compose run --rm web bundle exec rails db:migrate
```

### テストの実行

```bash
docker-compose run --rm web bundle exec rails test
```

### Gemの追加

Gemfileを編集後：

```bash
docker-compose run --rm web bundle install
docker-compose build web
```

## 🔧 トラブルシューティング

### データベース接続エラー

MySQLコンテナが完全に起動するまで待つ：

```bash
docker-compose logs db
```

### 権限エラー

ボリュームをリセット：

```bash
docker-compose down -v
docker-compose up -d db
```

データベースを再作成：

```bash
docker-compose run --rm web bundle exec rails db:drop db:create db:migrate
```

## 📁 ファイル構成

```
study-rails/
├── docker-compose.yml          # Docker Compose設定
├── Dockerfile.dev             # 開発環境用Dockerfile
├── docker/
│   └── mysql/
│       └── init/
│           └── 01-init.sql    # MySQL初期化スクリプト
├── config/
│   └── database.yml           # MySQL設定
└── .env                       # 環境変数（作成が必要）
```

## 🔄 アップデート

新しい変更を反映：

```bash
docker-compose down
docker-compose build
docker-compose up
``` 