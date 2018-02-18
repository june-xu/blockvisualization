from DB.db_query_caller import contract_address_no_date

def historical_query( first_date: int = None,
                     last_date: int = None,
                     acc_val: str = None,
                     wanted_fields: str = 'MINIMAL') -> list:
    """
    :param first_date: earliest date wanted, epoch seconds
    :param last_date: last date wanted, epoch seconds
    :param acc_val: account to query
    :param wanted_fields: fields to query for
    :return: return_data: list of query results
    """

    fields_to_query = query_fields(wanted_fields)
    # TODO implement if no results for account
    # TODO implement result caching locally in case shit happens to internet... again
    try:
        query_result = contract_address_no_date(contract_address=acc_val,
                                                start_date=first_date,
                                                stop_date=last_date,
                                                )

    except Exception as E:
        print(E)
        query_result = None


    return query_result


def all_groups():
    return ['block_number', 'time_stamp', 'hash', 'nonce', 'block_hash', 'transaction_index', 'tx_from', 'tx_to',
            'value', 'gas', 'gas_price', 'is_error', 'txreceipt_status', 'input', 'contract_address',
            'cumulative_gas_used', 'gas_used', 'confirmations', ]


def query_fields(field_group: str = None):
    fields_group_map = {'MINIMAL': ['hash', 'tx_from', 'tx_to', 'time_stamp'],
                        'VAL_MIN': ['hash', 'tx_from', 'tx_to', 'time_stamp', 'value',
                                    'gas', 'gas_price', 'gas_price'],
                        'BLOCK_MIN': ['hash', 'tx_from', 'tx_to', 'time_stamp',
                                      'block_number'],
                        'CONTRACT_MIN': ['hash', 'tx_from', 'tx_to', 'time_stamp', 'contract_address']
                        }
    try:
        groups = fields_group_map[field_group]
    except KeyError:
        groups = all_groups()

    return groups
