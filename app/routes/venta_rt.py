from datetime import datetime
from zoneinfo import ZoneInfo

from flask import Blueprint, render_template, request, jsonify

from app.models.categoria import Categorias
from app.models.producto import Productos
from app.models.registro_ventas import DetallesVentas
from app.models.ventas import Ventas

from app.utils.db import db

venta_bp = Blueprint('ventas', __name__)


@venta_bp.route("/")
@venta_bp.route('/ventas', methods=['GET', 'POST'])
def ventas():
    if request.method == 'POST':
        response = request.get_json()
        fecha = datetime.fromisoformat(response['fecha'].replace('Z', '+00:00')).astimezone(
            ZoneInfo("America/Mexico_City"))
        venta = Ventas(monto_total=response['monto_total'], fecha=fecha, cliente=response['cliente'],
                       empleado=response['empleado'])
        db.session.add(venta)
        db.session.commit()
        return jsonify({'mensaje': 'Registro de ventas recibido correctamente', 'id_venta': venta.id_venta}), 200
    categorias = Categorias.query.all()
    return render_template("/ventas.html", categorias=categorias)


@venta_bp.route('/ventas/detalles', methods=['POST'])
def registro_ventas():
    response = request.get_json()
    id_producto = response['id_producto']
    cantidad = response['cantidad']
    detalles_venta = DetallesVentas(id_venta=response['id_venta'], id_producto=id_producto,
                                    cantidad=cantidad, precio_unitario=response['precio_unitario'])
    db.session.add(detalles_venta)

    producto = Productos.query.get(id_producto)
    if producto.inventariable: producto.existencia -= float(cantidad)

    db.session.commit()
    return jsonify({'mensaje': 'Detalles de ventas recibidos correctamente'}), 200
