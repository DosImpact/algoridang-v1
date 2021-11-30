const express = require("express");
const path = require("path")
const app = express();

// ✅ 스태틱 파일 요청
app.use(express.static(path.join(__dirname,"react_client/build")))

// ✅ 루트 경로아닌 요청도, 경로를 유지하며 index.html로 주도록 설정 
app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname,"react_client/build","index.html"))
});
app.listen(process.env.PORT || 3000);
console.log("✔ Server is starting...")
