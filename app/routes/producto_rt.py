from flask import Blueprint, render_template, request, redirect, jsonify, url_for

import sqlalchemy.exc

from app.models.categoria import Categorias
from app.models.producto import Productos

from app.utils.db import db

productos_bp = Blueprint('productos', __name__)


@productos_bp.route('/productos')
def productos():
    categorias = Categorias.query.all()
    lista_productos = Productos.query.all()
    return render_template("productos.html", categorias=categorias, productos=lista_productos)


@productos_bp.route('/productos/categoria')
def filtrar_productos():
    id_categoria = request.args.get('categoria')
    try:
        if id_categoria:
            id_categoria = int(id_categoria)
            lista_productos = Productos.query.filter_by(id_categoria=id_categoria).all()
        else:
            lista_productos = Productos.query.all()
        return jsonify([p.to_dict() for p in lista_productos]), 200
    except sqlalchemy.exc.ProgrammingError as _:
        return jsonify({'error': "Hubo un error al consultar la tabla productos"}), 500


@productos_bp.route("/productos/agregar_producto", methods=['POST'])
def agregar_producto():
    nombre = request.form['nombre_producto']
    categoria = request.form['categoria']
    precio = request.form['precio']
    inventariable = request.form.get('inventariable') == 'on'
    if inventariable:
        existencia = request.form['existencia']
    else:
        existencia = request.form['disponible']
    producto = Productos(id_categoria=categoria, nombre=nombre, precio=precio, inventariable=inventariable,
                         existencia=existencia)
    db.session.add(producto)
    db.session.commit()
    return redirect(url_for("productos.productos"))


@productos_bp.route("/productos/editar_producto/<id_producto>", methods=['GET', 'POST'])
def editar_producto(id_producto):
    producto = Productos.query.get(id_producto)
    if request.method == 'POST':
        actualizar_producto(producto)
        return redirect(url_for("productos.productos"))
    categorias = Categorias.query.all()
    return render_template('actualizar_producto.html', producto=producto, categorias=categorias, title="resultado")


def actualizar_producto(producto):
    producto.nombre = request.form['nombre_producto']
    producto.id_categoria = request.form['categoria']
    producto.precio = request.form['precio']

    inventariable = request.form.get('inventariable') == 'on'
    producto.inventariable = inventariable

    if inventariable:
        producto.existencia = request.form['existencia']
    else:
        producto.existencia = request.form['disponible']

    db.session.commit()


@productos_bp.route("/productos/eliminar_producto/<id_producto>")
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
