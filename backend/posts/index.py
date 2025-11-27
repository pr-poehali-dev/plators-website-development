import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления статьями блога
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными статей
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            post_id = event.get('pathParams', {}).get('id')
            
            if post_id:
                cur.execute("SELECT * FROM posts WHERE id = %s", (post_id,))
                post = cur.fetchone()
                if not post:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Post not found'})
                    }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(post), default=str)
                }
            
            category = params.get('category')
            published_only = params.get('published', 'true').lower() == 'true'
            
            query = "SELECT * FROM posts WHERE 1=1"
            query_params = []
            
            if category and category != 'all':
                query += " AND category = %s"
                query_params.append(category)
            
            if published_only:
                query += " AND published = true"
            
            query += " ORDER BY created_at DESC"
            
            cur.execute(query, query_params)
            posts = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(p) for p in posts], default=str)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """INSERT INTO posts (title, excerpt, content, category, image_url, video_url, published) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (
                    body_data.get('title'),
                    body_data.get('excerpt'),
                    body_data.get('content'),
                    body_data.get('category'),
                    body_data.get('image_url'),
                    body_data.get('video_url'),
                    body_data.get('published', False)
                )
            )
            conn.commit()
            new_post = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_post), default=str)
            }
        
        elif method == 'PUT':
            post_id = event.get('pathParams', {}).get('id')
            if not post_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID required'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                """UPDATE posts 
                   SET title = %s, excerpt = %s, content = %s, category = %s, 
                       image_url = %s, video_url = %s, published = %s, updated_at = CURRENT_TIMESTAMP
                   WHERE id = %s RETURNING *""",
                (
                    body_data.get('title'),
                    body_data.get('excerpt'),
                    body_data.get('content'),
                    body_data.get('category'),
                    body_data.get('image_url'),
                    body_data.get('video_url'),
                    body_data.get('published'),
                    post_id
                )
            )
            conn.commit()
            updated_post = cur.fetchone()
            
            if not updated_post:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_post), default=str)
            }
        
        elif method == 'DELETE':
            post_id = event.get('pathParams', {}).get('id')
            if not post_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post ID required'})
                }
            
            cur.execute("DELETE FROM posts WHERE id = %s RETURNING id", (post_id,))
            conn.commit()
            deleted = cur.fetchone()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Post not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Post deleted', 'id': deleted['id']})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()
