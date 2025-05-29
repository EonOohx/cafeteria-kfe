from app.utils.db import db


class RegistroVentas(db.Model):
    id_registro_ventas = db.Column(db.Integer, primary_key=True)
    id_ventas = db.Column(db.Integer, db.ForeignKey('ventas.id_ventas'))
    id_producto = db.Column(db.Integer, db.ForeignKey('producto.id_producto'))
    cantidad = db.Column(db.Integer)
    precio_unitario = db.Column(db.Numeric(5, 2))

    def __init__(self, id_ventas, id_producto, cantidad, precio_unitario):
        self.id_ventas = id_ventas
        self.id_producto = id_producto
        self.cantidad = cantidad
        self.precio_unitario = precio_unitario
