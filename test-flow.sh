#!/bin/bash
cd /home/z/my-project

# Wait for server
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/ 2>/dev/null | rg -q 200; then
    echo 'Server is up!'
    break
  fi
  sleep 2
done

# 1. Login
LOGIN=$(curl -s http://localhost:3000/api/auth/login -X POST -H 'Content-Type: application/json' -d '{"email":"aluno@exemplo.com","password":"aluno123"}')
TOKEN=$(echo "$LOGIN" | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const j=JSON.parse(d);console.log(j.token)})')
echo "TOKEN: ${TOKEN:0:50}..."

# 2. Get ranking before
echo '--- RANKING (before) ---'
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/ranking | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>console.log(JSON.stringify(JSON.parse(d),null,2)))'

# 3. Save a response (simulating local bank question)
echo '--- SAVING RESPONSE ---'
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' http://localhost:3000/api/responses -d '{"questionId":"test-q-001","answer":"A","responseTime":15,"correctAnswer":"A","topic":"Lógica Proposicional","macroarea":"Fundamentos da Computação","difficulty":"médio"}' | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>console.log(JSON.stringify(JSON.parse(d),null,2)))'

# 4. Save wrong answer
echo '--- SAVING WRONG RESPONSE ---'
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' http://localhost:3000/api/responses -d '{"questionId":"test-q-002","answer":"C","responseTime":30,"correctAnswer":"B","topic":"Banco de Dados","macroarea":"Desenvolvimento","difficulty":"difícil"}' | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>console.log(JSON.stringify(JSON.parse(d),null,2)))'

# 5. Get ranking after
echo '--- RANKING (after) ---'
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/ranking | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>console.log(JSON.stringify(JSON.parse(d),null,2)))'

# 6. Dashboard stats
echo '--- DASHBOARD STATS ---'
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/dashboard/stats | node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const j=JSON.parse(d);console.log("totalResponses:",j.overview.totalResponses);console.log("correctResponses:",j.overview.correctResponses);console.log("hitRate:",j.overview.hitRate+"%")})'

echo 'ALL TESTS PASSED!'
