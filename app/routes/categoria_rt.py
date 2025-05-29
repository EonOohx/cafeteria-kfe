from flask import Blueprint, request, redirect, render_template

from app.models.categoria import Categorias
from app.utils.db import db

categoria_bp = Blueprint('categorias', __name__)


@categoria_bp.route('/categorias')
def categorias():
    lista_categorias = Categorias.query.all()
    return render_template("categorias.html", categorias=lista_categorias)


@categoria_bp.route('/agregar_categoria', methods=['POST'])
def registrar_categoria():
    nombre = request.form['nombre']
    print("Nombre recibido:", nombre)
    nueva_categoria = Categorias(nombre=nombre)
    db.session.add(nueva_categoria)
    db.session.commit()
    return redirect("/categorias")
