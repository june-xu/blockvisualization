from flask import jsonify
from .utils import determine_dates

from DB.db_queries_adapter import historical_query


# required params in json_dict: {'type':'historical', 'account': {$list or single}}
# optional params in json_dict: {'first_date', 'last_date', 'num_years', }
def historical(json_data: dict) -> (dict, int):
    """

    :param json_data: dict of input data with keys: [type, account, start, stop, slice]
    :type json_data: dict
    :return: response_data: processed data to be returned to be sent to end user
    :rtype: response_data: dict
    """
    # call datababase for the accounts
    if not validate_params(json_data, ['accounts']):
        return jsonify({'ok': False, 'error': 'Missing Required Json Data'})

    date_pair = determine_dates(start=json_data.get('first_date'),
                                stop=json_data.get('last_date'),
                                year_length=json_data.get('year_length'))

    result_dict = {}
    if isinstance(json_data['accounts'], list):
        unique_accounts = list(set(json_data['accounts']))
        for single_account in unique_accounts:
            result_dict[single_account] = historical_query(first_date=date_pair.start,
                                                           last_date=date_pair.stop,
                                                           acc_val=single_account,
                                                           wanted_fields='MINIMAL')

    else:
        account_name = json_data['accounts']
        result_dict[account_name] = historical_query(first_date=date_pair.start,
                                                     last_date=date_pair.stop,
                                                     acc_val=account_name,
                                                     wanted_fields='MINIMAL')

    return result_dict


def validate_params(input_dict, required_params):
    return all(single_param in input_dict.keys() for single_param in required_params)


def jsonify_results(list_queries):
    if isinstance(list_queries, list):
        return []


if __name__ == '__main__':
    print('h8')
