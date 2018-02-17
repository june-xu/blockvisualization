import psycopg2
from etherscan.accounts import Account
import json
import pdb
import pandas as pd

API_KEY = 'JWMI2CVRP23PM5PYMZ89YPU6EPS45YEWZP'
# COL_NAMES = [
#     'block_hash',
#     'block_number',
#     'confirmations',
#     'contract_address',
#     'cumulative_gas_used',
#     'from',
#     'gas',
#     'gas_price',
#     'gas_used',
#     'hash',
#     'input',
#     'is_error',
#     'nonce',
#     'time_stamp',
#     'to',
#     'transaction_index',
#     'txreceipt_status',
#     'value'
#     ]

map_dict= {
    'blockNumber': 'block_number',
    'timeStamp': 'time_stamp',
    'hash': 'hash',
    'nonce':'nonce',
    'blockHash':'block_hash',
    'transactionIndex':'transaction_index',
    'from':'tx_from',
    'to':'tx_to',
    'value': 'value',
    'gas':'gas',
    'gasPrice':'gas_price',
    'isError':'is_error',
    'txreceipt_status':'txreceipt_status',
    'input':'input',
    'contractAddress':'contract_address',
    'cumulativeGasUsed':'cumulative_gas_used',
    'gasUsed':'gas_used',
    'confirmations':'confirmations'
    }


# tuple_list = [ (map_dict[key], value) for key,value in transactions.items()]

def db_connection():
    db = {
        'port': 5432,
        'dbname':'dteam',
        'user':'postgres',
        }
    conn = psycopg2.connect(**db)
    return conn

def insert_to_database(transactions):
    # transaction_keys = sorted(t[0].keys())
    # data = [tuple(transaction[col]) for transaction in t for col in transaction_keys]
    tuple_list = [ (map_dict[key], value) for key,value in transactions.items()]
    print(tuple_list)
    conn = db_connection()
    with conn.cursor() as curs:
        for d in data:
            curs.execute('INSERT INTO normal_tx ({0}) VALUES {1}'.format(', '.join(COL_NAMES), d))
    conn.commit()
    conn.close()
    return data

def get_single_transaction_page():
    address = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
    api = Account(address=address, api_key=API_KEY)
    transactions = api.get_transaction_page(page=1, offset=10000, sort='des')
    return transactions

def main():
    t = get_single_transaction_page()
    d = insert_to_database(t)
    return t

if __name__ == '__main__':
    t = main()
