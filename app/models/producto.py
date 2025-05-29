from app.utils.db import db


class Productos(db.Model):
    id_producto = db.Column(db.Integer, primary_key=True)
    id_categoria = db.Column(db.Integer, db.ForeignKey('categorias.id_categoria'), nullable=False)
    nombre = db.Column(db.String(250), nullable=False)
    precio = db.Column(db.Numeric(5, 2), nullable=False)
    inventariable = db.Column(db.Boolean, default=False)
    existencia = db.Column(db.Integer, default=0)

    def __init__(self, id_categoria, nombre, precio, inventariable, existencia):
        self.id_categoria = id_categoria
        self.nombre = nombre
        self.precio = precio
        self.inventariado = inventariable
        self.existencia = existencia
