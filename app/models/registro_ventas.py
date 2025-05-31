from sqlalchemy.orm import relationship

from app.utils.db import db


class DetallesVentas(db.Model):
    id_registro_ventas = db.Column(db.Integer, primary_key=True)
    id_venta = db.Column(db.Integer, db.ForeignKey('ventas.id_venta'))
    id_producto = db.Column(db.Integer, db.ForeignKey('productos.id_producto'))
    cantidad = db.Column(db.Integer)
    precio_unitario = db.Column(db.Numeric(5, 2))
    producto = relationship('Productos', backref='ventas', lazy=True)

    def __init__(self, id_venta, id_producto, cantidad, precio_unitario):
        self.id_venta = id_venta
        self.id_producto = id_producto
        self.cantidad = cantidad
        self.precio_unitario = precio_unitario

    def to_dict(self):
        return {
            'id_producto': self.id_producto,
            'nombre': self.producto.nombre,
            'cantidad': self.cantidad,
            'precio_unitario': self.precio_unitario,
        }
