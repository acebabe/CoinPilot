import os

import psycopg
from flask import Flask, jsonify

app = Flask(__name__)


def database_url():
    url = os.getenv("DATABASE_URL", "").strip()
    if url.startswith("postgres://"):
        url = "postgresql://" + url[len("postgres://"):]
    return url


@app.get("/")
def index():
    return jsonify({
        "service": "CoinPilot API",
        "status": "running"
    })


@app.get("/health")
def health():
    return jsonify({"status": "ok"}), 200


@app.get("/ready")
def ready():
    url = database_url()

    if not url:
        return jsonify({
            "status": "not_ready",
            "reason": "DATABASE_URL is not configured"
        }), 503

    try:
        with psycopg.connect(url, connect_timeout=5) as connection:
            connection.execute("SELECT 1")
    except Exception:
        app.logger.exception("Database readiness check failed")
        return jsonify({
            "status": "not_ready",
            "reason": "Database connection failed"
        }), 503

    return jsonify({
        "status": "ready",
        "database": "connected"
    }), 200
