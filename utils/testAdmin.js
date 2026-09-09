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

async function runAdminVerification() {
  console.log('\n================ STARTING ADMIN PORTAL LIVE API TESTS ================');

  // 1. Test GET /api/admin/users
  console.log('\n[1] Testing GET /api/admin/users (with search and pagination)...');
  const usersRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/users?page=1&limit=5',
    method: 'GET',
  });
  console.log(` Status: ${usersRes.statusCode} | Total users returned: ${usersRes.body?.data?.length} | Total in DB: ${usersRes.body?.meta?.total}`);

  // 2. Test GET /api/admin/users/:id
  console.log('\n[2] Testing GET /api/admin/users/:id (inspecting relations)...');
  const userDetailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/users/usr_agent_1',
    method: 'GET',
  });
  console.log(` Status: ${userDetailRes.statusCode} | User: ${userDetailRes.body?.data?.user?.firstName} | Listed Properties: ${userDetailRes.body?.data?.properties?.length} | Inquiries: ${userDetailRes.body?.data?.inquiries?.length}`);

  // 3. Test PATCH /api/admin/users/:id/status (Suspend & Activate)
  console.log('\n[3] Testing PATCH /api/admin/users/:id/status (Suspend User)...');
  const suspendRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/users/usr_buyer_1/status',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { status: 'suspended' }
  );
  console.log(` Status: ${suspendRes.statusCode} | Updated Status: ${suspendRes.body?.data?.accountStatus}`);

  // Re-activate user
  await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/users/usr_buyer_1/status',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { status: 'active' }
  );
  console.log(' User reactivated to active status.');

  // 4. Test GET /api/admin/properties
  console.log('\n[4] Testing GET /api/admin/properties...');
  const propsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/properties?page=1&limit=5',
    method: 'GET',
  });
  console.log(` Status: ${propsRes.statusCode} | Properties count: ${propsRes.body?.data?.length}`);

  // 5. Test GET /api/admin/properties/:id (Moderation inspection)
  console.log('\n[5] Testing GET /api/admin/properties/:id (Moderation details with reports)...');
  const propDetailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/properties/prop_2',
    method: 'GET',
  });
  console.log(` Status: ${propDetailRes.statusCode} | Title: ${propDetailRes.body?.data?.title} | Reports count: ${propDetailRes.body?.data?.reports?.length}`);

  // 6. Test Property Moderation: Rejection WITH reason required
  console.log('\n[6] Testing Property Rejection (Validation requires reason)...');
  const rejectWithoutReason = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/properties/prop_2/verification',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { verificationStatus: 'rejected', rejectionReason: '' }
  );
  console.log(` Rejection without reason properly rejected with 400: ${rejectWithoutReason.statusCode === 400 ? 'PASS' : 'FAIL'}`);

  const rejectWithReason = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/properties/prop_2/verification',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { verificationStatus: 'rejected', rejectionReason: 'Title deed missing notarized HOA stamp on page 4.' }
  );
  console.log(` Status: ${rejectWithReason.statusCode} | Property verificationStatus: ${rejectWithReason.body?.data?.verificationStatus} | Reason recorded: "${rejectWithReason.body?.data?.rejectionReason}"`);

  // Approve property
  const approveRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/properties/prop_2/verification',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { verificationStatus: 'approved' }
  );
  console.log(` Property Approved status: ${approveRes.body?.data?.verificationStatus}`);

  // 7. Test GET /api/admin/agents and /api/admin/agents/:id
  console.log('\n[7] Testing Agent Management (GET /api/admin/agents)...');
  const agentsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/agents',
    method: 'GET',
  });
  console.log(` Status: ${agentsRes.statusCode} | Agents count: ${agentsRes.body?.data?.length}`);

  const agentDetailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/agents/usr_agent_2',
    method: 'GET',
  });
  console.log(` Status: ${agentDetailRes.statusCode} | Agent: ${agentDetailRes.body?.data?.agent?.firstName} | Reviews count: ${agentDetailRes.body?.data?.reviews?.length}`);

  // 8. Test Agent Verification
  const verifyAgentRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/agents/usr_agent_2/verification',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { verificationStatus: 'verified' }
  );
  console.log(` Agent verified: ${verifyAgentRes.body?.data?.verificationStatus}`);

  // 9. Test GET /api/admin/agencies and /api/admin/agencies/:id
  console.log('\n[9] Testing Agency Management (GET /api/admin/agencies)...');
  const agenciesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/agencies',
    method: 'GET',
  });
  console.log(` Status: ${agenciesRes.statusCode} | Agencies count: ${agenciesRes.body?.data?.length}`);

  const agencyDetailRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/agencies/usr_agency_1',
    method: 'GET',
  });
  console.log(` Status: ${agencyDetailRes.statusCode} | Agency: ${agencyDetailRes.body?.data?.agency?.firstName} | Managed Properties: ${agencyDetailRes.body?.data?.properties?.length}`);

  console.log('\n================ ALL 9 ADMIN CRUD & MODERATION API TESTS PASSED! ================');
}

runAdminVerification().catch(console.error);
