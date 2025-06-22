from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Folder where uploaded files will be stored
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../shared/uploaded-files')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return 'No files part in request', 400

    uploaded_files = request.files.getlist('files')
    if not uploaded_files:
        return 'No files selected for upload', 400

    saved_files = []
    for file in uploaded_files:
        if file.filename:
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            saved_files.append(file.filename)
            print(f"[UPLOAD] Saved: {file.filename}")

    return jsonify({"message": "Files uploaded successfully", "files": saved_files})

@app.route('/edit', methods=['POST'])
def edit_file():
    data = request.get_json()
    filename = data.get('filename')
    content = data.get('content')

    if not filename:
        return 'Filename is required', 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return 'File not found', 404

    with open(filepath, 'w') as f:
        f.write(content)
        print(f"[EDIT] Updated: {filename}")

    return jsonify({"message": "File edited successfully", "file": filename})

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.get_json()
    filename = data.get('filename')

    if not filename:
        return 'Filename is required', 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        print(f"[DELETE] Removed: {filename}")
        return jsonify({"message": "File deleted successfully", "file": filename})
    else:
        return 'File not found', 404

@app.route('/files', methods=['GET'])
def list_files():
    try:
        files = os.listdir(UPLOAD_FOLDER)
        return jsonify(files)
    except Exception as e:
        return str(e), 500
    from flask import send_from_directory

@app.route('/files/<path:filename>')
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
