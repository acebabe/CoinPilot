from flask import Flask
from config import Config
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

socketio = SocketIO(cors_allowed_origins="*", async_mode="eventlet")
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    socketio.init_app(app)

    # Import blueprints from the new routes package
    from routes import auth_bp, wallets_bp, transactions_bp, notifications_bp, receipts_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(wallets_bp, url_prefix="/wallets")
    app.register_blueprint(transactions_bp, url_prefix="/transactions")
    app.register_blueprint(notifications_bp, url_prefix="/notifications")
    app.register_blueprint(receipts_bp, url_prefix="")  # receipts routes are top-level (/transactions/<id>/screenshot.png)

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, host="0.0.0.0", port=5000)