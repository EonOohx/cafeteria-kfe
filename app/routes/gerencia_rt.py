from datetime import datetime, timedelta

import sqlalchemy.exc
from flask import Blueprint, render_template, request, jsonify
from sqlalchemy import func

from app.models.producto import Productos
from app.models.registro_ventas import DetallesVentas
from app.models.ventas import Ventas
from app.utils.db import db

gerencia_bp = Blueprint("gerencia", __name__)


@gerencia_bp.route("/reportes", methods=["GET"])
def gerencia():
    return render_template("gerencia.html")


@gerencia_bp.route("/reportes/populares", methods=["GET"])
def productos_populares():
    resultados = (
        db.session.query(
            DetallesVentas.id_producto,
            func.SUM(DetallesVentas.cantidad).label("cantidad"),
            Productos.nombre
        )
        .join(Productos, DetallesVentas.id_producto == Productos.id_producto)
        .group_by(DetallesVentas.id_producto, Productos.nombre)
        .order_by(func.SUM(DetallesVentas.cantidad).desc())
        .limit(3)
        .all()
    )
    return jsonify([registros_productos_to_dict(d) for d in resultados]), 200


@gerencia_bp.route("/reportes/fechas", methods=["GET"])
def productos_fechas():
    fecha_inicio = request.args.get("inicio")
    fecha_final = request.args.get("final")
    try:
        if fecha_inicio and fecha_final:
            return obtener_productos_fecha(fecha_inicio, fecha_final)
        else:
            return jsonify({"error": "No se proporcionaron las fechas para la busqueda"}), 400
    except sqlalchemy.exc.ProgrammingError as _:
        return jsonify({"error": "Ocurrio un error al consultar los registros de productos por fecha"}), 400


@gerencia_bp.route("/reportes/ventas", methods=["GET"])
def productos_ventas():
    resultado = (db.session.query(
        func.COUNT(DetallesVentas.id_producto).label("ventas"),
        Productos.nombre)
                 .join(Productos, DetallesVentas.id_producto == Productos.id_producto)
                 .group_by(Productos.nombre)
                 .order_by(Productos.nombre.desc()))
    return jsonify([registros_ventas_to_dict(d) for d in resultado]), 200


def registros_ventas_to_dict(resultado):
    return {"producto": resultado.nombre, "ventas": resultado.ventas}


def obtener_productos_fecha(inicio, final):
    fecha_inicio = datetime.strptime(inicio, "%Y-%m-%d")
    fecha_fin = datetime.strptime(final, "%Y-%m-%d") + timedelta(days=1)
    if fecha_inicio < fecha_fin:
        resultados = (
            db.session.query(
                DetallesVentas.id_producto,
                func.SUM(DetallesVentas.cantidad).label("cantidad"),
                Productos.nombre
            )
            .join(Productos, DetallesVentas.id_producto == Productos.id_producto)
            .join(Ventas, DetallesVentas.id_venta == Ventas.id_venta)
            .where(Ventas.fecha.between(fecha_inicio, fecha_fin))
            .group_by(DetallesVentas.id_producto, Productos.nombre)
            .order_by(func.SUM(DetallesVentas.cantidad).desc())
            .all()
        )
        return jsonify([registros_productos_to_dict(d) for d in resultados]), 200
    return jsonify({"error":"La fecha final debe ser superior a la inicial"}), 400


def registros_productos_to_dict(resultado):
    return {"id": resultado.id_producto, "nombre": resultado.nombre, "cantidad": resultado.cantidad}
