from flask import Blueprint, render_template

from app.models.categoria import Categorias

venta_bp = Blueprint('ventas', __name__)


@venta_bp.route('/ventas')
def ventas():
    categorias = Categorias.query.all()
    return render_template("/ventas.html", categorias=categorias)
