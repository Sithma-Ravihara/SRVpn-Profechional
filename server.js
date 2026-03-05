const express = require("express")
const fs = require("fs")

const app = express()

app.use(express.static("public"))
app.use(express.json())

app.get("/api/codes",(req,res)=>{

let data = fs.readFileSync("codes.json")

res.json(JSON.parse(data))

})

app.post("/api/update",(req,res)=>{

fs.writeFileSync("codes.json",JSON.stringify(req.body,null,2))

res.send("updated")

})

app.listen(3000,()=>{
console.log("SRVpn Server Running")
})


let onlineUsers = 0;

app.get("/api/users", (req,res)=>{
  res.json({users: onlineUsers});
});

app.use((req,res,next)=>{
  onlineUsers++;
  res.on("finish", ()=>{ onlineUsers--; });
  next();
});