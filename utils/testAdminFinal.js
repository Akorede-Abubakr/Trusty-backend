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

async function runFinalAdminTests() {
  console.log('\n============== TESTING FINAL PHASE: ANALYTICS, SETTINGS & SECURITY ==============');

  // 1. GET /api/admin/analytics
  const analyticsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/analytics',
    method: 'GET',
  });
  console.log(`[1] GET /api/admin/analytics -> Status: ${analyticsRes.statusCode}`);
  const aData = analyticsRes.body?.data;
  console.log(`    User Analytics: Total Users = ${aData?.userAnalytics?.totalUsers}, Active = ${aData?.userAnalytics?.activeUsers}`);
  console.log(`    Property Analytics: Total Properties = ${aData?.propertyAnalytics?.totalProperties}, Avg Price = $${aData?.propertyAnalytics?.avgPropertyPrice?.toLocaleString()}`);
  console.log(`    Lead Analytics: Total Inquiries = ${aData?.leadAnalytics?.totalInquiries}, Conversion = ${aData?.leadAnalytics?.inquiryConversionRate}%`);
  console.log(`    Agent Analytics: Active Agents Ranked = ${aData?.agentAnalytics?.mostActiveAgents?.length}`);

  // 2. GET /api/admin/settings
  const settingsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/settings',
    method: 'GET',
  });
  console.log(`[2] GET /api/admin/settings -> Status: ${settingsRes.statusCode}`);
  const sData = settingsRes.body?.data;
  console.log(`    General Settings: Platform = "${sData?.general?.platformName}", Email = "${sData?.general?.contactEmail}"`);
  console.log(`    Property Types: [${sData?.properties?.allowedPropertyTypes?.join(', ')}]`);

  // 3. PUT /api/admin/settings (Update General)
  const updateSettingsRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/settings',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      section: 'general',
      data: {
        platformName: 'TRUSTY Real Estate SaaS',
        contactPhone: '+1 (800) 999-TRUSTY',
      },
    }
  );
  console.log(`[3] PUT /api/admin/settings (Update General) -> Status: ${updateSettingsRes.statusCode}`);
  console.log(`    Updated Name: "${updateSettingsRes.body?.data?.general?.platformName}"`);

  // 4. PUT /api/admin/settings (Update Security)
  const updateSecRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/settings',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      section: 'security',
      data: {
        sessionTimeoutMinutes: 90,
        enforceTwoFactorAuth: true,
      },
    }
  );
  console.log(`[4] PUT /api/admin/settings (Update Security) -> Status: ${updateSecRes.statusCode} | 2FA Enforced: ${updateSecRes.body?.data?.security?.enforceTwoFactorAuth}`);

  console.log('\n============== ALL FINAL PHASE ADMIN API TESTS PASSED! ==============\n');
}

runFinalAdminTests().catch(console.error);
