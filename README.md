# EDITH

TRADING BOT

http://edith-project.herokuapp.com/edith

{ 
    "symbol":"ETHUSDT", 
    "quantity":0.005, 
    "side": "buy", 
    "message": "BUY THEM ALL" 
}


webhook
https://edith.herokuapp.com/edith
{
	"symbol": "ETHUSDT",
	"quantity": "{{strategy.order.contracts}}",
	"side": "{{strategy.order.action}}"
}
