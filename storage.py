import json
import os

def save_data(data, path='data.json'):
    """Save data to a JSON file."""
    with open(path, 'w') as file:
        json.dump(data, file, indent=2)

def load_data(path='data.json'):
    """Load data from a JSON file."""
    if os.path.exists(path):
        with open(path, 'r') as file:
            return json.load(file)
    else:
        return []
