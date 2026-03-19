#!/usr/bin/env python3
"""
Koh Lanta Bingo Backend Server
Handles saving and loading user data to/from JSON files
"""

from flask import Flask, request, jsonify, send_from_directory
import json
import os
from pathlib import Path

app = Flask(__name__, static_folder='.', static_url_path='')

# Data directory for storing user JSON files
DATA_DIR = Path('data')
DATA_DIR.mkdir(exist_ok=True)

def get_user_file(player_name):
    """Get the file path for a player's data"""
    # Sanitize filename
    safe_name = "".join(c for c in player_name if c.isalnum() or c in ('-', '_')).lower()
    if not safe_name:
        safe_name = 'anonymous'
    return DATA_DIR / f'{safe_name}.json'

@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory('.', path)

@app.route('/api/save', methods=['POST'])
def save_data():
    """Save user data to JSON file"""
    try:
        data = request.json
        player_name = data.get('name', 'anonymous')
        
        if not player_name or not player_name.strip():
            return jsonify({'error': 'Player name is required'}), 400
        
        user_file = get_user_file(player_name)
        
        # Save data to JSON file
        with open(user_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({'success': True, 'message': f'Data saved for {player_name}'}), 200
    except Exception as e:
        print(f'Error saving data: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/load/<player_name>', methods=['GET'])
def load_data(player_name):
    """Load user data from JSON file"""
    try:
        user_file = get_user_file(player_name)
        
        if not user_file.exists():
            return jsonify({'error': 'Player data not found'}), 404
        
        with open(user_file, 'r') as f:
            data = json.load(f)
        
        return jsonify(data), 200
    except Exception as e:
        print(f'Error loading data: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def list_users():
    """List all saved users for admin view"""
    try:
        users = []
        for user_file in DATA_DIR.glob('*.json'):
            try:
                with open(user_file, 'r') as f:
                    data = json.load(f)
                display_name = data.get('name') or user_file.stem
                users.append({
                    'name': display_name,
                    'file': user_file.name,
                    'updatedAt': data.get('timestamp')
                })
            except Exception:
                users.append({
                    'name': user_file.stem,
                    'file': user_file.name,
                    'updatedAt': None
                })

        users.sort(key=lambda item: (item['name'] or '').lower())
        return jsonify({'users': users}), 200
    except Exception as e:
        print(f'Error listing users: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete/<player_name>', methods=['DELETE'])
def delete_data(player_name):
    """Delete user data file"""
    try:
        user_file = get_user_file(player_name)
        
        if user_file.exists():
            user_file.unlink()
            return jsonify({'success': True, 'message': f'Data deleted for {player_name}'}), 200
        else:
            return jsonify({'error': 'Player data not found'}), 404
    except Exception as e:
        print(f'Error deleting data: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    print('Starting Koh Lanta Bingo Server...')
    print(f'Listening on port {port}')
    app.run(debug=debug, host='0.0.0.0', port=port)
