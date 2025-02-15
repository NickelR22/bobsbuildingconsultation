from flask import Flask, jsonify, request

app = Flask(__name__)


@app.route("/api")
def route_api():
    dict = { "error": "not implemented" }
    return jsonify(dict), 501
