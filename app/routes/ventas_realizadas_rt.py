from datetime import timedelta, datetime

import sqlalchemy.exc
from flask import Blueprint, render_template, request, jsonify
from sqlalchemy.orm import joinedload

from app.models.producto import Productos
from app.models.registro_ventas import DetallesVentas
from app.models.ventas import Ventas

ventas_realizadas_bp = Blueprint('ventas_realizadas', __name__)


@ventas_realizadas_bp.route('/ventas_realizadas', methods=['GET'])
def ventas_realizadas():
    fecha = request.args.get('fecha')
    if fecha:
        fecha = datetime.strptime(fecha, "%Y-%m-%d")
        fecha_siguiente = fecha + timedelta(days=1)
        try:
            ventas = Ventas.query.where(Ventas.fecha.between(fecha, fecha_siguiente)).all()
            return jsonify([v.to_dict() for v in ventas]), 200
        except sqlalchemy.exc.ProgrammingError as _:
            return jsonify({'error': "La tabla ventas no existe"}), 500
    return render_template("/ventas_realizadas.html")


@ventas_realizadas_bp.route('/ventas_realizadas/detalles', methods=['GET'])
def ventas_detalles():
    id_venta = request.args.get('id')
    if id_venta:
        detalles = DetallesVentas.query.filter_by(id_venta=id_venta).join(Productos,
                                                                          DetallesVentas.id_producto == Productos.id_producto).all()
        return jsonify([d.to_dict() for d in detalles]), 200
    return jsonify({'error': "No se especificó la venta"}), 400
