from app.utils.db import db


class Categorias(db.Model):
    id_categoria = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    productos = db.relationship('Productos', backref='categoria', lazy=True)

    def __init__(self, nombre):
        self.nombre = nombre
