import psycopg2
import pandas as pd
import time
from config import pg_uname, pg_pass, pg_url, table, db_name

class DataBaseConnection(object):
    DBS = {
        'remote': {
            'host': pg_url,
            'port': 5432,
            'user': pg_uname,
            'password': pg_pass,
            'dbname': table,
            'connect_timeout': 20,
        },
        'local': {
            'port': 5432,
            'dbname': db_name,
            'user': pg_uname,
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


def contract_address_no_date(contract_address=None,
                             start_date=None,
                             stop_date=None,
                             limit_count=1000):
    start_unix, end_unix = convert_to_unix(start_date, stop_date)

    query = f'''
            SELECT
                block_number,
                timestamp,
                hash,
                nonce,
                block_hash,
                transaction_index,
                tx_from,
                tx_to,
                value,
                gas,
                gas_price,
                is_error,
                txreceipt_status,
                contract_address,
                cumulative_gas_used,
                gas_used,
                confirmations,
                err_code,
                trace_id,
                type
            FROM normal_tx
            WHERE contract_address = '{contract_address}'
            AND timestamp BETWEEN {start_date} and {stop_date}
            LIMIT {limit_count};
            '''
    conn = DataBaseConnection.remote()
    df = pd.read_sql(query, conn)
    conn.close()

    return df.to_dict(orient='records')


def convert_to_unix(start_date, end_date):
    unix_times = []
    for date in [start_date, end_date]:
        t = pd.to_datetime(date)
        unix_times.append(time.mktime(t.timetuple()))
    return unix_times
