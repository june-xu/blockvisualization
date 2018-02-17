CREATE DATABASE dteam;

\c dteam

CREATE TABLE normal_tx (
    block_number BIGINT NOT NULL,
    time_stamp BIGINT NOT NULL,
    hash VARCHAR PRIMARY KEY,
    nonce SMALLINT NOT NULL,
    block_hash VARCHAR NOT NULL,
    transaction_index SMALLINT NOT NULL,
    tx_from VARCHAR NOT NULL,
    tx_to VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    gas BIGINT NOT NULL,
    gas_price BIGINT NOT NULL,
    is_error VARCHAR NOT NULL,
    txreceipt_status VARCHAR NOT NULL,
    input VARCHAR NOT NULL,
    contract_address VARCHAR NOT NULL,
    cumulative_gas_used VARCHAR NOT NULL,
    gas_used BIGINT NOT NULL,
    confirmations VARCHAR NOT NULL
)
    -- blockNumber
    -- timeStamp
    -- hash
    -- nonce
    -- blockHash
    -- transactionIndex
    -- from
    -- to
    -- value
    -- gas
    -- gasPrice
    -- isError
    -- txreceipt_status
    -- input
    -- contractAddress
    -- cumulativeGasUsed
    -- gasUsed
    -- confirmations
