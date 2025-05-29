from flask import Blueprint, request, redirect, render_template

from app.models.categoria import Categorias
from app.utils.db import db

categoria_bp = Blueprint('categorias', __name__)


@categoria_bp.route('/categorias')
def categorias():
    lista_categorias = Categorias.query.all()
    return render_template('/categorias.html', categorias=lista_categorias)


@categoria_bp.route('/agregar_categoria', methods=['POST'])
def agregar_categoria():
    nombre = request.form['nombre']
    print("Nombre recibido:", nombre)
    nueva_categoria = Categorias(nombre=nombre)
    db.session.add(nueva_categoria)
    db.session.commit()
    return redirect("/categorias")


@categoria_bp.route('/editar/<id_categoria>', methods=['GET', 'POST'])
def editar_categoria(id_categoria):
    categoria = Categorias.query.get(id_categoria)
    if request.method == 'POST':
        categoria.nombre = request.form['nombre']
        db.session.commit()
        return redirect("/categorias")
    return render_template('actualizar_categoria.html', categoria=categoria)


@categoria_bp.route('/eliminar/<id_categoria>')
def eliminar_categoria(id_categoria):
    categoria = Categorias.query.get(id_categoria)
    db.session.delete(categoria)
    db.session.commit()
    return redirect("/categorias")
