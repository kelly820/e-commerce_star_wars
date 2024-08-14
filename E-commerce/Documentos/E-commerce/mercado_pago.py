import mercadopago
import main_mercado
sdk = mercadopago.SDK("TEST-6839780388701831-080123-7848a661e337decf0c79eb4834677977-1431802941") 

payment_data = {
    "items":[
        {"id":"1", "title":"Camiseta Voyager","quantity":1,"currency_id":"BRL", "unit_price":105.00},
        {"id":"2", "title":"Camiseta Star Wars","quantity":1,"currency_id":"BRL", "unit_price":155.50},
        {"id":"3", "title":"Camiseta moon","quantity":1,"currency_id":"BRL", "unit_price":199.99},
        {"id":"4", "title":"Moletom Star Wars","quantity":1,"currency_id":"BRL", "unit_price":222.99},
        {"id":"5", "title":"Moletom Eren Yager","quantity":1,"currency_id":"BRL", "unit_price":299.23},
        
        
        ]
    
}


result = sdk.preference().create(payment_data)
payment = result["response"]
print(payment)

    

