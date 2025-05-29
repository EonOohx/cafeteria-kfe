from flask import Blueprint, render_template, request, redirect

from app.models.categoria import Categorias
from app.models.producto import Productos

from app.utils.db import db

productos_bp = Blueprint('productos', __name__)


@productos_bp.route('/productos')
def productos():
    categorias = Categorias.query.all()
    lista_productos = Productos.query.all()
    return render_template("productos.html", categorias=categorias, productos=lista_productos)


@productos_bp.route("/agregar_producto", methods=['POST'])
def nuevo_producto():
    nombre = request.form['nombre']
    categoria = request.form['categoria']
    precio = request.form['precio']
    inventariable = request.form.get('inventariable') == 'on'
    existencia = None
    if inventariable:
        existencia = request.form['existencia']
    nuevo_producto = Productos(id_categoria=categoria, nombre=nombre, precio=precio, inventariable=inventariable,
                               existencia=existencia)
    db.session.add(nuevo_producto)
    db.session.commit()
    return redirect("/productos")
