from flask import Flask

from app.utils.db import db, migrate
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes.producto_rt import productos_bp
    app.register_blueprint(productos_bp)

    from app.routes.categoria_rt import categoria_bp
    app.register_blueprint(categoria_bp)

    from app.routes.venta_rt import venta_bp
    app.register_blueprint(venta_bp)

    from app.routes.ventas_realizadas_rt import ventas_realizadas_bp
    app.register_blueprint(ventas_realizadas_bp)

    from app.routes.gerencia_rt import gerencia_bp
    app.register_blueprint(gerencia_bp)

    return app
