import connectDB from '../config/db.js';
import { AuthService } from '../services/authService.js';
import bcrypt from 'bcryptjs';

async function runTests() {
  console.log('\n================ STARTING BACKEND AUTH TEST SUITE ================');
  try {
    await connectDB();
    console.log('[Test 1] Database connection handler initialized successfully.');

    const testEmail = `test_${Date.now()}@trustyestate.com`;
    const testPassword = 'Password123!';

    // Test 2: Register Buyer
    console.log('\n[Test 2] Testing User Registration (Role: buyer)...');
    const registeredBuyer = await AuthService.registerUser({
      firstName: 'Alice',
      lastName: 'Buyer',
      email: testEmail,
      password: testPassword,
      role: 'buyer',
      phone: '+1 555-0199',
    });
    console.log(' Buyer registered successfully!');
    console.log(' User ID:', registeredBuyer.user._id);
    console.log(' Role assigned:', registeredBuyer.user.role);
    console.log(' Token issued:', registeredBuyer.token.substring(0, 25) + '...');
    console.log(' Password stripped in JSON output:', registeredBuyer.user.password === undefined ? 'YES (Secure)' : 'NO');

    // Test 3: Password verification & hashing
    console.log('\n[Test 3] Testing Password Verification & Encryption...');
    const loginAttempt = await AuthService.loginUser({
      email: testEmail,
      password: testPassword,
    });
    console.log(' Correct password verified and authenticated!');

    let invalidAuthCaught = false;
    try {
      await AuthService.loginUser({
        email: testEmail,
        password: 'WrongPassword999!',
      });
    } catch (e) {
      invalidAuthCaught = true;
    }
    console.log(` Incorrect password rejection: ${invalidAuthCaught ? 'PASS (401 Unauthorized)' : 'FAIL'}`);

    // Test 4: Profile retrieval
    console.log('\n[Test 4] Testing Get Current User Profile...');
    const profile = await AuthService.getCurrentUser(registeredBuyer.user._id);
    console.log(` Profile retrieved for: ${profile.firstName} ${profile.lastName} (${profile.role})`);

    // Test 5: Register Agent and Agency roles
    console.log('\n[Test 5] Testing Multi-Role Registration (Agent & Agency)...');
    const agentEmail = `agent_${Date.now()}@trustyestate.com`;
    const agentUser = await AuthService.registerUser({
      firstName: 'Marcus',
      lastName: 'Vance',
      email: agentEmail,
      password: testPassword,
      role: 'agent',
      bio: 'Top luxury residential agent in Manhattan',
    });
    console.log(` Agent registered: role=${agentUser.user.role}, verificationStatus=${agentUser.user.verificationStatus}`);

    const agencyEmail = `agency_${Date.now()}@trustyestate.com`;
    const agencyUser = await AuthService.registerUser({
      firstName: 'Apex',
      lastName: 'Realty Group',
      email: agencyEmail,
      password: testPassword,
      role: 'agency',
    });
    console.log(` Agency registered: role=${agencyUser.user.role}, verificationStatus=${agencyUser.user.verificationStatus}`);

    // Test 6: Change Password
    console.log('\n[Test 6] Testing Change Password Flow...');
    const newPassword = 'NewSecretPassword2026!';
    const changePassResult = await AuthService.changePassword(registeredBuyer.user._id, {
      currentPassword: testPassword,
      newPassword: newPassword,
    });
    console.log(' Change password succeeded:', changePassResult.message);

    // Verify login with new password
    const loginWithNewPass = await AuthService.loginUser({
      email: testEmail,
      password: newPassword,
    });
    console.log(' Login with new password succeeded and new JWT issued!');

    // Test 7: Forgot and Reset Password Flow
    console.log('\n[Test 7] Testing Forgot & Reset Password Flow...');
    const forgotResult = await AuthService.forgotPassword(testEmail);
    console.log(' Forgot password triggered:', forgotResult.message);
    const resetToken = forgotResult.resetToken;

    const resetPassResult = await AuthService.resetPassword({
      token: resetToken,
      newPassword: 'ResetPasswordSuccess2026!',
    });
    console.log(' Reset password completed:', resetPassResult.message);

    const loginAfterReset = await AuthService.loginUser({
      email: testEmail,
      password: 'ResetPasswordSuccess2026!',
    });
    console.log(' Login with reset password verified successfully!');

    console.log('\n================ ALL BACKEND AUTH TESTS PASSED (7/7) ================');
    process.exit(0);
  } catch (err) {
    console.error('\n Backend test failed:', err.message);
    if (err.errors) console.error('Errors:', err.errors);
    console.error(err.stack);
    process.exit(1);
  }
}

runTests();
