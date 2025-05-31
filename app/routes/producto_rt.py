from flask import Blueprint, render_template, request, redirect, jsonify

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
def agregar_producto():
    nombre = request.form['nombre']
    categoria = request.form['categoria']
    precio = request.form['precio']
    inventariable = request.form.get('inventariable') == 'on'
    existencia = 0
    if inventariable:
        existencia = request.form['existencia']
    producto = Productos(id_categoria=categoria, nombre=nombre, precio=precio, inventariable=inventariable,
                         existencia=existencia)
    db.session.add(producto)
    db.session.commit()
    return redirect("/productos")


@productos_bp.route("/editar_producto/<id_producto>", methods=['GET', 'POST'])
def editar_producto(id_producto):
    producto = Productos.query.get(id_producto)
    if request.method == 'POST':
        actualizar_producto(producto)
        return redirect("/productos")
    categorias = Categorias.query.all()
    return render_template('actualizar_producto.html', producto=producto, categorias=categorias, title="producto")


def actualizar_producto(producto):
    producto.nombre = request.form['nombre']
    producto.id_categoria = request.form['categoria']
    producto.precio = request.form['precio']

    inventariable = request.form.get('inventariable') == 'on'
    producto.inventariable = inventariable

    existencia = 0
    if inventariable:
        existencia = request.form['existencia']
    producto.existencia = existencia

    db.session.commit()


@productos_bp.route("/eliminar_producto/<id_producto>")
def eliminar_producto(id_producto):
    producto = Productos.query.get(id_producto)
    db.session.delete(producto)
    db.session.commit()
    return redirect("/productos")


@productos_bp.route("/productos_categoria/<id_categoria>")
def obtener_productos_categoria(id_categoria):
    list_productos = Productos.query.filter_by(id_categoria=id_categoria).all()
    return jsonify([p.to_dict() for p in list_productos]
)
