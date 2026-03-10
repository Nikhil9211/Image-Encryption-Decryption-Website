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



// DRAG DROP //

const dropArea=document.getElementById("dropArea")
const input=document.getElementById("imageInput")

// CAPACITY CODE //

input.addEventListener("change", calculateCapacity)
document.getElementById("message").addEventListener("input", calculateCapacity)

function calculateCapacity(){

let file = input.files[0]

if(!file) return

let reader = new FileReader()

reader.onload = function(e){

let img = new Image()
img.src = e.target.result

img.onload = function(){

let maxBytes = (img.width * img.height)

let messageLength = document.getElementById("message").value.length

let remaining = maxBytes - messageLength

document.getElementById("capacityInfo").innerText =
"Capacity: " + maxBytes + " characters | Used: " + messageLength + " | Remaining: " + remaining

}

}

reader.readAsDataURL(file)

}

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

let encryptedMessage = CryptoJS.AES.encrypt(message, password).toString()

let final = password + "|" + encryptedMessage

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

let maxBytes = data.length / 4

if(binary.length > maxBytes){
alert("Message too large for this image.")
return
}

// WRITE DATA INTO PIXELS //

let pixelIndex = 0

for(let i = 0; i < binary.length; i++){

if(pixelIndex >= data.length){
alert("Image capacity exceeded!")
return
}

let bit = binary[i]

data[pixelIndex] = (data[pixelIndex] & 254) | parseInt(bit)

pixelIndex += 4

}

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



// DECRYPT //

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

for(let i = 0; i < data.length; i += 4){

binary += (data[i] & 1)

}

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
let decrypted = CryptoJS.AES.decrypt(hidden, entered)

let finalMessage = decrypted.toString(CryptoJS.enc.Utf8)

document.getElementById("decodedText").innerText = finalMessage
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

function runHackSimulation(){

let consoleBox = document.getElementById("console")

let logs = [
"> Connecting to encryption module...",
"> Initializing pixel encoder...",
"> Converting message to binary...",
"> Injecting binary into pixel data...",
"> Running steganography algorithm...",
"> Encrypting image layers...",
"> Verifying hidden payload...",
"> Encryption complete."
]

let i = 0

let interval = setInterval(()=>{

if(i >= logs.length){
clearInterval(interval)
return
}

let p = document.createElement("p")
p.textContent = logs[i]

consoleBox.appendChild(p)

consoleBox.scrollTop = consoleBox.scrollHeight

i++

},800)

}

// HEATMAP //

function generateHeatmap(){

let originalSrc = document.getElementById("originalPreview").src
let encryptedSrc = document.getElementById("preview").src

if(!originalSrc || !encryptedSrc){
alert("Encrypt an image first.")
return
}

let canvas = document.getElementById("heatmapCanvas")
let ctx = canvas.getContext("2d")

let img1 = new Image()
let img2 = new Image()

img1.src = originalSrc
img2.src = encryptedSrc

img1.onload = function(){

img2.onload = function(){

canvas.width = img1.width
canvas.height = img1.height

let tempCanvas = document.createElement("canvas")
let tempCtx = tempCanvas.getContext("2d")

tempCanvas.width = img1.width
tempCanvas.height = img1.height

tempCtx.drawImage(img1,0,0)
let data1 = tempCtx.getImageData(0,0,img1.width,img1.height).data

tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height)

tempCtx.drawImage(img2,0,0)
let data2 = tempCtx.getImageData(0,0,img2.width,img2.height).data

let heatmap = ctx.createImageData(canvas.width,canvas.height)

for(let i=0;i<data1.length;i+=4){

let diff =
Math.abs(data1[i]-data2[i]) +
Math.abs(data1[i+1]-data2[i+1]) +
Math.abs(data1[i+2]-data2[i+2])

heatmap.data[i] = diff
heatmap.data[i+1] = 0
heatmap.data[i+2] = 0
heatmap.data[i+3] = 255

}

ctx.putImageData(heatmap,0,0)

}

}

}

