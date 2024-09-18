from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def hash_file(file, algorithm='sha256'):
    try:
        hash_func = hashlib.new(algorithm)
    except ValueError:
        return None

    while chunk := file.read(4096):
        hash_func.update(chunk)

    return hash_func.hexdigest()

@app.route('/compare', methods=['POST'])
def compare_files():
    if 'file1' not in request.files or 'file2' not in request.files:
        return jsonify({"error": "Both files must be provided"}), 400

    file1 = request.files['file1']
    file2 = request.files['file2']
    algorithm = request.form.get('algorithm', 'sha256')

    # Generate hash codes for both files
    hash1 = hash_file(file1, algorithm)
    hash2 = hash_file(file2, algorithm)

    if hash1 is None or hash2 is None:
        return jsonify({"error": "Invalid algorithm"}), 400

    # Compare the two hash codes
    are_identical = hash1 == hash2

    return jsonify({
        "hash1": hash1,
        "hash2": hash2,
        "are_identical": are_identical
    })

if __name__ == "__main__":
    app.run(debug=True)
