from flask import Flask
from app.utils.db import db
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from app.routes.producto_rt import productos_bp
    app.register_blueprint(productos_bp)

    from app.routes.categoria_rt import categoria_bp
    app.register_blueprint(categoria_bp)

    from app.routes.venta_rt import venta_bp
    app.register_blueprint(venta_bp)

    with app.app_context():
        db.create_all()

    return app