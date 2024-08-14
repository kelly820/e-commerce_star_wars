import flask
from flask import Flask, render_template
from mercado_pago import gerar_link_pagamento

app = Flask(__name__)
#leva para a page principal
@app.route("/")
def homepage():
    link_iniciar_pagamento = gerar_link_pagamento()
    return render_template("index.html", link_pagamento = link_iniciar_pagamento)
#leva para a page ápos a compra

@app.route("/main_certo.html")
def compracerta ():
    return render_template("main_certo.html")

#leva para á page se compra der errado

@app.route("/ecommerce.html")
def compra_errada ():
    return render_template("ecommerce.html")

if __name__ == '__main__':
    app.run(debug=True)