function encrypt(){

let file = document.getElementById("imageInput").files[0];
let message = document.getElementById("message").value;

let reader = new FileReader();

reader.onload = function(e){

let img = new Image();
img.src = e.target.result;

img.onload = function(){

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img,0,0);

let imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
let data = imageData.data;

let binaryMessage = "";

for(let i=0;i<message.length;i++){
binaryMessage += message.charCodeAt(i).toString(2).padStart(8,"0");
}

binaryMessage += "1111111111111110";

for(let i=0;i<binaryMessage.length;i++){
data[i*4] = (data[i*4] & 254) | binaryMessage[i];
}

ctx.putImageData(imageData,0,0);

let encryptedImage = canvas.toDataURL();

document.getElementById("preview").src = encryptedImage;

let a = document.createElement("a");
a.href = encryptedImage;
a.download = "encrypted.png";
a.click();

};

};

reader.readAsDataURL(file);

}


function decrypt(){

let file = document.getElementById("imageInput").files[0];
let reader = new FileReader();

reader.onload = function(e){

let img = new Image();
img.src = e.target.result;

img.onload = function(){

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = img.width;
canvas.height = img.height;

ctx.drawImage(img,0,0);

let data = ctx.getImageData(0,0,canvas.width,canvas.height).data;

let binary = "";

for(let i=0;i<data.length;i+=4){
binary += (data[i] & 1);
}

let chars = [];

for(let i=0;i<binary.length;i+=8){

let byte = binary.substr(i,8);

if(byte=="11111110") break;

chars.push(String.fromCharCode(parseInt(byte,2)));
}

let message = chars.join("");

alert("Hidden Message: " + message);

};

};

reader.readAsDataURL(file);

}