from flask import Flask, request, jsonify, make_response
import numpy as np
import pandas as pd
import time

from database_connection import databaseConnection

app = Flask(__name__)

'''
ec2-52-91-22-96.compute-1.amazonaws.com:5000/api/v1/contract_transactions/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d
'''
@app.route('/api/v1/contract_transactions/<string:contract_address>', methods=['GET'])
def transactions(contract_address):
    query = '''
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
        WHERE contract_address = '{}'
        LIMIT 200;
        '''
    conn = databaseConnection.remote()
    df = pd.read_sql(query.format(contract_address), conn)
    conn.close()
    return jsonify(df.to_dict(orient='records'))

@app.route('/api/v1/contract_transactions/<string:contract_address>?start_date=<string:start_date>&end_date=<string:end_date>', methods=['GET'])
def transactions_by_date(contract_address, **args):
    start_date = args.get('start_date')
    end_date = args.get('end_date')
    start_unix, end_unix = convert_to_unix(start_date, end_date)

    query = '''
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
        WHERE contract_address = '{}'
            AND timestamp BETWEEN {} and {};
        '''
    conn = databaseConnection.remote()
    df = pd.read_sql(query.format(contract_address), conn)
    conn.close()
    return jsonify(df.to_dict(orient='records'))

def convert_to_unix(start_date, end_date):
    unix_times = []
    for date in [start_date, end_date]:
        t = pd.to_datetime(s)
        unix_times.append(time.mktime(t.timetuple()))
    return unix_times

if __name__ == '__main__':
    app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            threaded=False
            )
