# ToDoアプリ機能 要件定義

## 1. 概要
- ログイン済みユーザーが自分専用のToDoリストを作成・管理できる。
- ToDoデータはPostgreSQLに永続化される。

## 2. 機能要件
- ToDoの新規作成（タイトル、詳細、期限、完了日時）
- ToDoの一覧表示（ログインユーザーごとに表示）
- ToDoの編集（タイトル、詳細、期限、完了日時の更新）
- ToDoの削除
- ToDoの完了/未完了切り替え（done_atに値を入れる/消す）
- 各ToDoはログインユーザーに紐づく

## 3. 非機能要件
- 認証必須（未ログイン時はToDo機能にアクセス不可）
- 入力バリデーション（タイトル必須、文字数制限など）
- DB障害時のエラーハンドリング
- UIはシンプルでスマホ対応

## 4. データモデル案
- todosテーブル
  - id: UUID, 主キー
  - user_id: UUID, usersテーブル外部キー
  - title: TEXT, 必須
  - detail: TEXT, 任意
  - due_date: TIMESTAMP, 任意
  - done_at: TIMESTAMP, 任意（nullなら未完了、値があれば完了日時）
  - created_at: TIMESTAMP, デフォルトNOW()
  - updated_at: TIMESTAMP, デフォルトNOW()

## 5. 画面・ルート案
- `/` : ToDo一覧（ログイン必須）
- `/todos/new` : ToDo新規作成
- `/todos/:id/edit` : ToDo編集

## 6. セキュリティ・運用
- 他ユーザーのToDoは閲覧・編集・削除不可
- 入力値のサニタイズ
- CSRF対策

## 7. 今後の拡張案
- 重要度・タグ付け
- 検索・フィルタ
- 期限切れToDoの強調表示
- 通知機能
