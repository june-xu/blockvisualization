import psycopg2
from etherscan.accounts import Account
from etherscan.contracts import Contract
import pandas as pd

API_KEY = 'JWMI2CVRP23PM5PYMZ89YPU6EPS45YEWZP'
# ADDRESS = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d' #cryptokitties
# ADDRESS = '0x1A468849923b441a10B2673af9A74b5b71906087' #nbacrypto
# ADDRESS = '0x26D5Bd2dfEDa983ECD6c39899e69DAE6431Dffbb' #erc20 #no results returned
# ADDRESS = '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E' #status token
# ADDRESS = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819' #ether delta #yep
# ADDRESS = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef' #ens registrar #yep

ADDRESS = '0xa21037849678Af57f9865c6B9887F4e339f6377a' #rando

COL_NAMES = {
    'blockHash': 'block_hash',
    'blockNumber': 'block_number',
    'confirmations': 'confirmations',
    'contractAddress': 'contract_address',
    'cumulativeGasUsed': 'cumulative_gas_used',
    'from': 'tx_from',
    'gas': 'gas',
    'gasPrice': 'gas_price',
    'gasUsed': 'gas_used',
    'hash': 'hash',
    'input': 'input',
    'isError': 'is_error',
    'nonce': 'nonce',
    'timeStamp': 'timestamp',
    'to': 'tx_to',
    'transactionIndex': 'transaction_index',
    'txreceipt_status': 'txreceipt_status',
    'value': 'value',
    'errCode': 'err_code',
    'traceId': 'trace_id',
    'type': 'type',
    }

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

def db_connection():
    conn = psycopg2.connect(**DBS['local'])
    return conn

def insert_to_database(transactions):
    print('inserting to database')
    conn = db_connection()
    with conn.cursor() as curs:
        for transaction in transactions:
            curs.execute('INSERT INTO normal_tx ({0}) VALUES {1};'.format(', '.join(transaction.keys()), tuple(transaction.values())))
    conn.commit()
    conn.close()

def rename_keys(t):
    print('renaming columns')
    df = pd.DataFrame(t)
    df.rename(columns=COL_NAMES, inplace=True)
    df['contract_address'] = ADDRESS
    df.drop_duplicates(subset=['hash'], inplace=True)
    t = df.to_dict(orient='records')
    return t

def get_single_transaction_page():
    api = Account(address=ADDRESS, api_key=API_KEY)
    transactions = api.get_transaction_page(page=1, offset=10000, sort='des')
    return transactions

def get_all_transactions():
    api = Account(address=ADDRESS, api_key=API_KEY)
    transactions = api.get_all_transactions(offset=10000, sort='asc', internal=True)
    return transactions

def get_contract_abi():
    api = Contract(address=ADDRESS, api_key=API_KEY)
    abi = api.get_abi()
    return abi


def main():
    # t = get_single_transaction_page()
    t = get_all_transactions()
    if len(t) == 0:
        print('no transactions found')
        return t
    # t = rename_keys(t)
    # d = insert_to_database(t)
    return t

if __name__ == '__main__':
    t = main()
    # t = get_contract_abi()
