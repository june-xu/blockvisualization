--connection details
--psql --host=dteam.c0u8aiwmaigv.us-east-1.rds.amazonaws.com --port=5432 --username=postgres --dbname=dteam --password dteam2018
--pg_dump dteam > dteam.sql
--psql dteam < dteam.sql
--pg_dump -Fc -v -h dteam.c0u8aiwmaigv.us-east-1.rds.amazonaws.com -U postgres dteam > dteam.dump
--createdb dteam
--pg_restore -v -h dteam.c0u8aiwmaigv.us-east-1.rds.amazonaws.com -U postgres -d dteam dteam.dump

--ssh
-- ssh -i ~/pems/dteam.pem ubuntu@ec2-52-91-22-96.compute-1.amazonaws.com
-- scp -i ~/pems/dteam.pem ./etherscan_api.py ubuntu@ec2-52-91-22-96.compute-1.amazonaws.com:

--creating an anaconda environment with the correct ipython version
--conda update -n base conda
--conda create -n py36 python=3.6 anaconda
--conda install -c anaconda psycopg2

CREATE DATABASE dteam;

\c dteam

CREATE TABLE normal_tx (
    block_number BIGINT,
    timestamp BIGINT,
    hash VARCHAR PRIMARY KEY,
    nonce SMALLINT,
    block_hash VARCHAR,
    transaction_index SMALLINT,
    tx_from VARCHAR,
    tx_to VARCHAR,
    value VARCHAR,
    gas BIGINT,
    gas_price BIGINT,
    is_error VARCHAR,
    txreceipt_status VARCHAR,
    input VARCHAR,
    contract_address VARCHAR,
    cumulative_gas_used VARCHAR,
    gas_used BIGINT,
    confirmations VARCHAR,
    err_code VARCHAR,
    trace_id VARCHAR,
    type VARCHAR
    )
