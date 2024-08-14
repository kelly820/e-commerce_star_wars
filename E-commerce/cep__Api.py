from flask import Flask, jsonify
import requests

app = Flask(__name__)

def is_valid_cep(cep):
    # Remove todos os caracteres não numéricos
    cep = ''.join(filter(str.isdigit, cep))
    return len(cep) == 8

@app.route('/cep/<cep>', methods=['GET'])
def get_address_by_cep(cep):
    cep = cep.strip().replace("-", "")
    
    if not is_valid_cep(cep):
        return jsonify({'error': 'CEP inválido'}), 400

    try:
        url = f'https://viacep.com.br/ws/{cep}/json/'
        response = requests.get(url)
        data = response.json()

        if 'erro' in data:
            return jsonify({'error': 'CEP não encontrado'}), 404
        
        address = {
            'logradouro': data.get('logradouro', ''),
            'localidade': data.get('localidade', ''),
            'bairro': data.get('bairro', ''),
            'uf': data.get('uf', ''),
            'cep': data.get('cep', '')
        }
        
        return jsonify(address)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
