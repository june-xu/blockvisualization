from flask import Flask, jsonify, request
from datetime import datetime
from .api_auth import require_appkey
from .api_methods import historical


app = Flask(__name__)


@app.route('/eth_api', methods=['GET', 'POST'])
#@require_appkey
def index():
    # forward the request to the data grabber.
    json_data = request.get_json()
    print(json_data)
    values = None
    if not json_data:
        return jsonify({'ok': False, 'error': 'Missing Required Body Params'}), 400
    if json_data['type'] == 'historical':
        values = historical(json_data)
    if json_data['type'] == 'graph_nodes':
        raise NotImplemented

    return jsonify({'ok': True,
                    'time': int(datetime.now().timestamp()),
                    'data': values}), 200


if __name__ == '__main__':
    # app.run(debug=True)
    query_vals = {'first_date': 1,
                  'last_date': 1512413453,
                  'year_length': 3,
                  'type': historical,
                  'account': '0xc7af99fe5513eb6710e6d5f44f9989da40f27f26',
                  }
    historical(json_data=query_vals)
