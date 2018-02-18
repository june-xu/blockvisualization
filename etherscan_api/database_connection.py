import psycopg2

class databaseConnection(object):
    DBS = {
        'remote': {
        'host': 'dteam.c0u8aiwmaigv.us-east-1.rds.amazonaws.com',
        'port': 5432,
        'user': 'postgres',
        'password': 'dteam2018',
        'dbname': 'dteam',
        'connect_timeout': 20,
        },
        'local': {
        'port': 5432,
        'dbname':'dteam',
        'user':'postgres',
        'connect_timeout': 20,
        },
    }

    @classmethod
    def local(cls):
        conn = psycopg2.connect(**cls.DBS['local'])
        return conn

    @classmethod
    def remote(cls):
        conn = psycopg2.connect(**cls.DBS['remote'])
        return conn

if __name__ == '__main__':
    conn = databaseConnection.local()
