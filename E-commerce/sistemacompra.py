from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

# Remover o arquivo de banco de dados se ele existir
if os.path.exists('compras.db'):
    os.remove('compras.db')

# Criar o app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///compras.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
# cria db no sqlite3, tabelas e campos
class SistemaCompra(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    contato = db.Column(db.String(40), nullable=False)
    nome = db.Column(db.String(80), nullable=False)
    sobrenome = db.Column(db.String(40), nullable=False)
    cep = db.Column(db.String(15), nullable=False)  # Alterado para String e não unique
    endereco = db.Column(db.String(68), nullable=False)
    cidade = db.Column(db.String(45), nullable=False)
    cartao_de_credito = db.Column(db.String(65), nullable=False)
    num_cartao = db.Column(db.String(40), nullable=False)
    data_vencimento = db.Column(db.String(10), nullable=False)
    cod_seguranca = db.Column(db.String(3), nullable=False)
    nome_cartao = db.Column(db.String(75), nullable=False)

def create_tables():
    db.create_all()

# Inserir dados do usuário
@app.route('/register/user', methods=["POST"])
def armazenar_dados():
    data = request.get_json()  
    if not data:
        return jsonify({"message": "Nenhum dado fornecido"}), 400
    novo_usuario = SistemaCompra(
        contato=data.get('contato'),
        nome=data.get('nome'),
        sobrenome=data.get('sobrenome'),
        cep=data.get('cep'),
        endereco=data.get('endereco'),
        cidade=data.get('cidade'),
        cartao_de_credito = data.get('cartao_de_credito'),
        num_cartao= data.get('num_cartao'),
        data_vencimento = data.get('data_vencimento'),
        cod_seguranca = data.get('cod_seguranca'),
        nome_cartao = data.get('nome_cartao')
        
    )
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário registrado com sucesso!"}), 201

# Criar bd
with app.app_context():
    create_tables()

if __name__ == '__main__':
    app.run(debug=True)
