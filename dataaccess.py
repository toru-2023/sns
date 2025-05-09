import mysql.connector
from mysql.connector import Error

def create_database_and_table():
    try:
        # MySQL に接続
        connection = mysql.connector.connect(
            host='localhost',
            user='root',          # MySQL のユーザー名
            password='abb0618abb'  # MySQL のパスワード
        )
        
        if connection.is_connected():
            # データベースを作成
            cursor = connection.cursor()
            cursor.execute("CREATE DATABASE IF NOT EXISTS Twitter")
            print("Database 'Twitter' created successfully.")

            # データベースを選択
            cursor.execute("USE Twitter")
            
            # テーブルを作成
            create_table_query = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(128) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL UNIQUE,
                phone_number VARCHAR(255) UNIQUE,
                display_name VARCHAR(255) NOT NULL,
                bio VARCHAR(255),
                location VARCHAR(255),
                website VARCHAR(255),
                birth_date DATE,
                profile_image VARCHAR(255),
                avatar_image VARCHAR(255),
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
            """
            cursor.execute(create_table_query)
            print("Table 'users' created successfully.")
            
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed.")

if __name__ == "__main__":
    create_database_and_table()

