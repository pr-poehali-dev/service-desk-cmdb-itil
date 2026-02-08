import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta

def get_db_connection():
    """Создает подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """API для управления Service Desk: инциденты, заявки, CMDB"""
    
    method = event.get('httpMethod', 'GET')
    
    # Извлекаем путь из queryStringParameters или используем корневой путь
    query_params = event.get('queryStringParameters') or {}
    path = query_params.get('path', '/')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # GET /incidents - получить все инциденты
        if method == 'GET' and path == '/incidents':
            cursor.execute('''
                SELECT incident_id, title, description, priority, status, 
                       category, assignee, sla_deadline, created_at, updated_at, resolved_at
                FROM incidents 
                ORDER BY created_at DESC
            ''')
            incidents = cursor.fetchall()
            
            # Форматируем даты
            for inc in incidents:
                if inc['sla_deadline']:
                    inc['sla_deadline'] = inc['sla_deadline'].isoformat()
                if inc['created_at']:
                    inc['created_at'] = inc['created_at'].isoformat()
                if inc['updated_at']:
                    inc['updated_at'] = inc['updated_at'].isoformat()
                if inc['resolved_at']:
                    inc['resolved_at'] = inc['resolved_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': incidents}, ensure_ascii=False)
            }
        
        # POST /incidents - создать инцидент
        elif method == 'POST' and path == '/incidents':
            body = json.loads(event.get('body', '{}'))
            
            # Генерируем ID
            cursor.execute("SELECT COUNT(*) as count FROM incidents")
            count = cursor.fetchone()['count']
            incident_id = f"INC-{str(count + 1).zfill(3)}"
            
            # Рассчитываем SLA дедлайн в зависимости от приоритета
            priority = body.get('priority', 'Средний')
            sla_hours = {'Критический': 2, 'Высокий': 4, 'Средний': 8, 'Низкий': 24}
            sla_deadline = datetime.now() + timedelta(hours=sla_hours.get(priority, 8))
            
            cursor.execute('''
                INSERT INTO incidents 
                (incident_id, title, description, priority, status, category, assignee, sla_deadline)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING incident_id, title, priority, status, created_at
            ''', (
                incident_id,
                body.get('title'),
                body.get('description'),
                priority,
                'Новый',
                body.get('category'),
                body.get('assignee'),
                sla_deadline
            ))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': dict(result)}, ensure_ascii=False, default=str)
            }
        
        # GET /requests - получить все заявки
        elif method == 'GET' and path == '/requests':
            cursor.execute('''
                SELECT request_id, title, description, priority, status, 
                       category, requester, assignee, created_at, updated_at, completed_at
                FROM service_requests 
                ORDER BY created_at DESC
            ''')
            requests = cursor.fetchall()
            
            for req in requests:
                if req['created_at']:
                    req['created_at'] = req['created_at'].isoformat()
                if req['updated_at']:
                    req['updated_at'] = req['updated_at'].isoformat()
                if req['completed_at']:
                    req['completed_at'] = req['completed_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': requests}, ensure_ascii=False)
            }
        
        # POST /requests - создать заявку
        elif method == 'POST' and path == '/requests':
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute("SELECT COUNT(*) as count FROM service_requests")
            count = cursor.fetchone()['count']
            request_id = f"REQ-{str(count + 1).zfill(3)}"
            
            cursor.execute('''
                INSERT INTO service_requests 
                (request_id, title, description, priority, status, category, requester, assignee)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING request_id, title, priority, status, created_at
            ''', (
                request_id,
                body.get('title'),
                body.get('description'),
                body.get('priority', 'Средний'),
                'Новая',
                body.get('category'),
                body.get('requester'),
                body.get('assignee')
            ))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': dict(result)}, ensure_ascii=False, default=str)
            }
        
        # GET /cmdb - получить все CI
        elif method == 'GET' and path == '/cmdb':
            cursor.execute('''
                SELECT ci_id, name, type, status, location, owner, description,
                       ip_address, serial_number, purchase_date, warranty_expiry,
                       created_at, updated_at
                FROM cmdb_items 
                ORDER BY name
            ''')
            items = cursor.fetchall()
            
            for item in items:
                if item['purchase_date']:
                    item['purchase_date'] = item['purchase_date'].isoformat()
                if item['warranty_expiry']:
                    item['warranty_expiry'] = item['warranty_expiry'].isoformat()
                if item['created_at']:
                    item['created_at'] = item['created_at'].isoformat()
                if item['updated_at']:
                    item['updated_at'] = item['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': items}, ensure_ascii=False)
            }
        
        # POST /cmdb - создать CI
        elif method == 'POST' and path == '/cmdb':
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute("SELECT COUNT(*) as count FROM cmdb_items")
            count = cursor.fetchone()['count']
            ci_id = f"CI-{str(count + 1).zfill(3)}"
            
            cursor.execute('''
                INSERT INTO cmdb_items 
                (ci_id, name, type, status, location, owner, description, ip_address, serial_number)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING ci_id, name, type, status, created_at
            ''', (
                ci_id,
                body.get('name'),
                body.get('type', 'Другое'),
                body.get('status', 'Активен'),
                body.get('location'),
                body.get('owner'),
                body.get('description'),
                body.get('ip_address'),
                body.get('serial_number')
            ))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': dict(result)}, ensure_ascii=False, default=str)
            }
        
        # GET /stats - статистика для дашборда
        elif method == 'GET' and path == '/stats':
            stats = {}
            
            # Открытые инциденты
            cursor.execute("SELECT COUNT(*) as count FROM incidents WHERE status NOT IN ('Решен', 'Закрыт')")
            stats['open_incidents'] = cursor.fetchone()['count']
            
            # Активные заявки
            cursor.execute("SELECT COUNT(*) as count FROM service_requests WHERE status NOT IN ('Выполнена', 'Закрыта', 'Отклонена')")
            stats['active_requests'] = cursor.fetchone()['count']
            
            # Активные CI
            cursor.execute("SELECT COUNT(*) as count FROM cmdb_items WHERE status = 'Активен'")
            stats['active_ci'] = cursor.fetchone()['count']
            
            # SLA соблюдение
            cursor.execute('''
                SELECT 
                    COUNT(*) FILTER (WHERE sla_deadline > CURRENT_TIMESTAMP OR status IN ('Решен', 'Закрыт')) as met,
                    COUNT(*) as total
                FROM incidents
                WHERE sla_deadline IS NOT NULL
            ''')
            sla_data = cursor.fetchone()
            stats['sla_percentage'] = round((sla_data['met'] / sla_data['total'] * 100) if sla_data['total'] > 0 else 100, 1)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'data': stats}, ensure_ascii=False)
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Endpoint not found'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}, ensure_ascii=False)
        }
    
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()