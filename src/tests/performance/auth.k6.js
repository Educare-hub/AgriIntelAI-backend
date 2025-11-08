import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 100 },   
    { duration: "20s", target: 500 },   
    { duration: "30s", target: 1000 },  
    { duration: "40s", target: 0 },     
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],       
    http_req_duration: ["p(95)<800"],     
    checks: ["rate>0.99"],                
  },
};


function generatePhone() {
  return `2547${Math.floor(1000000 + Math.random() * 9000000)}`;
}


function postWithRetry(url, payload, params, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = http.post(url, payload, params);
    if (res.status === 201) return res;
    sleep(0.3); 
  }
  return http.post(url, payload, params);
}

export default function () {
  const payload = JSON.stringify({
    fullName: `PerfUser_${Math.random().toString(36).substring(7)}`,
    phone: generatePhone(),
    password: "StrongPass123!",
  });

  const params = {
    headers: { "Content-Type": "application/json" },
  };

  const res = postWithRetry("http://localhost:5000/api/auth/register", payload, params);

  check(res, {
    "status is 201": (r) => r.status === 201,
    "response has message": (r) =>
      r.json("message") && r.json("message").includes("success"),
  });

  sleep(0.2); 
}

export function teardown() {
  console.log("Test complete. Review DB and metrics. Clean test users if needed.");
}
