from flask import Blueprint, request

from app.models.categoria import Categoria
from app.utils.db import db

categoria_bp = Blueprint('categoria', __name__)


@categoria_bp.route('/nueva_categoria', methods=['POST'])
def registrar_categoria():
    nombre = request.form['nombre']
    print("Nombre recibido:", nombre)
    nueva_categoria = Categoria(nombre=nombre)
    db.session.add(nueva_categoria)
    db.session.commit()
    return "Categoria registrada exitosamente"