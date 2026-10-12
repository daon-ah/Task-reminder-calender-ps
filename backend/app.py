from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database import init_db
from routes.task_routes import task_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # allow the React dev server / deployed frontend to call the API

    init_db(app)
    app.register_blueprint(task_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
