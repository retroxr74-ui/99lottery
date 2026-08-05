let coins = 100;
let prediction = "";
let timer = 10;

const colors = ["Red","Green","Violet"];

function predict(color){
    prediction = color;
    document.getElementById("prediction").innerText = color;
}

setInterval(function(){

    timer--;
    document.getElementById("countdown").innerText = timer;

    if(timer===0){

        let result = colors[Math.floor(Math.random()*colors.length)];

        document.getElementById("result").innerText = result;

        if(prediction!=""){

            if(prediction===result){
                coins += 100;
            }else{
                coins -= 50;
            }

            document.getElementById("coins").innerText = coins;

            let li = document.createElement("li");
            li.innerText =
            "Prediction: "+prediction+
            " | Result: "+result+
            " | Coins: "+coins;

            document.getElementById("history").prepend(li);
        }

        prediction="";
        document.getElementById("prediction").innerText="None";

        timer=10;
    }

},1000);
