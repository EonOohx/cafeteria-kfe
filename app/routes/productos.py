from flask import Blueprint, render_template, request

from app.models.categoria import Categoria
from app.models.producto import Productos

from app.utils.db import db

productos_bp = Blueprint('productos', __name__)


@productos_bp.route('/productos')
def productos():
    categorias = Categoria.query.all()
    return render_template("productos.html", categorias=categorias)


@productos_bp.route("/nuevo_producto", methods=['POST'])
def nuevo_producto():
    nombre = request.form['nombre']
    categoria = request.form['categoria']
    precio = request.form['precio']
    existencia = request.form['existencia']
    nuevo_producto = Productos(id_categoria=categoria, nombre=nombre, precio=precio, existencia=existencia)
    db.session.add(nuevo_producto)
    db.session.commit()
    return "Producto guardado exitosamente"
