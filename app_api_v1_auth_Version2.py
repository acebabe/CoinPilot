from . import blueprint
from flask import request, jsonify, current_app
from app.extensions import db
from app.models.user import User
import bcrypt
from app.utils.jwt_auth import create_token, decode_token

@blueprint.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error": "missing_credentials"}), 400
    if len(password) < 8:
        return jsonify({"error": "password_too_short"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "already_exists"}), 400
    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "created", "user_id": user.id}), 201

@blueprint.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    u = User.query.filter_by(email=email).first()
    if not u or not bcrypt.checkpw(password.encode(), u.password_hash.encode()):
        return jsonify({"error": "invalid_credentials"}), 401
    token = create_token(u.id, expires_seconds=3600*24)
    return jsonify({"status": "ok", "token": token, "user_id": u.id, "is_admin": u.is_admin})