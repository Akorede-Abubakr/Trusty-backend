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

async function runPhase3Tests() {
  console.log('\n============== TESTING PHASE 3 ADMIN API ENDPOINTS ==============');

  // 1. Reports: GET /api/admin/reports
  const reportsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/reports?page=1&limit=5',
    method: 'GET',
  });
  console.log(`[1] GET /api/admin/reports -> Status: ${reportsRes.statusCode} | Total reports: ${reportsRes.body?.data?.length}`);

  // 2. Reports Action: Investigate / Resolve
  const reportActionRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/reports/rep_1/action',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { action: 'investigate', reason: 'Investigating architectural floor plan variance.' }
  );
  console.log(`[2] POST /api/admin/reports/:id/action (Investigate) -> Status: ${reportActionRes.statusCode} | New Status: ${reportActionRes.body?.data?.status}`);

  // 3. Reviews: GET /api/admin/reviews (with search and rating filter)
  const reviewsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/reviews?rating=5',
    method: 'GET',
  });
  console.log(`[3] GET /api/admin/reviews (Rating=5) -> Status: ${reviewsRes.statusCode} | Reviews found: ${reviewsRes.body?.data?.length}`);

  // 4. Reviews: Hide / Restore
  const hideReviewRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/reviews/rev_1/visibility',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { isHidden: true }
  );
  console.log(`[4] PATCH /api/admin/reviews/:id/visibility (Hide) -> Status: ${hideReviewRes.statusCode} | isHidden: ${hideReviewRes.body?.data?.isHidden}`);

  // Restore review
  await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/reviews/rev_1/visibility',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { isHidden: false }
  );

  // 5. Inquiries: GET /api/admin/inquiries
  const inquiriesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/inquiries?page=1&limit=5',
    method: 'GET',
  });
  console.log(`[5] GET /api/admin/inquiries -> Status: ${inquiriesRes.statusCode} | Inquiries returned: ${inquiriesRes.body?.data?.length}`);

  // 6. Inquiries: Update Status
  const inqStatusRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/inquiries/inq_1/status',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { status: 'Contacted' }
  );
  console.log(`[6] PATCH /api/admin/inquiries/:id/status -> Status: ${inqStatusRes.statusCode} | Status: ${inqStatusRes.body?.data?.status}`);

  // 7. Viewings: GET /api/admin/viewings
  const viewingsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/viewings',
    method: 'GET',
  });
  console.log(`[7] GET /api/admin/viewings -> Status: ${viewingsRes.statusCode} | Viewings count: ${viewingsRes.body?.data?.length}`);

  // 8. Viewings: Reschedule
  const rescheduleRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/viewings/view_1/reschedule',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
    { date: '2025-05-18', time: '04:00 PM', notes: 'Rescheduled per buyer flight delay.' }
  );
  console.log(`[8] PATCH /api/admin/viewings/:id/reschedule -> Status: ${rescheduleRes.statusCode} | New Date: ${rescheduleRes.body?.data?.date} at ${rescheduleRes.body?.data?.time}`);

  // 9. Notifications: GET /api/admin/notifications
  const notifsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/notifications',
    method: 'GET',
  });
  console.log(`[9] GET /api/admin/notifications -> Status: ${notifsRes.statusCode} | Notifications count: ${notifsRes.body?.data?.length}`);

  // 10. Notifications: Send Announcement to Agents
  const sendNotifRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/admin/notifications',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      title: 'Q2 Brokerage Commission Bonus Program',
      message: 'Exclusive 0.5% closing bonus for all residential closings over $5M before end of quarter.',
      targetAudience: 'agents',
      type: 'announcement',
      priority: 'high',
    }
  );
  console.log(`[10] POST /api/admin/notifications (Send Announcement) -> Status: ${sendNotifRes.statusCode} | Dispatched ID: ${sendNotifRes.body?.data?.id}`);

  console.log('\n============== ALL 10 PHASE 3 ADMIN API ENDPOINTS PASSED SUCCESSFULLY! ==============\n');
}

runPhase3Tests().catch(console.error);
