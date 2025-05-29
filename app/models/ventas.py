from app.utils.db import db


class Ventas(db.Model):
    id_venta = db.Column(db.Integer, primary_key=True)
    monto_totla = db.Column(db.Numeric(10, 2))
    fecha = db.Column(db.DateTime)
    cliente = db.Column(db.String(100))
    empleado = db.Column(db.String(100))

    def __init__(self, monto_totla, fecha, cliente, empleado):
        self.monto_totla = monto_totla
        self.fecha = fecha
        self.cliente = cliente
        self.empleado = empleado
