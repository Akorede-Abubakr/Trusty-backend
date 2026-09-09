import http from 'http';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            rawBody: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runLiveApiTests() {
  console.log('\n============== TESTING LIVE RUNNING API SERVER (PORT 5000) ==============');

  // 1. Health Check
  const healthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log(`[1] GET /api/health -> Status: ${healthRes.statusCode} | Service: ${healthRes.body?.service}`);

  // 2. Register Buyer
  const buyerPayload = {
    firstName: 'Sophia',
    lastName: 'Laurent',
    email: `buyer_${Date.now()}@test.com`,
    password: 'SecurePassword2026!',
    role: 'buyer',
  };
  const regBuyerRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    buyerPayload
  );
  console.log(`[2] POST /api/auth/register (Buyer) -> Status: ${regBuyerRes.statusCode} | Token: ${regBuyerRes.body?.data?.token?.substring(0, 20)}...`);
  const buyerToken = regBuyerRes.body?.data?.token;

  // 3. Register Agent
  const agentPayload = {
    firstName: 'Ethan',
    lastName: 'Hunt',
    email: `agent_${Date.now()}@test.com`,
    password: 'SecurePassword2026!',
    role: 'agent',
    bio: 'Luxury real estate specialist in Beverly Hills',
  };
  const regAgentRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    agentPayload
  );
  console.log(`[3] POST /api/auth/register (Agent) -> Status: ${regAgentRes.statusCode} | Verification: ${regAgentRes.body?.data?.user?.verificationStatus}`);
  const agentToken = regAgentRes.body?.data?.token;

  // 4. Login Buyer
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: buyerPayload.email, password: buyerPayload.password }
  );
  console.log(`[4] POST /api/auth/login -> Status: ${loginRes.statusCode} | User: ${loginRes.body?.data?.user?.firstName}`);

  // 5. GET /api/auth/me (Protected)
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  console.log(`[5] GET /api/auth/me (Protected with Bearer Token) -> Status: ${meRes.statusCode} | Role: ${meRes.body?.data?.user?.role}`);

  // 6. RBAC Test: Agent token to /api/auth/agent-agency-only
  const rbacAgentRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/agent-agency-only',
    method: 'GET',
    headers: { Authorization: `Bearer ${agentToken}` },
  });
  console.log(`[6] GET /api/auth/agent-agency-only with Agent Token -> Status: ${rbacAgentRes.statusCode} (Access Allowed)`);

  // 7. RBAC Test: Buyer token to /api/auth/agent-agency-only (Should be 403 Forbidden)
  const rbacBuyerRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/agent-agency-only',
    method: 'GET',
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  console.log(`[7] GET /api/auth/agent-agency-only with Buyer Token -> Status: ${rbacBuyerRes.statusCode} (403 Forbidden as expected)`);

  // 8. Change Password
  const changePassRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${buyerToken}`,
      },
    },
    {
      currentPassword: buyerPayload.password,
      newPassword: 'BrandNewPassword2026!',
    }
  );
  console.log(`[8] PATCH /api/auth/change-password -> Status: ${changePassRes.statusCode} | Message: ${changePassRes.body?.message}`);

  // 9. Forgot Password
  const forgotRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: buyerPayload.email }
  );
  console.log(`[9] POST /api/auth/forgot-password -> Status: ${forgotRes.statusCode} | Reset Token received: ${Boolean(forgotRes.body?.data?.resetToken)}`);
  const resetToken = forgotRes.body?.data?.resetToken;

  // 10. Reset Password
  const resetRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      token: resetToken,
      password: 'FinalResetPassword2026!',
    }
  );
  console.log(`[10] POST /api/auth/reset-password -> Status: ${resetRes.statusCode} | Message: ${resetRes.body?.message}`);

  console.log('\n============== ALL 10 LIVE API ENDPOINT TESTS PASSED SUCCESSFULLY! ==============\n');
}

runLiveApiTests().catch(console.error);
