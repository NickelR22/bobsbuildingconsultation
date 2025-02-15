from flask import Flask, jsonify, make_response

app = Flask(__name__)


@app.route("/api/submit", methods=["POST"])
def route_api_submit():
    res = make_response("not implemented", 501)
    res.mimetype = "text/plain"
    return res


@app.route("/api/result", methods=["GET"])
def route_api_result():
    res = make_response("not implemented", 501)
    res.mimetype = "text/plain"
    return res
