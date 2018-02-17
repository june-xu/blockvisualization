#!/usr/bin/env python3

import json

def getFullBlockData(blockNum):
    with open(f"./block/{blockNum}.json") as f:
        data = json.load(f)
        ret = {
            'blockNum': blockNum,
            'timestamp': data['timestamp'],
            'author': data['author'],
            'txns': len(data['transactions'])
        }
        return ret

ret = [ getFullBlockData(blockNum) for blockNum in range(5000000, 5000100) ]

print(json.dumps(ret))
