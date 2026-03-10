// MATRIX BACKGROUND

const matrix = document.getElementById("matrix")
const ctx = matrix.getContext("2d")

matrix.height = window.innerHeight
matrix.width = window.innerWidth

let letters="01"
letters=letters.split("")

let font=14
let columns=matrix.width/font
let drops=[]

for(let x=0;x<columns;x++) drops[x]=1

function drawMatrix(){

ctx.fillStyle="rgba(0,0,0,0.05)"
ctx.fillRect(0,0,matrix.width,matrix.height)

ctx.fillStyle="#0f0"
ctx.font=font+"px monospace"

for(let i=0;i<drops.length;i++){

let text=letters[Math.floor(Math.random()*letters.length)]

ctx.fillText(text,i*font,drops[i]*font)

if(drops[i]*font>matrix.height && Math.random()>0.975)
drops[i]=0

drops[i]++

}

}

setInterval(drawMatrix,33)



// DRAG DROP

const dropArea=document.getElementById("dropArea")
const input=document.getElementById("imageInput")

dropArea.addEventListener("click",()=>input.click())

dropArea.addEventListener("dragover",e=>e.preventDefault())

dropArea.addEventListener("drop",e=>{
e.preventDefault()
input.files=e.dataTransfer.files
})



// PROGRESS

function progress(){

let bar=document.getElementById("progressBar")
let width=0

let interval=setInterval(()=>{

if(width>=100){
clearInterval(interval)
}else{
width++
bar.style.width=width+"%"
}

},10)

}



// ENCRYPT

function encrypt(){

progress()

let file=input.files[0]
let message=document.getElementById("message").value
let password=document.getElementById("password").value

let final=password+"|"+message

let reader=new FileReader()

reader.onload=function(e){

let img=new Image()
img.src=e.target.result

img.onload=function(){
    document.getElementById("originalPreview").src = img.src

let canvas=document.getElementById("canvas")
let ctx=canvas.getContext("2d")

canvas.width=img.width
canvas.height=img.height

ctx.drawImage(img,0,0)

let imageData=ctx.getImageData(0,0,canvas.width,canvas.height)
let data=imageData.data

let binary=""

for(let i=0;i<final.length;i++)
binary+=final.charCodeAt(i).toString(2).padStart(8,"0")

binary+="1111111111111110"

for(let i=0;i<binary.length;i++)
data[i*4]=(data[i*4]&254)|binary[i]

ctx.putImageData(imageData,0,0)

let result=canvas.toDataURL()

document.getElementById("preview").src=result

let a=document.createElement("a")
a.href=result
a.download="encrypted.png"
a.click()

}

}

reader.readAsDataURL(file)

}



// DECRYPT

function decrypt(){

let file=input.files[0]

let reader=new FileReader()

reader.onload=function(e){

let img=new Image()
img.src=e.target.result

img.onload=function(){

let canvas=document.getElementById("canvas")
let ctx=canvas.getContext("2d")

canvas.width=img.width
canvas.height=img.height

ctx.drawImage(img,0,0)

let data=ctx.getImageData(0,0,canvas.width,canvas.height).data

let binary=""

for(let i=0;i<data.length;i+=4)
binary+=(data[i]&1)

let chars=[]

for(let i=0;i<binary.length;i+=8){

let byte=binary.substr(i,8)

if(byte=="11111110") break

chars.push(String.fromCharCode(parseInt(byte,2)))

}

let decoded=chars.join("")
let parts=decoded.split("|")

let saved=parts[0]
let hidden=parts[1]

let entered=prompt("Enter password")

if(entered===saved){
document.getElementById("decodedText").innerText=hidden
}else{
alert("Wrong password")
}

}

}

reader.readAsDataURL(file)

}



// DOWNLOAD IMAGE //

function downloadImage(){

let img = document.getElementById("preview")

if(!img.src){
alert("No image available to download")
return
}

let a = document.createElement("a")
a.href = img.src
a.download = "encrypted-image.png"
a.click()

}

// ANALYZER //

function analyzePixels(){

let original = document.getElementById("originalPreview")
let encrypted = document.getElementById("preview")

if(!original.src || !encrypted.src){
document.getElementById("analysisResult").innerText =
"Upload and encrypt an image first."
return
}

let canvas = document.createElement("canvas")
let ctx = canvas.getContext("2d")

let img1 = new Image()
let img2 = new Image()

img1.src = original.src
img2.src = encrypted.src

img1.onload = function(){

canvas.width = img1.width
canvas.height = img1.height

ctx.drawImage(img1,0,0)
let data1 = ctx.getImageData(0,0,canvas.width,canvas.height).data

ctx.drawImage(img2,0,0)
let data2 = ctx.getImageData(0,0,canvas.width,canvas.height).data

let diff = 0

for(let i=0;i<data1.length;i++){
if(data1[i] !== data2[i]){
diff++
}
}

document.getElementById("analysisResult").innerText =
"Modified Pixels: " + diff

}

}
