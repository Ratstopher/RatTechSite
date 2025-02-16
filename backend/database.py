import psycopg2
from psycopg2.extras import RealDictCursor
import os

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
    
    def get_user_by_email(self, email):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            return cur.fetchone()
    
    def get_user_by_id(self, user_id):
        with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            return cur.fetchone()
    
    def create_user(self, user_data):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO users (email, password, name)
                VALUES (%s, %s, %s)
                RETURNING id
            """, (user_data['email'], user_data['password'], user_data['name']))
            self.conn.commit()
            return cur.fetchone()[0] 