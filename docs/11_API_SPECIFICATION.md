# **11\_API\_SPECIFICATION**

   
**01\_Identity**  
**Authentication.api.md**  
**POST   /api/v1/auth/register**  
**POST   /api/v1/auth/check-email**  
**POST   /api/v1/auth/verify-email**  
**POST   /api/v1/auth/resend-verification**  
**POST   /api/v1/auth/login**  
**POST   /api/v1/auth/google**  
**POST   /api/v1/auth/refresh-token**  
**POST   /api/v1/auth/forgot-password**  
**POST   /api/v1/auth/reset-password**  
**POST   /api/v1/auth/logout**  
**POST   /api/v1/auth/logout-all**

**User.api.md**  
**GET    /api/v1/users/me**  
**PATCH  /api/v1/users/me**  
**POST   /api/v1/users/change-password**

**GET    /api/v1/users/sessions**  
**GET    /api/v1/users/sessions/:sessionId**  
**DELETE /api/v1/users/sessions/:sessionId**

**DELETE /api/v1/users/me**

**02\_Profile**  
**ClientProfile.api.md**  
**POST   /api/v1/client-profiles**  
**GET    /api/v1/client-profiles/me**  
**PATCH  /api/v1/client-profiles/me**

**POST   /api/v1/client-profiles/me/avatar**  
**DELETE /api/v1/client-profiles/me/avatar**

**TrainerProfile.api.md**  
**POST   /api/v1/trainer-profiles**  
**GET    /api/v1/trainer-profiles/me**  
**PATCH  /api/v1/trainer-profiles/me**

**GET    /api/v1/trainer-profiles**  
**GET    /api/v1/trainer-profiles/:trainerId**

**POST   /api/v1/trainer-profiles/me/avatar**  
**DELETE /api/v1/trainer-profiles/me/avatar**

**GET    /api/v1/trainer-profiles/me/availability**  
**PATCH  /api/v1/trainer-profiles/me/availability**

**POST   /api/v1/trainer-profiles/me/certifications**  
**PATCH  /api/v1/trainer-profiles/me/certifications/:certificationId**  
**DELETE /api/v1/trainer-profiles/me/certifications/:certificationId**

**POST   /api/v1/trainer-profiles/me/showcase**  
**GET    /api/v1/trainer-profiles/me/showcase**  
**PATCH  /api/v1/trainer-profiles/me/showcase/:itemId**  
**DELETE /api/v1/trainer-profiles/me/showcase/:itemId**

**03\_Marketplace**  
**TrainerRequest.api.md**  
**GET    /api/v1/trainer-profiles**

**GET    /api/v1/trainer-profiles/:trainerId**

**POST   /api/v1/trainer-requests**

**GET    /api/v1/trainer-requests**  
**GET    /api/v1/trainer-requests/:requestId**

**GET    /api/v1/trainer-requests/pending**  
**GET    /api/v1/trainer-requests/history**

**POST   /api/v1/trainer-requests/:requestId/accept**  
**POST   /api/v1/trainer-requests/:requestId/reject**  
**POST   /api/v1/trainer-requests/:requestId/withdraw**  
**POST   /api/v1/trainer-requests/:requestId/close**

**04\_Consultation**  
**Consultation.api.md**  
**POST   /api/v1/consultations**

**GET    /api/v1/consultations**  
**GET    /api/v1/consultations/:consultationId**

**GET    /api/v1/consultations/upcoming**  
**GET    /api/v1/consultations/history**

**PATCH  /api/v1/consultations/:consultationId**

**POST   /api/v1/consultations/:consultationId/confirm**  
**POST   /api/v1/consultations/:consultationId/cancel**  
**POST   /api/v1/consultations/:consultationId/complete**

**05\_Offer**  
**CoachingOffer.api.md**  
**POST   /api/v1/offers**

**GET    /api/v1/offers**  
**GET    /api/v1/offers/:offerId**

**GET    /api/v1/offers/sent**  
**GET    /api/v1/offers/received**  
**GET    /api/v1/offers/pending**

**PATCH  /api/v1/offers/:offerId**

**POST   /api/v1/offers/:offerId/accept**  
**POST   /api/v1/offers/:offerId/reject**  
**POST   /api/v1/offers/:offerId/cancel**  
**POST   /api/v1/offers/:offerId/expire**

**06\_Payment**  
**06_Payment**
**Payment.api.md**  
**POST   /api/v1/payments**  
**POST   /api/v1/payments/:paymentId/verify**  
**GET    /api/v1/payments**  
**GET    /api/v1/payments/:paymentId**  
**GET    /api/v1/payments/:paymentId/invoice**  
**POST   /api/v1/payments/webhook/razorpay**  

**Refund.api.md (Payment-Scoped)**  
**POST   /api/v1/payments/:paymentId/refunds**  
**GET    /api/v1/payments/:paymentId/refunds/:refundId**  
**GET    /api/v1/payments/refunds**  
**PATCH  /api/v1/payments/:paymentId/refunds/:refundId/review**  
**PATCH  /api/v1/payments/:paymentId/refunds/:refundId/approve**  
**PATCH  /api/v1/payments/:paymentId/refunds/:refundId/reject**  
**POST   /api/v1/payments/:paymentId/refunds/:refundId/process**  

**Dispute.api.md (Payment-Scoped)**  
**POST   /api/v1/payments/:paymentId/disputes**  
**GET    /api/v1/payments/:paymentId/disputes/:disputeId**  
**GET    /api/v1/payments/disputes**  
**PATCH  /api/v1/payments/:paymentId/disputes/:disputeId/investigate**  
**PATCH  /api/v1/payments/:paymentId/disputes/:disputeId/resolve**  
**PATCH  /api/v1/payments/:paymentId/disputes/:disputeId/close**  

**Payout.api.md (Payment-Scoped)**  
**GET    /api/v1/payments/:paymentId/payout/eligibility**  
**GET    /api/v1/payments/:paymentId/payout**  
**GET    /api/v1/payments/payouts**  
**POST   /api/v1/payments/:paymentId/payout/process**  
**GET    /api/v1/payments/:paymentId/settlement**

**07\_Coaching**  
**CoachingRelationship.api.md**  
**GET    /api/v1/coaching-relationships**

**GET    /api/v1/coaching-relationships/:relationshipId**

**GET    /api/v1/coaching-relationships/active**

**GET    /api/v1/coaching-relationships/history**

**POST   /api/v1/coaching-relationships/:relationshipId/activate**  
**POST   /api/v1/coaching-relationships/:relationshipId/pause**  
**POST   /api/v1/coaching-relationships/:relationshipId/resume**  
**POST   /api/v1/coaching-relationships/:relationshipId/complete**  
**POST   /api/v1/coaching-relationships/:relationshipId/cancel**

**08\_Workout**  
**Exercise.api (recommended)**  
**POST   /api/v1/exercises**

**GET    /api/v1/exercises**  
**GET    /api/v1/exercises/:exerciseId**

**PATCH  /api/v1/exercises/:exerciseId**

**DELETE /api/v1/exercises/:exerciseId**

**WorkoutProgram.api.md**  
**POST   /api/v1/workout-programs**

**GET    /api/v1/workout-programs**  
**GET    /api/v1/workout-programs/:programId**

**GET    /api/v1/workout-programs/assigned**

**PATCH  /api/v1/workout-programs/:programId**

**DELETE /api/v1/workout-programs/:programId**

**POST   /api/v1/workout-programs/:programId/duplicate**

**POST   /api/v1/workout-programs/:programId/assign**

**POST   /api/v1/workout-programs/:programId/publish**

**POST   /api/v1/workout-programs/:programId/archive**

**WorkoutCompletion.api.md**  
**POST   /api/v1/workout-completions**

**GET    /api/v1/workout-completions**

**GET    /api/v1/workout-completions/:completionId**

**GET    /api/v1/workout-completions/history**

**PATCH  /api/v1/workout-completions/:completionId**

**09\_Nutrition**  
**NutritionPlan.api.md**  
**POST   /api/v1/nutrition-plans**

**GET    /api/v1/nutrition-plans**  
**GET    /api/v1/nutrition-plans/:planId**

**GET    /api/v1/nutrition-plans/assigned**

**PATCH  /api/v1/nutrition-plans/:planId**

**DELETE /api/v1/nutrition-plans/:planId**

**POST   /api/v1/nutrition-plans/:planId/duplicate**

**POST   /api/v1/nutrition-plans/:planId/assign**

**POST   /api/v1/nutrition-plans/:planId/publish**

**POST   /api/v1/nutrition-plans/:planId/archive**

**NutritionCompletion.api.md**  
**POST   /api/v1/nutrition-completions**

**GET    /api/v1/nutrition-completions**

**GET    /api/v1/nutrition-completions/:completionId**

**GET    /api/v1/nutrition-completions/history**

**PATCH  /api/v1/nutrition-completions/:completionId**

**10\_Progress**  
**CoachingEvaluation.api.md**  
**POST   /api/v1/coaching-evaluations**

**GET    /api/v1/coaching-evaluations**

**GET    /api/v1/coaching-evaluations/:evaluationId**

**GET    /api/v1/coaching-evaluations/history**

**PATCH  /api/v1/coaching-evaluations/:evaluationId**

**POST   /api/v1/coaching-evaluations/:evaluationId/publish**

**11\_Communication**  
**Message.api.md**  
**POST   /api/v1/messages**

**GET    /api/v1/messages**

**GET    /api/v1/messages/:messageId**

**GET    /api/v1/messages/conversations**

**GET    /api/v1/messages/conversations/:conversationId**

**GET    /api/v1/messages/unread-count**

**POST   /api/v1/messages/mark-read**

**PATCH  /api/v1/messages/:messageId**

**DELETE /api/v1/messages/:messageId**

**POST   /api/v1/messages/:messageId/report**

**VideoCall.api.md**  
**POST   /api/v1/video-calls**

**GET    /api/v1/video-calls**

**GET    /api/v1/video-calls/:callId**

**GET    /api/v1/video-calls/history**

**POST   /api/v1/video-calls/:callId/join**

**POST   /api/v1/video-calls/:callId/reconnect**

**POST   /api/v1/video-calls/:callId/leave**

**POST   /api/v1/video-calls/:callId/end**

**12\_Review**  
**Review.api.md**  
**POST   /api/v1/reviews**

**GET    /api/v1/reviews**

**GET    /api/v1/reviews/:reviewId**

**GET    /api/v1/reviews/me**

**GET    /api/v1/reviews/trainers/:trainerId**

**PATCH  /api/v1/reviews/:reviewId**

**POST   /api/v1/reviews/:reviewId/publish**

**POST   /api/v1/reviews/:reviewId/lock**

**DELETE /api/v1/reviews/:reviewId**

**13\_Admin**  
**PlatformAdministration.api.md**  
**GET    /api/v1/admin/dashboard**

**GET    /api/v1/admin/statistics**

**GET    /api/v1/admin/users**

**GET    /api/v1/admin/users/:userId**

**POST   /api/v1/admin/users/:userId/suspend**

**POST   /api/v1/admin/users/:userId/activate**

**POST   /api/v1/admin/users/:userId/ban**

**GET    /api/v1/admin/trainer-requests**

**GET    /api/v1/admin/payments**

**GET    /api/v1/admin/refunds**

**POST   /api/v1/admin/refunds/:refundId/approve**

**POST   /api/v1/admin/refunds/:refundId/reject**

**GET    /api/v1/admin/payouts**

**POST   /api/v1/admin/payouts/:payoutId/process**

**GET    /api/v1/admin/messages**

**GET    /api/v1/admin/reviews**

**GET    /api/v1/admin/reports**

**POST   /api/v1/admin/reports/:reportId/resolve**

**GET    /api/v1/admin/platform-configurations**

**PATCH  /api/v1/admin/platform-configurations**

# **BASE URL:** [https://api.kizunafit.com/api/v1](https://api.kizunafit.com/api/v1)

---

   
**01\_Identity**  
---

# **Authentication.api.md**

---

# **Register User**

POST /api/v1/auth/register

### **Description**

Registers a new user account and sends an email verification link. The account remains inactive until the email address is verified.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "fullName": "Mohammed Nihal K",  
  "email": "nihal@example.com",  
  "password": "Password@123",  
  "role": "CLIENT"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| fullName | string | ✅ | 3–100 characters |
| email | string | ✅ | Valid email format |
| password | string | ✅ | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character |
| role | enum | ✅ | CLIENT, TRAINER |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Registration successful. Please verify your email.",  
  "data": {  
    "user": {  
      "id": "687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K",  
      "email": "nihal@example.com",  
      "role": "CLIENT",  
      "emailVerified": false,  
      "accountStatus": "ACTIVE",  
      "createdAt": "2026-07-02T18:30:12.000Z"  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "email",  
      "message": "Invalid email address."  
    },  
    {  
      "field": "password",  
      "message": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 409 | USER\_ALREADY\_EXISTS | Email address is already registered. |
| 409 | EMAIL\_ALREADY\_VERIFIED | Email address has already been verified. |
| 429 | TOO\_MANY\_REGISTRATION\_ATTEMPTS | Registration rate limit exceeded. |

---

### **Notes**

* Password is hashed before storage.  
* Email verification is mandatory before login.  
* A verification email is sent immediately after successful registration.  
* Verification state is tracked via the `emailVerified` field (false for unverified, true for verified).  
* One email address can only belong to one account.  
* The user's role cannot be changed after registration.  
* Rate limiting is applied to prevent abuse.

---

# **Check Email Availability**

POST /api/v1/auth/check-email

### **Description**

Checks whether an email address is available for registration before creating a new account.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "email": "nihal@example.com"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| email | string | ✅ | Must be a valid email address |

---

### **Success Response (200 OK)**

#### **Email Available**

{  
  "success": true,  
  "message": "Email is available.",  
  "data": {  
    "email": "nihal@example.com",  
    "available": true  
  }  
}

#### **Email Already Registered**

{  
  "success": true,  
  "message": "Email is already registered.",  
  "data": {  
    "email": "nihal@example.com",  
    "available": false  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "email",  
      "message": "Invalid email address."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 429 | TOO\_MANY\_REQUESTS | Too many email availability checks from the same client. |

---

### **Notes**

* This endpoint does **not** create a user account.  
* This endpoint does **not** reveal any user information other than email availability.  
* Used during the registration flow for instant email validation.  
* Rate limiting is applied to prevent email enumeration attacks.  
* Email comparison is case-insensitive.  
* The endpoint returns **200 OK** for both available and unavailable emails. The client should check the `available` field instead of relying on different HTTP status codes.

# ---

 

# **Verify Email**

POST /api/v1/auth/verify-email

### **Description**

Verifies the user's email address using the verification token and activates the account.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| token | string | ✅ | Valid, non-expired email verification token |

---

### **Success Response (200 OK)**

{

  "success": true,

  "message": "Email verified successfully. Your account has been activated.",

  "data": {

    "user": {

      "id": "687ab12cd34ef56789012345",

      "email": "nihal@example.com",

      "emailVerified": true,

      "accountStatus": "ACTIVE"

    }

  }

}

---

### **Validation Errors (400 Bad Request)**

{

  "success": false,

  "message": "Validation failed.",

  "errors": \[

    {

      "field": "token",

      "message": "Verification token is required."

    }

  \]

}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 400 | INVALID\_VERIFICATION\_TOKEN | Verification token is invalid. |
| 400 | VERIFICATION\_TOKEN\_EXPIRED | Verification token has expired. |
| 409 | EMAIL\_ALREADY\_VERIFIED | Email has already been verified. |
| 404 | USER\_NOT\_FOUND | No user found for the provided verification token. |
| 429 | TOO\_MANY\_VERIFICATION\_ATTEMPTS | Too many verification attempts. |

---

### **Notes**

* Activates the user account after successful verification.  
* The verification token can only be used once.  
* Expired or invalid tokens are rejected.  
* After successful verification, the verification token is permanently invalidated.  
* Users can request a new verification email if the token expires.  
* This endpoint does **not** log the user in automatically.

---

# **Resend Verification Email**

POST /api/v1/auth/resend-verification

### **Description**

Sends a new email verification link to a user whose email address has not yet been verified.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{

  "email": "nihal@example.com"

}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| email | string | ✅ | Must be a valid email address |

---

### **Success Response (200 OK)**

{

  "success": true,

  "message": "A new verification email has been sent.",

  "data": {

    "email": "nihal@example.com",

    "verificationEmailSent": true

  }

}

---

### **Validation Errors (400 Bad Request)**

{

  "success": false,

  "message": "Validation failed.",

  "errors": \[

    {

      "field": "email",

      "message": "Valid email address is required."

    }

  \]

}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 404 | USER\_NOT\_FOUND | No account exists with the provided email address. |
| 409 | EMAIL\_ALREADY\_VERIFIED | Email address has already been verified. |
| 429 | TOO\_MANY\_RESEND\_REQUESTS | Verification email request limit exceeded. |

---

### **Notes**

* A new verification token is generated for every successful request.  
* Any previously issued unused verification token is invalidated.  
* Only unverified accounts can request a new verification email.  
* Email sending is rate-limited to prevent abuse.  
* The verification token has a limited validity period.  
* This endpoint does not activate the account; activation occurs only after successful email verification.

---

# **Login**

POST /api/v1/auth/login

### **Description**

Authenticates a registered user using their email and password, then creates a new authenticated session by issuing an Access Token and a Refresh Token.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "email": "nihal@example.com",  
  "password": "Password@123"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| email | string | ✅ | Must be a valid registered email address |
| password | string | ✅ | Required |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Login successful.",  
  "data": {  
    "user": {  
      "id": "687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K",  
      "email": "nihal@example.com",  
      "role": "CLIENT",  
      "emailVerified": true,  
      "accountStatus": "ACTIVE"  
    },  
    "accessToken": "\<ACCESS\_TOKEN\>",  
    "refreshToken": "\<REFRESH\_TOKEN\>",  
    "expiresIn": 900  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "email",  
      "message": "Valid email address is required."  
    },  
    {  
      "field": "password",  
      "message": "Password is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | INVALID\_CREDENTIALS | Email or password is incorrect. |
| 403 | EMAIL\_NOT\_VERIFIED | Email address has not been verified. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | No account exists with the provided email address. |
| 429 | TOO\_MANY\_LOGIN\_ATTEMPTS | Too many failed login attempts. Try again later. |

---

### **Notes**

* Login is allowed only for active and verified accounts.  
* A successful login creates a new refresh token session for the current device.  
* Multiple device sessions are supported.  
* Access Token is used for API authentication.  
* Refresh Token is used to obtain new Access Tokens without requiring the user to log in again.  
* Passwords are never returned in the response.  
* Failed login attempts are rate-limited to prevent brute-force attacks.

---

# **Google Login**

POST /api/v1/auth/google

### **Description**

Authenticates a user using their Google account. If the user does not already exist, a new account is automatically created and verified.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "idToken": "\<GOOGLE\_ID\_TOKEN\>"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| idToken | string | ✅ | Valid Google ID Token issued by Google OAuth |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Google login successful.",  
  "data": {  
    "user": {  
      "id": "687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K",  
      "email": "nihal@example.com",  
      "role": "CLIENT",  
      "emailVerified": true,  
      "accountStatus": "ACTIVE",  
      "provider": "GOOGLE"  
    },  
    "accessToken": "\<ACCESS\_TOKEN\>",  
    "refreshToken": "\<REFRESH\_TOKEN\>",  
    "expiresIn": 900  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "idToken",  
      "message": "Google ID Token is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | INVALID\_GOOGLE\_TOKEN | Google ID Token is invalid or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 409 | EMAIL\_ALREADY\_REGISTERED | Email is already registered with password authentication. |
| 429 | TOO\_MANY\_LOGIN\_ATTEMPTS | Too many login attempts. Try again later. |

---

### **Notes**

* Google ID Token is verified using Google's authentication service.  
* A new user account is automatically created if no account exists for the verified email address.  
* Newly created Google accounts are automatically marked as email verified.  
* Existing Google users are logged in directly.  
* A new refresh token session is created for each successful login.  
* Password authentication is not required for Google login.  
* Access Token and Refresh Token are issued after successful authentication.

---

# **Refresh Access Token**

POST /api/v1/auth/refresh-token

### **Description**

Generates a new Access Token and Refresh Token using a valid Refresh Token session without requiring the user to log in again.

### **Authentication**

Public (Requires a valid Refresh Token)

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "refreshToken": "\<REFRESH\_TOKEN\>"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refreshToken | string | ✅ | Valid, active Refresh Token |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Access token refreshed successfully.",  
  "data": {  
    "accessToken": "\<NEW\_ACCESS\_TOKEN\>",  
    "refreshToken": "\<NEW\_REFRESH\_TOKEN\>",  
    "expiresIn": 900  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "refreshToken",  
      "message": "Refresh token is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | INVALID\_REFRESH\_TOKEN | Refresh token is invalid. |
| 401 | REFRESH\_TOKEN\_EXPIRED | Refresh token has expired. |
| 401 | REFRESH\_TOKEN\_REVOKED | Refresh token has been revoked or logged out. |
| 401 | SESSION\_NOT\_FOUND | Authentication session does not exist. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 429 | TOO\_MANY\_REFRESH\_REQUESTS | Refresh token request limit exceeded. |

---

### **Notes**

* Refresh Token rotation is implemented. A new Refresh Token is issued for every successful refresh request.  
* The previous Refresh Token is immediately invalidated after a successful refresh.  
* Only active, non-expired sessions can generate new tokens.  
* If the Refresh Token has been revoked or has expired, the user must log in again.  
* A Refresh Token can only be used once after token rotation.  
* Access Tokens remain short-lived, while Refresh Tokens manage long-lived authenticated sessions.  
* All refresh activities are recorded for security auditing.

---

# **Forgot Password**

POST /api/v1/auth/forgot-password

### **Description**

Initiates the password reset process by sending a password reset link to the user's registered email address.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "email": "nihal@example.com"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| email | string | ✅ | Must be a valid registered email address |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "If an account exists for this email, a password reset link has been sent.",  
  "data": {  
    "emailSent": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "email",  
      "message": "Valid email address is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 403 | EMAIL\_NOT\_VERIFIED | Email address has not been verified. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 429 | TOO\_MANY\_RESET\_REQUESTS | Password reset request limit exceeded. |

---

### **Notes**

* A secure, time-limited password reset token is generated.  
* The password reset link is sent only to the registered email address.  
* Any previously unused password reset token is invalidated.  
* The response is identical whether or not the email exists to prevent email enumeration attacks.  
* Password reset tokens expire after the configured validity period.  
* A password reset request does not affect active login sessions.  
* Rate limiting is applied to prevent abuse.

---

# **Reset Password**

POST /api/v1/auth/reset-password

### **Description**

Resets the user's password using a valid password reset token.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "token": "\<PASSWORD\_RESET\_TOKEN\>",  
  "newPassword": "NewPassword@123",  
  "confirmPassword": "NewPassword@123"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| token | string | ✅ | Valid, non-expired password reset token |
| newPassword | string | ✅ | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character |
| confirmPassword | string | ✅ | Must match `newPassword` |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Password has been reset successfully.",  
  "data": {  
    "passwordReset": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "confirmPassword",  
      "message": "Passwords do not match."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 400 | INVALID\_RESET\_TOKEN | Password reset token is invalid. |
| 400 | RESET\_TOKEN\_EXPIRED | Password reset token has expired. |
| 400 | PASSWORD\_ALREADY\_USED | New password cannot be the same as the current password. |
| 404 | USER\_NOT\_FOUND | No user found for the provided reset token. |
| 429 | TOO\_MANY\_RESET\_ATTEMPTS | Too many password reset attempts. |

---

### **Notes**

* The password reset token can only be used once.  
* All existing password reset tokens are invalidated after a successful password reset.  
* The new password is securely hashed before being stored.  
* The user must log in again after resetting the password.  
* For security, all active refresh token sessions are revoked after a successful password reset.  
* Expired or invalid tokens cannot be reused.  
* Password history validation may prevent reusing the current password.

---

# **Logout**

POST /api/v1/auth/logout

### **Description**

Logs out the currently authenticated user by revoking the active Refresh Token session.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "refreshToken": "\<REFRESH\_TOKEN\>"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refreshToken | string | ✅ | Must be a valid active Refresh Token |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Logged out successfully.",  
  "data": {  
    "loggedOut": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "refreshToken",  
      "message": "Refresh token is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing or invalid. |
| 401 | INVALID\_REFRESH\_TOKEN | Refresh token is invalid. |
| 401 | SESSION\_NOT\_FOUND | Authentication session not found. |
| 401 | SESSION\_ALREADY\_REVOKED | Session has already been logged out. |

---

### **Notes**

* Logs out only the current device/session.  
* The associated Refresh Token is permanently revoked.  
* The Access Token becomes unusable after it expires.  
* Other active sessions remain unaffected.  
* Logged-out Refresh Tokens cannot be reused.  
* The logout event is recorded for security auditing.  
* Calling this endpoint multiple times with the same revoked Refresh Token returns an authentication error.

---

# **Logout All Devices**

POST /api/v1/auth/logout-all

### **Description**

Logs out the authenticated user from all devices by revoking every active Refresh Token session associated with the account.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Logged out from all devices successfully.",  
  "data": {  
    "revokedSessions": 5  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing or invalid. |
| 401 | SESSION\_NOT\_FOUND | No active session found for the authenticated user. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Revokes all active Refresh Token sessions across every device.  
* The current session is also revoked.  
* All previously issued Refresh Tokens become permanently invalid.  
* Existing Access Tokens remain valid until they expire naturally.  
* The user must log in again on every device.  
* This endpoint is recommended after changing sensitive account information or when suspicious activity is detected.  
* The logout-all action is recorded in the security audit log.

---

# **User.api.md**

---

 

# **Get Current User**

GET /api/v1/users/me

### **Description**

Retrieves the profile information of the currently authenticated user.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User profile retrieved successfully.",  
  "data": {  
    "id": "687ab12cd34ef56789012345",  
    "fullName": "Mohammed Nihal K",  
    "phoneNumber": "+919876543210",  
    "email": "nihal@example.com",  
    "role": "CLIENT",  
    "emailVerified": true,  
    "accountStatus": "ACTIVE",  
    "profileCompleted": true,  
    "profileImage": "https://cdn.kizunafit.com/avatars/avatar.jpg",  
    "createdAt": "2026-07-02T18:30:12.000Z",  
    "updatedAt": "2026-07-15T10:42:18.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |

---

### **Notes**

* Returns the authenticated user's account information.  
* Password hash and sensitive authentication data are never returned.  
* The response only contains the authenticated user's own information.  
* The endpoint is commonly used during application startup to restore the authenticated user.  
* The response may include role-specific information depending on the authenticated user's role.  
* Requires a valid Access Token.

---

* `accountStatus` is the DTO mapping for the internal database `status` field, aligning with the architectural preference for exposing business models.

# **Update Current User**

PATCH /api/v1/users/me

### **Description**

Updates the authenticated user's account information.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "fullName": "Mohammed Nihal",  
  "phoneNumber": "+919876543210"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| fullName | string | ❌ | 3–100 characters |
| phoneNumber | string | ❌ | Valid mobile number |

Only the fields that need to be updated should be included in the request body.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User profile updated successfully.",  
  "data": {  
    "id": "687ab12cd34ef56789012345",  
    "fullName": "Mohammed Nihal",  
    "email": "nihal@example.com",  
    "phoneNumber": "+919876543210",  
    "role": "CLIENT",  
    "emailVerified": true,  
    "accountStatus": "ACTIVE",  
    "updatedAt": "2026-07-15T14:35:21.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "fullName",  
      "message": "Full name must be between 3 and 100 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 409 | EMAIL\_UPDATE\_NOT\_ALLOWED | Email address cannot be updated through this endpoint. |
| 409 | ROLE\_UPDATE\_NOT\_ALLOWED | User role cannot be changed. |

---

### **Notes**

* Users can update only their own account.  
* Only the fields provided in the request are updated.  
* Email address cannot be changed through this endpoint.  
* User role cannot be changed after registration.  
* Password cannot be updated through this endpoint. Use the **Change Password** API instead.  
* Profile-specific information (Client/Trainer) is managed through the respective Profile APIs.  
* The `updatedAt` timestamp is automatically updated after a successful update.

---

# **Change Password**

POST /api/v1/users/change-password

### **Description**

Allows the authenticated user to change their account password by providing the current password and a new password.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "currentPassword": "CurrentPassword@123",  
  "newPassword": "NewPassword@123",  
  "confirmPassword": "NewPassword@123"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| currentPassword | string | ✅ | Required |
| newPassword | string | ✅ | Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character |
| confirmPassword | string | ✅ | Must match `newPassword` |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Password changed successfully.",  
  "data": {  
    "passwordChanged": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "confirmPassword",  
      "message": "Passwords do not match."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 400 | INVALID\_CURRENT\_PASSWORD | Current password is incorrect. |
| 400 | PASSWORD\_ALREADY\_USED | New password cannot be the same as the current password. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 429 | TOO\_MANY\_PASSWORD\_CHANGE\_ATTEMPTS | Too many password change attempts. Try again later. |

---

### **Notes**

* The current password must be verified before changing the password.  
* The new password must satisfy the platform's password policy.  
* `confirmPassword` must exactly match `newPassword`.  
* The new password cannot be the same as the current password.  
* The new password is securely hashed before storage.  
* All active Refresh Token sessions are revoked after a successful password change.  
* The user must log in again on all devices after changing the password.  
* The password change event is recorded in the security audit log.

---

# **Get User Sessions**

GET /api/v1/users/sessions

### **Description**

Retrieves all active and recently active login sessions for the authenticated user across all devices.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User sessions retrieved successfully.",  
  "data": \[  
    {  
      "sessionId": "ses\_687ab12cd34ef56789012345",  
      "deviceName": "Chrome on Windows",  
      "deviceType": "Desktop",  
      "browser": "Chrome 138",  
      "operatingSystem": "Windows 11",  
      "ipAddress": "192.168.1.100",  
      "location": "Kerala, India",  
      "currentSession": true,  
      "lastActiveAt": "2026-07-15T14:25:10.000Z",  
      "createdAt": "2026-07-10T09:30:00.000Z"  
    },  
    {  
      "sessionId": "ses\_687ab12cd34ef56789012346",  
      "deviceName": "Safari on iPhone",  
      "deviceType": "Mobile",  
      "browser": "Safari",  
      "operatingSystem": "iOS 19",  
      "ipAddress": "192.168.1.101",  
      "location": "Kerala, India",  
      "currentSession": false,  
      "lastActiveAt": "2026-07-14T21:15:42.000Z",  
      "createdAt": "2026-07-08T18:10:25.000Z"  
    }  
  \]  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |

---

### **Notes**

* Returns only the sessions belonging to the authenticated user.  
* The current active session is identified using the `currentSession` field.  
* Sessions are ordered by the most recently active session first.  
* Refresh Tokens are never returned in the response.  
* Device information is captured during authentication and stored with the session.  
* Users can revoke individual sessions using the **Delete User Session** API.  
* Used to power the **"Manage Devices"** section of the account settings.  
* The sessionId is a public identifier and is distinct from the internal database (Mongo) ObjectId.

---

# **Get User Session**

GET /api/v1/users/sessions/:sessionId

### **Description**

Retrieves detailed information about a specific login session belonging to the authenticated user.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "sessionId": "ses\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| sessionId | string | ✅ | Valid session identifier |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Session retrieved successfully.",  
  "data": {  
    "sessionId": "ses\_687ab12cd34ef56789012345",  
    "deviceName": "Chrome on Windows",  
    "deviceType": "Desktop",  
    "browser": "Chrome 138",  
    "operatingSystem": "Windows 11",  
    "ipAddress": "192.168.1.100",  
    "location": "Kerala, India",  
    "currentSession": true,  
    "createdAt": "2026-07-10T09:30:00.000Z",  
    "lastActiveAt": "2026-07-15T14:25:10.000Z",  
    "expiresAt": "2026-08-10T09:30:00.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "sessionId",  
      "message": "Invalid session ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 404 | SESSION\_NOT\_FOUND | Session does not exist or does not belong to the authenticated user. |

---

### **Notes**

* Only the owner of the session can access its details.  
* Refresh Tokens and other sensitive authentication data are never returned.  
* The current active session is identified by the `currentSession` field.  
* Session information is read-only.  
* Device metadata is captured during authentication.  
* Used to display detailed information for a specific logged-in device.

---

# **Delete User Session**

DELETE /api/v1/users/sessions/:sessionId

### **Description**

Revokes a specific login session belonging to the authenticated user. This immediately signs out the selected device while keeping other active sessions unaffected.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "sessionId": "ses\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| sessionId | string | ✅ | Valid session identifier |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Session revoked successfully.",  
  "data": {  
    "sessionId": "ses\_687ab12cd34ef56789012345",  
    "revoked": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "sessionId",  
      "message": "Invalid session ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 404 | SESSION\_NOT\_FOUND | Session does not exist or does not belong to the authenticated user. |
| 409 | CURRENT\_SESSION\_CANNOT\_BE\_REVOKED | The current active session cannot be revoked using this endpoint. Use **Logout** instead. |

---

### **Notes**

* Users can revoke only their own sessions.  
* Revoking a session immediately invalidates its associated Refresh Token.  
* The revoked device will be required to log in again.  
* Other active sessions remain unaffected.  
* The current active session cannot be revoked through this endpoint.  
* The session revocation is recorded in the security audit log.

---

# **Delete User Account**

DELETE /api/v1/users/me

### **Description**

Marks the account as deleted and anonymizes personal information according to the data retention policy.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "password": "Password@123",  
  "confirmDeletion": true  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| password | string | ✅ | Required for password-authenticated users |
| confirmDeletion | boolean | ✅ | Must be `true` |

**Note:** For Google-authenticated accounts, `password` is not required. Authentication through the active session is sufficient.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Your account has been deleted successfully.",  
  "data": {  
    "accountDeleted": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "confirmDeletion",  
      "message": "Account deletion must be confirmed."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 400 | INVALID\_PASSWORD | Current password is incorrect. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 409 | ACTIVE\_COACHING\_EXISTS | Account cannot be deleted while active coaching relationships exist. |
| 409 | PENDING\_PAYMENT\_EXISTS | Account cannot be deleted while payment or refund requests are pending. |

---

### **Notes**

* Account deletion is irreversible.  
* All active login sessions are revoked immediately.  
* All Refresh Tokens become invalid.  
* Users with active coaching relationships must end or transfer them before deleting their account.  
* Pending payments, refunds, or payouts must be resolved before account deletion.  
* Personal data is deleted or anonymized according to the platform's data retention policy.  
* The account deletion event is recorded in the security audit log.

---

# **Profile**

---

**ClientProfile.api.md** 

# **Create Client Profile**

POST /api/v1/client-profiles

### **Description**

Creates the authenticated user's client profile. A user can create only one client profile.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "dateOfBirth": "2000-05-20",  
  "gender": "MALE",  
  "height": 175,  
  "weight": 72,  
  "fitnessGoal": "WEIGHT\_LOSS",  
  "activityLevel": "MODERATELY\_ACTIVE",  
  "experienceLevel": "BEGINNER",  
  "medicalConditions": \[  
    "None"  
  \],  
  "bio": "Looking for a personalized fitness journey."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| dateOfBirth | date | ✅ | Must be a valid past date |
| gender | enum | ✅ | MALE, FEMALE, OTHER |
| height | number | ✅ | Greater than 0 (cm) |
| weight | number | ✅ | Greater than 0 (kg) |
| fitnessGoal | enum | ✅ | Platform supported fitness goals |
| activityLevel | enum | ✅ | SEDENTARY, LIGHTLY\_ACTIVE, MODERATELY\_ACTIVE, VERY\_ACTIVE |
| experienceLevel | enum | ✅ | BEGINNER, INTERMEDIATE, ADVANCED |
| medicalConditions | string\[\] | ❌ | Optional |
| bio | string | ❌ | Maximum 500 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Client profile created successfully.",  
  "data": {  
    "id": "client\_687ab12cd34ef56789012345",  
    "userId": "687ab12cd34ef56789012345",  
    "profileCompleted": true,  
    "createdAt": "2026-07-15T18:10:25.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "height",  
      "message": "Height must be greater than 0."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Client role can create a client profile. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 409 | CLIENT\_PROFILE\_ALREADY\_EXISTS | The authenticated user already has a client profile. |

---

### **Notes**

* A user can create only one client profile.  
* Only users with the **Client** role can access this endpoint.  
* The profile is permanently linked to the authenticated user account.  
* The profile can be updated later using the **Update Client Profile** API.  
* This endpoint marks the client profile as completed.  
* Profile creation is recorded in the audit log.

---

# **Get Client Profile**

GET /api/v1/client-profiles/me

### **Description**

Retrieves the authenticated user's client profile.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Client profile retrieved successfully.",  
  "data": {  
    "id": "client\_687ab12cd34ef56789012345",  
    "userId": "687ab12cd34ef56789012345",  
    "dateOfBirth": "2000-05-20",  
    "gender": "MALE",  
    "height": 175,  
    "weight": 72,  
    "fitnessGoal": "WEIGHT\_LOSS",  
    "activityLevel": "MODERATELY\_ACTIVE",  
    "experienceLevel": "BEGINNER",  
    "medicalConditions": \[  
      "None"  
    \],  
    "bio": "Looking for a personalized fitness journey.",  
    "avatarUrl": "https://cdn.kizunafit.com/client/avatar.jpg",  
    "createdAt": "2026-07-15T18:10:25.000Z",  
    "updatedAt": "2026-07-18T09:42:10.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Client role can access this endpoint. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 404 | CLIENT\_PROFILE\_NOT\_FOUND | Client profile has not been created yet. |

---

### **Notes**

* Returns only the authenticated user's client profile.  
* Only users with the **Client** role can access this endpoint.  
* Sensitive account information is not included in the response.  
* Profile information can be updated using the **Update Client Profile** API.  
* Avatar information is included if an avatar has been uploaded.  
* Used to populate the client's profile and dashboard screens.

---

# **Update Client Profile**

PATCH /api/v1/client-profiles/me

### **Description**

Updates the authenticated user's client profile information.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "height": 178,  
  "weight": 70,  
  "fitnessGoal": "MUSCLE\_GAIN",  
  "activityLevel": "VERY\_ACTIVE",  
  "experienceLevel": "INTERMEDIATE",  
  "medicalConditions": \[  
    "Asthma"  
  \],  
  "bio": "Training for strength and muscle gain."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| height | number | ❌ | Greater than 0 (cm) |
| weight | number | ❌ | Greater than 0 (kg) |
| fitnessGoal | enum | ❌ | Platform supported fitness goals |
| activityLevel | enum | ❌ | SEDENTARY, LIGHTLY\_ACTIVE, MODERATELY\_ACTIVE, VERY\_ACTIVE |
| experienceLevel | enum | ❌ | BEGINNER, INTERMEDIATE, ADVANCED |
| medicalConditions | string\[\] | ❌ | Optional |
| bio | string | ❌ | Maximum 500 characters |

Only the fields that need to be updated should be included in the request body.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Client profile updated successfully.",  
  "data": {  
    "id": "client\_687ab12cd34ef56789012345",  
    "height": 178,  
    "weight": 70,  
    "fitnessGoal": "MUSCLE\_GAIN",  
    "activityLevel": "VERY\_ACTIVE",  
    "experienceLevel": "INTERMEDIATE",  
    "medicalConditions": \[  
      "Asthma"  
    \],  
    "bio": "Training for strength and muscle gain.",  
    "updatedAt": "2026-07-18T10:45:20.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "weight",  
      "message": "Weight must be greater than 0."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Client role can update a client profile. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 404 | CLIENT\_PROFILE\_NOT\_FOUND | Client profile has not been created yet. |

---

### **Notes**

* Only the authenticated user's client profile can be updated.  
* Only the fields included in the request are updated.  
* The associated User account information (email, password, role) cannot be modified through this endpoint.  
* Height and weight updates may affect future workout and nutrition recommendations.  
* Profile updates are reflected immediately.  
* Every profile update is recorded in the audit log.

---

# **Upload Client Avatar**

POST /api/v1/client-profiles/me/avatar

### **Description**

Uploads or replaces the authenticated client's profile avatar.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: multipart/form-data

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| avatar | File | ✅ | JPG, JPEG, PNG, WEBP |
| cropX | number | ❌ | Greater than or equal to 0 |
| cropY | number | ❌ | Greater than or equal to 0 |
| cropWidth | number | ❌ | Greater than 0 |
| cropHeight | number | ❌ | Greater than 0 |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Profile avatar uploaded successfully.",  
  "data": {  
    "avatarUrl": "https://cdn.kizunafit.com/client-profiles/avatars/avatar\_687ab12cd34ef56789012345.webp",  
    "uploadedAt": "2026-07-18T11:30:45.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "avatar",  
      "message": "Only JPG, JPEG, PNG, and WEBP images are allowed."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Client role can upload a profile avatar. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CLIENT\_PROFILE\_NOT\_FOUND | Client profile has not been created yet. |
| 413 | FILE\_TOO\_LARGE | Uploaded file exceeds the maximum allowed size. |
| 415 | UNSUPPORTED\_FILE\_TYPE | Uploaded file type is not supported. |

---

### **Notes**

* Only one avatar can exist at a time.  
* Uploading a new avatar automatically replaces the existing avatar.  
* Images may be cropped and optimized before storage.  
* Only image files are accepted.  
* The uploaded image is securely stored and linked to the authenticated client's profile.  
* The avatar URL returned by this endpoint should be used when displaying the client's profile image.  
* Avatar uploads are recorded in the audit log.

---

# **Delete Client Avatar**

DELETE /api/v1/client-profiles/me/avatar

### **Description**

Deletes the authenticated client's profile avatar. If an avatar exists, it is removed from the client's profile.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Profile avatar deleted successfully.",  
  "data": {  
    "avatarDeleted": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Client role can delete a profile avatar. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CLIENT\_PROFILE\_NOT\_FOUND | Client profile has not been created yet. |
| 404 | AVATAR\_NOT\_FOUND | No profile avatar exists to delete. |

---

### **Notes**

* Only the authenticated client can delete their own profile avatar.  
* Deleting the avatar removes the image association from the client profile.  
* The profile remains active after the avatar is deleted.  
* A default avatar or placeholder image may be displayed by the client application after deletion.  
* The deleted avatar cannot be recovered.  
* Avatar deletion is recorded in the audit log.

---

---

 

## **TrainerProfile.api.md**

---

# **Create Trainer Profile**

POST /api/v1/trainer-profiles

### **Description**

Creates the authenticated user's trainer profile. A user can create only one trainer profile.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "headline": "Certified Calisthenics Coach",  
  "bio": "Helping people build strength and mobility through bodyweight training.",  
  "experienceYears": 5,  
  "specializations": \[  
    "CALISTHENICS",  
    "WEIGHT\_LOSS"  
  \],  
  "languages": \[  
    "English",  
    "Malayalam"  
  \],  
  "consultationFee": 500,  
  "consultationDuration": 60  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| headline | string | ✅ | 5–100 characters |
| bio | string | ✅ | Maximum 1000 characters |
| experienceYears | number | ✅ | Greater than or equal to 0 |
| specializations | string\[\] | ✅ | At least one specialization |
| languages | string\[\] | ✅ | At least one language |
| consultationFee | number | ✅ | Greater than or equal to 0 |
| consultationDuration | number | ✅ | Greater than 0 (minutes) |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Trainer profile created successfully.",  
  "data": {  
    "id": "trainer\_687ab12cd34ef56789012345",  
    "userId": "687ab12cd34ef56789012345",  
    "verificationStatus": "PENDING",  
    "availability": "OFFLINE",  
    "rating": 0,  
    "totalReviews": 0,  
    "createdAt": "2026-07-18T12:45:30.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "specializations",  
      "message": "At least one specialization is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can create a trainer profile. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 409 | TRAINER\_PROFILE\_ALREADY\_EXISTS | Trainer profile already exists for this user. |

---

### **Notes**

* A user can create only one trainer profile.  
* Only users with the **Trainer** role can access this endpoint.  
* Every newly created trainer profile starts with a **PENDING** verification status.  
* Trainers cannot offer coaching services until their profile is approved by the platform.  
* Certifications and showcase items are managed through their dedicated APIs.  
* Availability can be managed using the **Update Trainer Availability** API.  
* Trainer profile creation is recorded in the audit log.

---

# **Get Trainer Profile**

GET /api/v1/trainer-profiles/me

### **Description**

Retrieves the authenticated trainer's profile.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer profile retrieved successfully.",  
  "data": {  
    "id": "trainer\_687ab12cd34ef56789012345",  
    "userId": "687ab12cd34ef56789012345",  
    "headline": "Certified Calisthenics Coach",  
    "bio": "Helping people build strength and mobility through bodyweight training.",  
    "experienceYears": 5,  
    "specializations": \[  
      "CALISTHENICS",  
      "WEIGHT\_LOSS"  
    \],  
    "languages": \[  
      "English",  
      "Malayalam"  
    \],  
    "consultationFee": 500,  
    "consultationDuration": 60,  
    "verificationStatus": "APPROVED",  
    "availability": "ONLINE",  
    "rating": 4.9,  
    "totalReviews": 128,  
    "totalClients": 84,  
    "avatarUrl": "https://cdn.kizunafit.com/trainer-profiles/avatars/avatar.webp",  
    "createdAt": "2026-07-18T12:45:30.000Z",  
    "updatedAt": "2026-07-20T09:15:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can access this endpoint. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |

---

### **Notes**

* Returns only the authenticated trainer's profile.  
* Only users with the **Trainer** role can access this endpoint.  
* Public profile information may differ from the authenticated profile.  
* Certification details, showcase items, and availability information are included only if they exist.  
* Sensitive internal information is never exposed.  
* Used to populate the trainer dashboard and profile settings.  
* Profile retrieval is logged for auditing when required.

---

# **Update Trainer Profile**

PATCH /api/v1/trainer-profiles/me

### **Description**

Updates the authenticated trainer's profile information.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "headline": "Certified Strength & Calisthenics Coach",  
  "bio": "Helping people achieve sustainable fitness through personalized coaching.",  
  "experienceYears": 6,  
  "specializations": \[  
    "CALISTHENICS",  
    "STRENGTH\_TRAINING"  
  \],  
  "languages": \[  
    "English",  
    "Malayalam",  
    "Hindi"  
  \],  
  "consultationFee": 700,  
  "consultationDuration": 60  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| headline | string | ❌ | 5–100 characters |
| bio | string | ❌ | Maximum 1000 characters |
| experienceYears | number | ❌ | Greater than or equal to 0 |
| specializations | string\[\] | ❌ | At least one specialization if provided |
| languages | string\[\] | ❌ | At least one language if provided |
| consultationFee | number | ❌ | Greater than or equal to 0 |
| consultationDuration | number | ❌ | Greater than 0 (minutes) |

Only the fields that need to be updated should be included in the request body.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer profile updated successfully.",  
  "data": {  
    "id": "trainer\_687ab12cd34ef56789012345",  
    "headline": "Certified Strength & Calisthenics Coach",  
    "bio": "Helping people achieve sustainable fitness through personalized coaching.",  
    "experienceYears": 6,  
    "specializations": \[  
      "CALISTHENICS",  
      "STRENGTH\_TRAINING"  
    \],  
    "languages": \[  
      "English",  
      "Malayalam",  
      "Hindi"  
    \],  
    "consultationFee": 700,  
    "consultationDuration": 60,  
    "updatedAt": "2026-07-20T11:35:12.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "consultationFee",  
      "message": "Consultation fee must be greater than or equal to 0."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can update a trainer profile. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | USER\_NOT\_FOUND | Authenticated user does not exist. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 409 | PROFILE\_UNDER\_VERIFICATION | Trainer profile cannot be updated while verification is in progress. |

---

### **Notes**

* Only the authenticated trainer can update their profile.  
* Only the fields included in the request are updated.  
* Updating profile information does not affect the trainer's existing clients or coaching relationships.  
* Significant changes may require profile re-verification depending on platform policies.  
* Certifications, avatar, availability, and showcase items are managed through their respective APIs.  
* All profile updates are recorded in the audit log.

---

# **Get Trainers**

GET /api/v1/trainer-profiles

### **Description**

Retrieves a paginated list of publicly visible trainer profiles. Supports searching, filtering, and sorting to help clients discover trainers.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| search | string | ❌ | Search by trainer name or headline |
| specialization | string | ❌ | Filter by specialization |
| experienceLevel | string | ❌ | Filter by experience level |
| minRating | number | ❌ | Minimum average rating |
| availability | string | ❌ | ONLINE, OFFLINE |
| verified | boolean | ❌ | Show only verified trainers |
| sort | string | ❌ | rating, experience, newest, consultationFee |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer profiles retrieved successfully.",  
  "data": {  
    "trainers": \[  
      {  
        "id": "trainer\_687ab12cd34ef56789012345",  
        "fullName": "Mohammed Nihal K",  
        "headline": "Certified Calisthenics Coach",  
        "avatarUrl": "https://cdn.kizunafit.com/trainer/avatar.webp",  
        "specializations": \[  
          "CALISTHENICS",  
          "WEIGHT\_LOSS"  
        \],  
        "experienceYears": 5,  
        "consultationFee": 500,  
        "rating": 4.9,  
        "totalReviews": 128,  
        "availability": "ONLINE",  
        "verificationStatus": "APPROVED"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 125,  
      "totalPages": 13  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "page",  
      "message": "Page must be greater than 0."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 400 | INVALID\_FILTER | One or more filter values are invalid. |

---

### **Notes**

* This endpoint is publicly accessible.  
* Only trainers with **APPROVED** verification status are returned.  
* Suspended, banned, or hidden trainer profiles are excluded.  
* Supports pagination, searching, filtering, and sorting.  
* Results are ordered according to the selected sort option.  
* Only public profile information is returned.

---

# **Get Trainer Profile**

GET /api/v1/trainer-profiles/:trainerId

### **Description**

Retrieves the public profile of a specific trainer by their unique identifier.

### **Authentication**

Public

---

### **Headers**

Content-Type: application/json

---

### **Path Parameters**

{  
  "trainerId": "trainer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| trainerId | string | ✅ | Valid Trainer Profile ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer profile retrieved successfully.",  
  "data": {  
    "id": "trainer\_687ab12cd34ef56789012345",  
    "fullName": "Mohammed Nihal K",  
    "headline": "Certified Calisthenics Coach",  
    "bio": "Helping people build strength and mobility through bodyweight training.",  
    "avatarUrl": "https://cdn.kizunafit.com/trainer/avatar.webp",  
    "experienceYears": 5,  
    "specializations": \[  
      "CALISTHENICS",  
      "WEIGHT\_LOSS"  
    \],  
    "languages": \[  
      "English",  
      "Malayalam"  
    \],  
    "consultationFee": 500,  
    "consultationDuration": 60,  
    "rating": 4.9,  
    "totalReviews": 128,  
    "totalClients": 84,  
    "availability": "ONLINE",  
    "verificationStatus": "APPROVED",  
    "showcase": \[  
      {  
        "title": "12 Week Fat Loss Transformation",  
        "thumbnailUrl": "https://cdn.kizunafit.com/showcase/1.webp"  
      }  
    \]  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "trainerId",  
      "message": "Invalid trainer profile ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile does not exist. |
| 404 | TRAINER\_NOT\_AVAILABLE | Trainer profile is no longer publicly available. |

---

### **Notes**

* This endpoint is publicly accessible.  
* Only trainers with an **APPROVED** verification status are publicly visible.  
* Sensitive information such as email, phone number, earnings, and internal verification details are never returned.  
* The profile includes only information intended for public viewing.  
* Suspended, banned, or hidden trainer profiles cannot be accessed.  
* This endpoint is typically used when a client views a trainer's profile before requesting coaching or booking a consultation.

---

# **Upload Trainer Avatar**

POST /api/v1/trainer-profiles/me/avatar

### **Description**

Uploads or replaces the authenticated trainer's profile avatar.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: multipart/form-data

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| avatar | File | ✅ | JPG, JPEG, PNG, WEBP |
| cropX | number | ❌ | Greater than or equal to 0 |
| cropY | number | ❌ | Greater than or equal to 0 |
| cropWidth | number | ❌ | Greater than 0 |
| cropHeight | number | ❌ | Greater than 0 |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer avatar uploaded successfully.",  
  "data": {  
    "avatarUrl": "https://cdn.kizunafit.com/trainer-profiles/avatars/avatar\_687ab12cd34ef56789012345.webp",  
    "uploadedAt": "2026-07-20T15:45:12.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "avatar",  
      "message": "Only JPG, JPEG, PNG, and WEBP images are allowed."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can upload a trainer avatar. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 413 | FILE\_TOO\_LARGE | Uploaded file exceeds the maximum allowed size. |
| 415 | UNSUPPORTED\_FILE\_TYPE | Uploaded file type is not supported. |

---

### **Notes**

* Only the authenticated trainer can upload their profile avatar.  
* Uploading a new avatar automatically replaces the existing avatar.  
* Images may be cropped and optimized before storage.  
* Only image files are accepted.  
* The uploaded avatar becomes immediately visible on the trainer's public profile.  
* The previous avatar is permanently removed after a successful upload.  
* Avatar uploads are recorded in the audit log.

---

# **Delete Trainer Avatar**

DELETE /api/v1/trainer-profiles/me/avatar

### **Description**

Deletes the authenticated trainer's profile avatar. If an avatar exists, it is removed from the trainer's profile.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer avatar deleted successfully.",  
  "data": {  
    "avatarDeleted": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can delete a trainer avatar. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 404 | AVATAR\_NOT\_FOUND | No trainer avatar exists to delete. |

---

### **Notes**

* Only the authenticated trainer can delete their own profile avatar.  
* Deleting the avatar removes the image association from the trainer profile.  
* A default avatar or placeholder image may be displayed until a new avatar is uploaded.  
* Deleting the avatar does not affect the trainer's verification status.  
* The deleted avatar cannot be recovered.  
* Avatar deletion is recorded in the audit log.

---

 **Get Trainer Availability**  
GET /api/v1/trainer-profiles/me/availability

### **Description**

Retrieves the authenticated trainer's current availability settings for consultations and coaching sessions.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer availability retrieved successfully.",  
  "data": {  
    "status": "ONLINE",  
    "weeklySchedule": \[  
      {  
        "day": "MONDAY",  
        "available": true,  
        "slots": \[  
          {  
            "startTime": "09:00",  
            "endTime": "12:00"  
          },  
          {  
            "startTime": "14:00",  
            "endTime": "18:00"  
          }  
        \]  
      },  
      {  
        "day": "TUESDAY",  
        "available": true,  
        "slots": \[  
          {  
            "startTime": "10:00",  
            "endTime": "16:00"  
          }  
        \]  
      }  
    \],  
    "timezone": "Asia/Kolkata",  
    "updatedAt": "2026-07-20T17:10:45.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can access availability settings. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |

---

### **Notes**

* Returns only the authenticated trainer's availability settings.  
* Availability determines when clients can book consultations.  
* Time slots are returned in the trainer's configured timezone.  
* Only active availability slots are included.  
* Availability can be modified using the **Update Trainer Availability** API.  
* This endpoint is commonly used by the trainer dashboard and scheduling interface.

---

# **Update Trainer Availability**

PATCH /api/v1/trainer-profiles/me/availability

### **Description**

Updates the authenticated trainer's availability status, working schedule, and consultation time slots.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "status": "ONLINE",  
  "timezone": "Asia/Kolkata",  
  "weeklySchedule": \[  
    {  
      "day": "MONDAY",  
      "available": true,  
      "slots": \[  
        {  
          "startTime": "09:00",  
          "endTime": "12:00"  
        },  
        {  
          "startTime": "14:00",  
          "endTime": "18:00"  
        }  
      \]  
    },  
    {  
      "day": "TUESDAY",  
      "available": true,  
      "slots": \[  
        {  
          "startTime": "10:00",  
          "endTime": "16:00"  
        }  
      \]  
    }  
  \]  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| status | enum | ✅ | ONLINE, OFFLINE |
| timezone | string | ✅ | Valid IANA timezone |
| weeklySchedule | array | ✅ | Weekly availability schedule |
| weeklySchedule\[\].day | enum | ✅ | MONDAY \- SUNDAY |
| weeklySchedule\[\].available | boolean | ✅ | Availability for the day |
| weeklySchedule\[\].slots | array | ❌ | One or more time slots |
| weeklySchedule\[\].slots\[\].startTime | string | ✅ | HH:mm (24-hour format) |
| weeklySchedule\[\].slots\[\].endTime | string | ✅ | HH:mm (24-hour format) |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer availability updated successfully.",  
  "data": {  
    "status": "ONLINE",  
    "timezone": "Asia/Kolkata",  
    "updatedAt": "2026-07-20T18:15:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "weeklySchedule\[0\].slots\[0\].endTime",  
      "message": "End time must be later than start time."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can update availability. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 409 | OVERLAPPING\_TIME\_SLOTS | Availability contains overlapping time slots. |
| 409 | INVALID\_AVAILABILITY\_SCHEDULE | The provided schedule is invalid. |

---

### **Notes**

* Only the authenticated trainer can update their availability.  
* Updating availability immediately affects future consultation bookings.  
* Existing confirmed consultations are not modified.  
* Time slots cannot overlap within the same day.  
* All times are interpreted using the specified timezone.  
* Setting the status to `OFFLINE` prevents new consultation bookings while preserving the configured schedule.  
* Availability updates are recorded in the audit log.

---

# **Add Trainer Certification**

POST /api/v1/trainer-profiles/me/certifications

### **Description**

Uploads and adds a professional certification to the authenticated trainer's profile. Certifications are submitted for verification and become publicly visible only after approval.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: multipart/form-data

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ✅ | 3–100 characters |
| issuingOrganization | string | ✅ | 3–100 characters |
| certificateNumber | string | ❌ | Maximum 100 characters |
| issueDate | date | ✅ | Valid past date |
| expiryDate | date | ❌ | Must be later than issueDate |
| credentialUrl | string | ❌ | Valid URL |
| certificate | File | ✅ | PDF, JPG, JPEG, PNG (Max allowed size) |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Certification added successfully.",  
  "data": {  
    "certificationId": "cert\_687ab12cd34ef56789012345",  
    "verificationStatus": "PENDING",  
    "createdAt": "2026-07-20T18:45:12.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "certificate",  
      "message": "Certificate document is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can add certifications. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 409 | CERTIFICATION\_ALREADY\_EXISTS | A certification with the same certificate number already exists. |
| 413 | FILE\_TOO\_LARGE | Uploaded certificate exceeds the maximum allowed size. |
| 415 | UNSUPPORTED\_FILE\_TYPE | Uploaded file type is not supported. |

---

### **Notes**

* Only the authenticated trainer can add certifications.  
* Every newly added certification starts with a **PENDING** verification status.  
* Certifications become publicly visible only after platform approval.  
* Certificate documents are securely stored.  
* Trainers may upload multiple certifications.  
* Certification uploads are recorded in the audit log.

---

# **Update Trainer Certification**

PATCH /api/v1/trainer-profiles/me/certifications/:certificationId

### **Description**

Updates an existing certification belonging to the authenticated trainer. Trainers can update certification details or replace the certificate document before it has been verified.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: multipart/form-data

---

### **Path Parameters**

{  
  "certificationId": "cert\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| certificationId | string | ✅ | Valid Certification ID |

---

### **Query Parameters**

None

---

### **Request Body**

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ❌ | 3–100 characters |
| issuingOrganization | string | ❌ | 3–100 characters |
| certificateNumber | string | ❌ | Maximum 100 characters |
| issueDate | date | ❌ | Valid past date |
| expiryDate | date | ❌ | Must be later than issueDate |
| credentialUrl | string | ❌ | Valid URL |
| certificate | File | ❌ | PDF, JPG, JPEG, PNG (Max allowed size) |

Only the fields that need to be updated should be included in the request.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Certification updated successfully.",  
  "data": {  
    "certificationId": "cert\_687ab12cd34ef56789012345",  
    "verificationStatus": "PENDING",  
    "updatedAt": "2026-07-20T19:20:45.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "expiryDate",  
      "message": "Expiry date must be later than the issue date."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can update certifications. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 404 | CERTIFICATION\_NOT\_FOUND | Certification does not exist or does not belong to the authenticated trainer. |
| 409 | CERTIFICATION\_ALREADY\_VERIFIED | Verified certifications cannot be modified. |
| 413 | FILE\_TOO\_LARGE | Uploaded certificate exceeds the maximum allowed size. |
| 415 | UNSUPPORTED\_FILE\_TYPE | Uploaded file type is not supported. |

---

### **Notes**

* Only the authenticated trainer can update their certifications.  
* Only pending or rejected certifications can be modified.  
* Updating a rejected certification resets its verification status to **PENDING** for re-review.  
* Replacing the certificate document permanently removes the previous document.  
* Verified certifications are immutable and require adding a new certification instead.  
* Certification updates are recorded in the audit log.

---

# **Delete Trainer Certification**

DELETE /api/v1/trainer-profiles/me/certifications/:certificationId

### **Description**

Deletes a certification belonging to the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "certificationId": "cert\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| certificationId | string | ✅ | Valid Certification ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Certification deleted successfully.",  
  "data": {  
    "certificationId": "cert\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can delete certifications. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 404 | CERTIFICATION\_NOT\_FOUND | Certification does not exist or does not belong to the authenticated trainer. |
| 409 | CERTIFICATION\_IN\_USE | Certification cannot be deleted because it is currently being used in an active verification process. |

---

### **Notes**

* Only the authenticated trainer can delete their own certifications.  
* Pending, rejected, or expired certifications can be deleted.  
* Certifications under active verification cannot be deleted until the review process is completed.  
* Deleting a certification permanently removes its associated document from storage.  
* Deleted certifications cannot be recovered.  
* Certification deletion is recorded in the audit log.

---

# **Add Showcase Item**

POST /api/v1/trainer-profiles/me/showcase

### **Description**

Adds a new showcase item to the authenticated trainer's public profile. Showcase items highlight achievements, client transformations, certifications, videos, or portfolio content.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: multipart/form-data

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ✅ | 3–100 characters |
| description | string | ❌ | Maximum 1000 characters |
| type | enum | ✅ | IMAGE, VIDEO, CERTIFICATE, TRANSFORMATION |
| media | File | ✅ | Supported image/video formats |
| thumbnail | File | ❌ | Required for videos |
| displayOrder | number | ❌ | Greater than or equal to 1 |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Showcase item added successfully.",  
  "data": {  
    "showcaseItemId": "showcase\_687ab12cd34ef56789012345",  
    "title": "12 Week Body Transformation",  
    "type": "IMAGE",  
    "createdAt": "2026-07-20T20:10:35.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "title",  
      "message": "Title is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can manage showcase items. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 413 | FILE\_TOO\_LARGE | Uploaded media exceeds the maximum allowed size. |
| 415 | UNSUPPORTED\_FILE\_TYPE | Uploaded media type is not supported. |

---

### **Notes**

* Only the authenticated trainer can add showcase items.  
* Multiple showcase items can be added.  
* Uploaded media is optimized before storage.  
* Showcase items become immediately visible on the trainer's public profile.  
* Images and videos are securely stored.  
* Display order determines the presentation sequence on the public profile.  
* Showcase uploads are recorded in the audit log.

---

# **Get Showcase Items**

GET /api/v1/trainer-profiles/me/showcase

### **Description**

Retrieves all showcase items belonging to the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of showcase items per page (Default: 10\) |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Showcase items retrieved successfully.",  
  "data": {  
    "items": \[  
      {  
        "showcaseItemId": "showcase\_687ab12cd34ef56789012345",  
        "title": "12 Week Body Transformation",  
        "description": "Client transformation after 12 weeks.",  
        "type": "IMAGE",  
        "mediaUrl": "https://cdn.kizunafit.com/showcase/image1.webp",  
        "thumbnailUrl": null,  
        "displayOrder": 1,  
        "createdAt": "2026-07-20T20:10:35.000Z"  
      },  
      {  
        "showcaseItemId": "showcase\_687ab12cd34ef56789012346",  
        "title": "Mobility Training Demo",  
        "description": "Short exercise demonstration.",  
        "type": "VIDEO",  
        "mediaUrl": "https://cdn.kizunafit.com/showcase/video1.mp4",  
        "thumbnailUrl": "https://cdn.kizunafit.com/showcase/thumb1.webp",  
        "displayOrder": 2,  
        "createdAt": "2026-07-19T14:25:10.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 2,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can access showcase items. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |

---

### **Notes**

* Returns only the authenticated trainer's showcase items.  
* Showcase items are ordered by `displayOrder`.  
* Supports pagination.  
* Media URLs are returned for display purposes.  
* Deleted showcase items are not included.  
* Used by the trainer dashboard to manage portfolio content.

---

# **Update Showcase Item**

PATCH /api/v1/trainer-profiles/me/showcase/:itemId

### **Description**

Updates an existing showcase item belonging to the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: multipart/form-data

---

### **Path Parameters**

{  
  "itemId": "showcase\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| itemId | string | ✅ | Valid Showcase Item ID |

---

### **Query Parameters**

None

---

### **Request Body**

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ❌ | 3–100 characters |
| description | string | ❌ | Maximum 1000 characters |
| type | enum | ❌ | IMAGE, VIDEO, CERTIFICATE, TRANSFORMATION |
| media | File | ❌ | Supported image/video formats |
| thumbnail | File | ❌ | Required when replacing a video thumbnail |
| displayOrder | number | ❌ | Greater than or equal to 1 |

Only the fields that need to be updated should be included in the request.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Showcase item updated successfully.",  
  "data": {  
    "showcaseItemId": "showcase\_687ab12cd34ef56789012345",  
    "updatedAt": "2026-07-20T20:45:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "displayOrder",  
      "message": "Display order must be greater than or equal to 1."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can update showcase items. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 404 | SHOWCASE\_ITEM\_NOT\_FOUND | Showcase item does not exist or does not belong to the authenticated trainer. |
| 413 | FILE\_TOO\_LARGE | Uploaded media exceeds the maximum allowed size. |
| 415 | UNSUPPORTED\_FILE\_TYPE | Uploaded media type is not supported. |

---

### **Notes**

* Only the authenticated trainer can update their showcase items.  
* Only the fields included in the request are updated.  
* Replacing media permanently removes the previous media file.  
* Updating the display order automatically reorders showcase items if necessary.  
* Changes become visible immediately on the trainer's public profile.  
* Showcase item updates are recorded in the audit log.

---

# **Delete Showcase Item**

DELETE /api/v1/trainer-profiles/me/showcase/:itemId

### **Description**

Deletes a showcase item belonging to the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "itemId": "showcase\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| itemId | string | ✅ | Valid Showcase Item ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Showcase item deleted successfully.",  
  "data": {  
    "showcaseItemId": "showcase\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Trainer role can delete showcase items. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_PROFILE\_NOT\_FOUND | Trainer profile has not been created yet. |
| 404 | SHOWCASE\_ITEM\_NOT\_FOUND | Showcase item does not exist or does not belong to the authenticated trainer. |

---

### **Notes**

* Only the authenticated trainer can delete their own showcase items.  
* Deleting a showcase item permanently removes its associated media from storage.  
* Deleted showcase items are immediately removed from the trainer's public profile.  
* Display order of the remaining showcase items is automatically adjusted.  
* Deleted showcase items cannot be recovered.  
* Showcase item deletion is recorded in the audit log.

---

---

 

# **03\_Marketplace**

# **Create Trainer Request**

POST /api/v1/trainer-requests

### **Description**

Creates a new coaching request from a client to a trainer. This is the first step in establishing a coaching relationship.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "trainerId": "trainer\_687ab12cd34ef56789012345",  
  "goal": "Weight Loss",  
  "message": "I would like to lose 10kg in the next 6 months and need personalized coaching."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| trainerId | string | ✅ | Valid Trainer Profile ID |
| goal | string | ✅ | 3–100 characters |
| message | string | ❌ | Maximum 1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Trainer request sent successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "PENDING",  
    "trainerId": "trainer\_687ab12cd34ef56789012345",  
    "clientId": "client\_687ab12cd34ef56789012345",  
    "createdAt": "2026-07-21T09:30:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "trainerId",  
      "message": "Trainer ID is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only users with the Client role can send trainer requests. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_NOT\_FOUND | Trainer does not exist. |
| 404 | TRAINER\_NOT\_AVAILABLE | Trainer is currently unavailable to accept new clients. |
| 409 | REQUEST\_ALREADY\_EXISTS | A pending request already exists for this trainer. |
| 409 | ACTIVE\_COACHING\_RELATIONSHIP\_EXISTS | You already have an active coaching relationship with this trainer. |
| 422 | TRAINER\_NOT\_VERIFIED | Trainer is not approved to accept coaching requests. |

---

### **Notes**

* Only clients can create trainer requests.  
* A client cannot send a request to themselves.  
* Only trainers with **APPROVED** verification status can receive requests.  
* Only one pending request can exist between the same client and trainer.  
* Creating a trainer request does not establish a coaching relationship.  
* The trainer can later **accept** or **reject** the request.  
* Trainer request creation is recorded in the audit log.

---

# **Get Trainer Requests**

GET /api/v1/trainer-requests

### **Description**

Retrieves a paginated list of trainer requests associated with the authenticated user. Clients see requests they have sent, while trainers see requests they have received.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | PENDING, ACCEPTED, REJECTED, WITHDRAWN, CLOSED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer requests retrieved successfully.",  
  "data": {  
    "requests": \[  
      {  
        "requestId": "request\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "goal": "Weight Loss",  
        "status": "PENDING",  
        "createdAt": "2026-07-21T09:30:15.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 8,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "status",  
      "message": "Invalid request status."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only requests they have created.  
* Trainers can view only requests sent to them.  
* Results are ordered by creation date (newest first) by default.  
* Supports filtering by request status.  
* Supports pagination for efficient data retrieval.  
* Request details do not expose private account information.  
* Request retrieval is recorded for auditing when required.

---

# **Get Trainer Request**

GET /api/v1/trainer-requests/:requestId

### **Description**

Retrieves the details of a specific trainer request associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "requestId": "request\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| requestId | string | ✅ | Valid Trainer Request ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request retrieved successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "PENDING",  
    "goal": "Weight Loss",  
    "message": "I would like to lose 10kg in the next 6 months and need personalized coaching.",  
    "trainer": {  
      "id": "trainer\_687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K",  
      "headline": "Certified Calisthenics Coach",  
      "avatarUrl": "https://cdn.kizunafit.com/trainers/avatar.webp"  
    },  
    "client": {  
      "id": "client\_687ab12cd34ef56789012345",  
      "fullName": "John Doe"  
    },  
    "createdAt": "2026-07-21T09:30:15.000Z",  
    "updatedAt": "2026-07-21T09:30:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "requestId",  
      "message": "Invalid trainer request ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this trainer request. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |

---

### **Notes**

* Clients can retrieve only requests they have created.  
* Trainers can retrieve only requests addressed to them.  
* The response includes the current request status.  
* Private account information is never exposed.  
* Request history is immutable and cannot be modified through this endpoint.  
* This endpoint is commonly used before accepting, rejecting, withdrawing, or closing a trainer request.

---

 **Get Pending Trainer Requests**  
GET /api/v1/trainer-requests/pending

### **Description**

Retrieves all pending trainer requests associated with the authenticated user. Clients receive pending requests they have sent, while trainers receive pending requests awaiting their response.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Pending trainer requests retrieved successfully.",  
  "data": {  
    "requests": \[  
      {  
        "requestId": "request\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "goal": "Weight Loss",  
        "status": "PENDING",  
        "createdAt": "2026-07-21T09:30:15.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 3,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only requests with the **PENDING** status.  
* Clients receive pending requests they have submitted.  
* Trainers receive pending requests awaiting their decision.  
* Results are sorted by creation date (newest first) by default.  
* Supports pagination.  
* Used to power the **Pending Requests** section of the client and trainer dashboards.

---

# **Get Trainer Request History**

GET /api/v1/trainer-requests/history

### **Description**

Retrieves the history of completed trainer requests associated with the authenticated user. This includes requests that have been accepted, rejected, withdrawn, or closed.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | ACCEPTED, REJECTED, WITHDRAWN, CLOSED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request history retrieved successfully.",  
  "data": {  
    "requests": \[  
      {  
        "requestId": "request\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "goal": "Weight Loss",  
        "status": "ACCEPTED",  
        "respondedAt": "2026-07-22T10:15:40.000Z",  
        "createdAt": "2026-07-21T09:30:15.000Z"  
      },  
      {  
        "requestId": "request\_687ab12cd34ef56789012346",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012346",  
          "fullName": "Sarah Wilson"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "goal": "Muscle Gain",  
        "status": "REJECTED",  
        "respondedAt": "2026-07-18T14:20:15.000Z",  
        "createdAt": "2026-07-17T11:45:10.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 18,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "status",  
      "message": "Invalid request status."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only completed trainer requests.  
* Pending requests are not included in the history.  
* Clients can view only their own request history.  
* Trainers can view only requests they have received.  
* Supports filtering by request outcome.  
* Results are sorted by the most recently completed requests first.  
* Used for historical tracking and reporting.

---

# **Accept Trainer Request**

POST /api/v1/trainer-requests/:requestId/accept

### **Description**

Accepts a pending trainer request. Upon acceptance, the request status is updated, and the coaching workflow proceeds to the consultation stage.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "requestId": "request\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| requestId | string | ✅ | Valid Trainer Request ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request accepted successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "ACCEPTED",  
    "acceptedAt": "2026-07-22T10:15:40.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the requested trainer can accept this request. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |
| 409 | REQUEST\_ALREADY\_PROCESSED | Trainer request has already been accepted, rejected, withdrawn, or closed. |
| 409 | TRAINER\_NOT\_AVAILABLE | Trainer is currently unavailable to accept new clients. |

---

### **Notes**

* Only the trainer who received the request can accept it.  
* Only requests with the **PENDING** status can be accepted.  
* Accepting a request is irreversible.  
* Once accepted, the client can proceed to schedule the consultation.  
* The client is notified immediately after acceptance.  
* The acceptance event is recorded in the audit log.

---

 **Reject Trainer Request**  
POST /api/v1/trainer-requests/:requestId/reject

### **Description**

Rejects a pending trainer request. The request is marked as rejected, and no coaching relationship or consultation can be created from it.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "requestId": "request\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| requestId | string | ✅ | Valid Trainer Request ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "My coaching slots are currently full."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ❌ | Maximum 500 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request rejected successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "REJECTED",  
    "rejectedAt": "2026-07-22T10:25:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Reason cannot exceed 500 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the requested trainer can reject this request. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |
| 409 | REQUEST\_ALREADY\_PROCESSED | Trainer request has already been accepted, rejected, withdrawn, or closed. |

---

### **Notes**

* Only the trainer who received the request can reject it.  
* Only requests with the **PENDING** status can be rejected.  
* Providing a rejection reason is optional but recommended.  
* Rejecting a request does not prevent the client from sending a future request.  
* The client is notified immediately after the request is rejected.  
* The rejection event is recorded in the audit log.

---

# **Withdraw Trainer Request**

POST /api/v1/trainer-requests/:requestId/withdraw

### **Description**

Withdraws a pending trainer request previously submitted by the authenticated client. Once withdrawn, the trainer can no longer respond to the request.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "requestId": "request\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| requestId | string | ✅ | Valid Trainer Request ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request withdrawn successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "WITHDRAWN",  
    "withdrawnAt": "2026-07-22T11:05:30.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who created the request can withdraw it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |
| 409 | REQUEST\_ALREADY\_PROCESSED | Trainer request has already been accepted, rejected, withdrawn, or closed. |

---

### **Notes**

* Only the client who created the request can withdraw it.  
* Only requests with the **PENDING** status can be withdrawn.  
* Withdrawing a request prevents the trainer from accepting or rejecting it.  
* A withdrawn request cannot be restored.  
* The client may submit a new trainer request to the same trainer in the future.  
* The trainer is notified when a request is withdrawn.  
* The withdrawal event is recorded in the audit log.

---

# **Close Trainer Request**

POST /api/v1/trainer-requests/:requestId/close

### **Description**

Closes an accepted trainer request after the acquisition process has been completed. This marks the request as finalized and prevents any further actions on it.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "requestId": "request\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| requestId | string | ✅ | Valid Trainer Request ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request closed successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "CLOSED",  
    "closedAt": "2026-07-22T15:30:45.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the assigned trainer can close this request. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |
| 409 | REQUEST\_NOT\_ACCEPTED | Only accepted trainer requests can be closed. |
| 409 | REQUEST\_ALREADY\_CLOSED | Trainer request has already been closed. |

---

### **Notes**

* Only the trainer who accepted the request can close it.  
* Only requests with the **ACCEPTED** status can be closed.  
* Closing a request finalizes the acquisition process.  
* A closed request is read-only and cannot transition to another state.  
* Closing a request does not terminate an active coaching relationship if one has already been created.  
* The client is notified when the request is closed.  
* The closure event is recorded in the audit log.

---

# **Close Trainer Request**

POST /api/v1/trainer-requests/:requestId/close

### **Description**

Closes an accepted trainer request after the acquisition process has been completed. This marks the request as finalized and prevents any further actions on it.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "requestId": "request\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| requestId | string | ✅ | Valid Trainer Request ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer request closed successfully.",  
  "data": {  
    "requestId": "request\_687ab12cd34ef56789012345",  
    "status": "CLOSED",  
    "closedAt": "2026-07-22T15:30:45.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the assigned trainer can close this request. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |
| 409 | REQUEST\_NOT\_ACCEPTED | Only accepted trainer requests can be closed. |
| 409 | REQUEST\_ALREADY\_CLOSED | Trainer request has already been closed. |

---

### **Notes**

* Only the trainer who accepted the request can close it.  
* Only requests with the **ACCEPTED** status can be closed.  
* Closing a request finalizes the acquisition process.  
* A closed request is read-only and cannot transition to another state.  
* Closing a request does not terminate an active coaching relationship if one has already been created.  
* The client is notified when the request is closed.  
* The closure event is recorded in the audit log.

---

---

 

# 04\_Consultation

# **Create Consultation**

POST /api/v1/consultations

### **Description**

Creates a new consultation between a client and a trainer after a trainer request has been accepted. This schedules the initial consultation session.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "trainerRequestId": "request\_687ab12cd34ef56789012345",  
  "scheduledAt": "2026-07-25T10:00:00.000Z",  
  "duration": 60,  
  "meetingMode": "VIDEO\_CALL",  
  "notes": "Initial fitness assessment and goal discussion."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| trainerRequestId | string | ✅ | Valid accepted Trainer Request ID |
| scheduledAt | datetime | ✅ | Must be a future date and time |
| duration | number | ✅ | Greater than 0 (minutes) |
| meetingMode | enum | ✅ | VIDEO\_CALL, PHONE\_CALL |
| notes | string | ❌ | Maximum 1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Consultation scheduled successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "status": "SCHEDULED",  
    "scheduledAt": "2026-07-25T10:00:00.000Z",  
    "duration": 60,  
    "meetingMode": "VIDEO\_CALL",  
    "createdAt": "2026-07-22T16:10:20.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "scheduledAt",  
      "message": "Consultation must be scheduled in the future."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only participants of the trainer request can schedule the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | TRAINER\_REQUEST\_NOT\_FOUND | Trainer request does not exist. |
| 404 | TRAINER\_NOT\_AVAILABLE | Trainer is unavailable for the selected time. |
| 409 | CONSULTATION\_ALREADY\_EXISTS | A consultation already exists for this trainer request. |
| 409 | TRAINER\_REQUEST\_NOT\_ACCEPTED | Consultation can only be created for an accepted trainer request. |
| 409 | TIME\_SLOT\_UNAVAILABLE | The selected consultation slot is no longer available. |

---

### **Notes**

* A consultation can only be created after a trainer request has been accepted.  
* Only one consultation can exist for a trainer request.  
* Both the trainer and client become consultation participants.  
* The scheduled time must be in the future.  
* Creating a consultation does not establish a coaching relationship.  
* Consultation participants receive notifications after successful scheduling.  
* Consultation creation is recorded in the audit log.

---

# **Get Consultations**

GET /api/v1/consultations

### **Description**

Retrieves a paginated list of consultations associated with the authenticated user. Clients see their booked consultations, while trainers see consultations assigned to them.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | SCHEDULED, CONFIRMED, COMPLETED, CANCELLED |
| sort | string | ❌ | upcoming, newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultations retrieved successfully.",  
  "data": {  
    "consultations": \[  
      {  
        "consultationId": "consultation\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "scheduledAt": "2026-07-25T10:00:00.000Z",  
        "duration": 60,  
        "meetingMode": "VIDEO\_CALL",  
        "status": "SCHEDULED"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 12,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "status",  
      "message": "Invalid consultation status."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their own consultations.  
* Trainers can view only consultations assigned to them.  
* Supports pagination, filtering, and sorting.  
* Results are sorted by scheduled date by default.  
* Only authorized participants can access consultation information.  
* Consultation retrieval is recorded for auditing when required.

---

# **Get Consultation**

GET /api/v1/consultations/:consultationId

### **Description**

Retrieves the details of a specific consultation associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation retrieved successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "trainer": {  
      "id": "trainer\_687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K"  
    },  
    "client": {  
      "id": "client\_687ab12cd34ef56789012345",  
      "fullName": "John Doe"  
    },  
    "trainerRequestId": "request\_687ab12cd34ef56789012345",  
    "scheduledAt": "2026-07-25T10:00:00.000Z",  
    "duration": 60,  
    "meetingMode": "VIDEO\_CALL",  
    "status": "SCHEDULED",  
    "notes": "Initial fitness assessment and goal discussion.",  
    "createdAt": "2026-07-22T16:10:20.000Z",  
    "updatedAt": "2026-07-22T16:10:20.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "consultationId",  
      "message": "Invalid consultation ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |

---

### **Notes**

* Only the trainer and client participating in the consultation can access its details.  
* Consultation information is read-only through this endpoint.  
* Meeting details are returned only to authorized participants.  
* Private account information is never exposed.  
* This endpoint is commonly used before confirming, updating, joining, or cancelling a consultation.  
* Consultation retrieval is recorded in the audit log.

---

 **Update Consultation**  
PATCH /api/v1/consultations/:consultationId

### **Description**

Updates the scheduled consultation details. Only future consultations that have not yet been completed or cancelled can be updated.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "scheduledAt": "2026-07-26T14:00:00.000Z",  
  "duration": 90,  
  "meetingMode": "VIDEO\_CALL",  
  "notes": "Rescheduled due to trainer availability."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| scheduledAt | datetime | ❌ | Must be a future date and time |
| duration | number | ❌ | Greater than 0 (minutes) |
| meetingMode | enum | ❌ | VIDEO\_CALL, PHONE\_CALL |
| notes | string | ❌ | Maximum 1000 characters |

Only the fields that need to be updated should be included in the request body.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation updated successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "scheduledAt": "2026-07-26T14:00:00.000Z",  
    "duration": 90,  
    "meetingMode": "VIDEO\_CALL",  
    "status": "SCHEDULED",  
    "updatedAt": "2026-07-23T09:45:18.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "scheduledAt",  
      "message": "Consultation must be scheduled in the future."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only consultation participants can update the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_ALREADY\_COMPLETED | Completed consultations cannot be updated. |
| 409 | CONSULTATION\_CANCELLED | Cancelled consultations cannot be updated. |
| 409 | TIME\_SLOT\_UNAVAILABLE | The selected time slot is unavailable. |

---

### **Notes**

* Only the trainer and client participating in the consultation can update it.  
* Only future consultations can be modified.  
* Updating the schedule checks the trainer's availability.  
* Changes are immediately visible to both participants.  
* Both participants are notified after a successful update.  
* Every consultation update is recorded in the audit log.

---

# **Confirm Consultation**

POST /api/v1/consultations/:consultationId/confirm

### **Description**

Confirms a scheduled consultation. Once confirmed, both participants have agreed to the consultation schedule, and the consultation is locked for execution.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation confirmed successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "status": "CONFIRMED",  
    "confirmedAt": "2026-07-23T10:30:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only consultation participants can confirm the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_ALREADY\_CONFIRMED | Consultation has already been confirmed. |
| 409 | CONSULTATION\_CANCELLED | Cancelled consultations cannot be confirmed. |
| 409 | CONSULTATION\_COMPLETED | Completed consultations cannot be confirmed. |

---

### **Notes**

* Either consultation participant can confirm the consultation.  
* Only consultations with the **SCHEDULED** status can be confirmed.  
* Confirming the consultation indicates that the scheduled date and time have been accepted.  
* After confirmation, rescheduling may be restricted based on platform policy.  
* Both participants receive a confirmation notification.  
* The confirmation event is recorded in the audit log.

---

# **Get Upcoming Consultations**

GET /api/v1/consultations/upcoming

### **Description**

Retrieves all upcoming consultations for the authenticated user. Only consultations that are scheduled for a future date and are not completed or cancelled are returned.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| sort | string | ❌ | nearest, farthest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Upcoming consultations retrieved successfully.",  
  "data": {  
    "consultations": \[  
      {  
        "consultationId": "consultation\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "scheduledAt": "2026-07-25T10:00:00.000Z",  
        "duration": 60,  
        "meetingMode": "VIDEO\_CALL",  
        "status": "CONFIRMED"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 4,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only future consultations.  
* Completed and cancelled consultations are excluded.  
* Clients see only their consultations.  
* Trainers see only consultations assigned to them.  
* Results are sorted by the nearest consultation by default.  
* Used by the dashboard and calendar views.

---

# **Get Consultation History**

GET /api/v1/consultations/history

### **Description**

Retrieves the consultation history of the authenticated user. Only completed and cancelled consultations are returned.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | COMPLETED, CANCELLED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation history retrieved successfully.",  
  "data": {  
    "consultations": \[  
      {  
        "consultationId": "consultation\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "scheduledAt": "2026-06-15T10:00:00.000Z",  
        "duration": 60,  
        "meetingMode": "VIDEO\_CALL",  
        "status": "COMPLETED",  
        "completedAt": "2026-06-15T11:05:30.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 18,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "status",  
      "message": "Invalid consultation status."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only completed and cancelled consultations.  
* Upcoming and scheduled consultations are excluded.  
* Clients can access only their own consultation history.  
* Trainers can access only consultations they conducted.  
* Supports pagination and status filtering.  
* Used for consultation history, reports, and review eligibility.  
* Consultation history is immutable and maintained for audit purposes.

---

# **Cancel Consultation**

POST /api/v1/consultations/:consultationId/cancel

### **Description**

Cancels a scheduled or confirmed consultation. Once cancelled, the consultation cannot be resumed and a new consultation must be created if both parties wish to meet again.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Unexpected personal emergency."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ❌ | Maximum 500 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation cancelled successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "status": "CANCELLED",  
    "cancelledAt": "2026-07-23T11:15:20.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Reason cannot exceed 500 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only consultation participants can cancel the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_ALREADY\_CANCELLED | Consultation has already been cancelled. |
| 409 | CONSULTATION\_COMPLETED | Completed consultations cannot be cancelled. |

---

### **Notes**

* Either the client or trainer can cancel the consultation.  
* Only **SCHEDULED** or **CONFIRMED** consultations can be cancelled.  
* Cancelling a consultation does not automatically cancel the trainer request or coaching relationship.  
* Both participants are notified immediately after cancellation.  
* Depending on platform policy, cancellation may affect refunds or rescheduling eligibility.  
* Cancellation events are recorded in the audit log.

---

# **Complete Consultation**

POST /api/v1/consultations/:consultationId/complete

### **Description**

Marks a consultation as completed after it has successfully taken place. Completing the consultation allows the coaching process to proceed to the coaching offer stage.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "summary": "Initial assessment completed. Client is suitable for a 12-week strength program."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| summary | string | ❌ | Maximum 2000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation completed successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "status": "COMPLETED",  
    "completedAt": "2026-07-25T11:08:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "summary",  
      "message": "Summary cannot exceed 2000 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the assigned trainer can complete the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_NOT\_CONFIRMED | Only confirmed consultations can be completed. |
| 409 | CONSULTATION\_ALREADY\_COMPLETED | Consultation has already been completed. |
| 409 | CONSULTATION\_CANCELLED | Cancelled consultations cannot be completed. |

---

### **Notes**

* Only the assigned trainer can complete the consultation.  
* Only consultations with the **CONFIRMED** status can be marked as completed.  
* Completing the consultation is irreversible.  
* After completion, the trainer can create and send a coaching offer to the client.  
* Consultation notes become part of the coaching history.  
* Both participants are notified after completion.  
* The completion event is recorded in the audit log.

---

# **Cancel Consultation**

POST /api/v1/consultations/:consultationId/cancel

### **Description**

Cancels a scheduled or confirmed consultation. Once cancelled, the consultation cannot be resumed and a new consultation must be created if both parties wish to meet again.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Unexpected personal emergency."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ❌ | Maximum 500 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation cancelled successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "status": "CANCELLED",  
    "cancelledAt": "2026-07-23T11:15:20.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Reason cannot exceed 500 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only consultation participants can cancel the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_ALREADY\_CANCELLED | Consultation has already been cancelled. |
| 409 | CONSULTATION\_COMPLETED | Completed consultations cannot be cancelled. |

---

### **Notes**

* Either the client or trainer can cancel the consultation.  
* Only **SCHEDULED** or **CONFIRMED** consultations can be cancelled.  
* Cancelling a consultation does not automatically cancel the trainer request or coaching relationship.  
* Both participants are notified immediately after cancellation.  
* Depending on platform policy, cancellation may affect refunds or rescheduling eligibility.  
* Cancellation events are recorded in the audit log.

---

---

# **Complete Consultation**

POST /api/v1/consultations/:consultationId/complete

### **Description**

Marks a consultation as completed after it has successfully taken place. Completing the consultation allows the coaching process to proceed to the coaching offer stage.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid Consultation ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "summary": "Initial assessment completed. Client is suitable for a 12-week strength program."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| summary | string | ❌ | Maximum 2000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Consultation completed successfully.",  
  "data": {  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "status": "COMPLETED",  
    "completedAt": "2026-07-25T11:08:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "summary",  
      "message": "Summary cannot exceed 2000 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the assigned trainer can complete the consultation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_NOT\_CONFIRMED | Only confirmed consultations can be completed. |
| 409 | CONSULTATION\_ALREADY\_COMPLETED | Consultation has already been completed. |
| 409 | CONSULTATION\_CANCELLED | Cancelled consultations cannot be completed. |

---

### **Notes**

* Only the assigned trainer can complete the consultation.  
* Only consultations with the **CONFIRMED** status can be marked as completed.  
* Completing the consultation is irreversible.  
* After completion, the trainer can create and send a coaching offer to the client.  
* Consultation notes become part of the coaching history.  
* Both participants are notified after completion.  
* The completion event is recorded in the audit log.

---

---

 

# **05\_Offer** 

# **Create Coaching Offer**

POST /api/v1/offers

### **Description**

Creates a coaching offer for a client after a successful consultation. The offer defines the coaching plan, duration, pricing, and terms.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "consultationId": "consultation\_687ab12cd34ef56789012345",  
  "title": "12 Week Strength Transformation",  
  "description": "Personalized workout and nutrition coaching.",  
  "durationInWeeks": 12,  
  "price": 12000,  
  "currency": "INR",  
  "expiresAt": "2026-07-30T23:59:59.000Z"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| consultationId | string | ✅ | Valid completed Consultation ID |
| title | string | ✅ | 3–100 characters |
| description | string | ✅ | Maximum 2000 characters |
| durationInWeeks | number | ✅ | Greater than 0 |
| price | number | ✅ | Greater than 0 |
| currency | string | ✅ | Valid ISO currency code |
| expiresAt | datetime | ✅ | Must be a future date and time |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Coaching offer created successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "status": "PENDING",  
    "expiresAt": "2026-07-30T23:59:59.000Z",  
    "createdAt": "2026-07-25T12:15:30.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "price",  
      "message": "Price must be greater than 0."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can create coaching offers. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONSULTATION\_NOT\_FOUND | Consultation does not exist. |
| 409 | CONSULTATION\_NOT\_COMPLETED | Coaching offers can only be created after a completed consultation. |
| 409 | OFFER\_ALREADY\_EXISTS | A coaching offer already exists for this consultation. |

---

### **Notes**

* Only the trainer who conducted the consultation can create the offer.  
* A consultation can have only one active coaching offer.  
* Newly created offers start with the **PENDING** status.  
* Clients can later accept or reject the offer.  
* Expired offers cannot be accepted.  
* Creating a coaching offer does not establish a coaching relationship.  
* Coaching offer creation is recorded in the audit log.

---

# **Get Coaching Offers**

GET /api/v1/offers

### **Description**

Retrieves a paginated list of coaching offers associated with the authenticated user. Trainers see offers they have created, while clients see offers they have received.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED |
| sort | string | ❌ | newest, oldest, expiring |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offers retrieved successfully.",  
  "data": {  
    "offers": \[  
      {  
        "offerId": "offer\_687ab12cd34ef56789012345",  
        "title": "12 Week Strength Transformation",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "price": 12000,  
        "currency": "INR",  
        "durationInWeeks": 12,  
        "status": "PENDING",  
        "expiresAt": "2026-07-30T23:59:59.000Z",  
        "createdAt": "2026-07-25T12:15:30.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 8,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "status",  
      "message": "Invalid offer status."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only offers addressed to them.  
* Trainers can view only offers they have created.  
* Supports pagination, filtering, and sorting.  
* Expired offers remain visible in the history.  
* Only authorized participants can access offer information.  
* Offer retrieval is recorded for auditing when required.

---

---

# **Get Coaching Offer**

GET /api/v1/offers/:offerId

### **Description**

Retrieves the details of a specific coaching offer associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "offerId": "offer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid Coaching Offer ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offer retrieved successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "consultationId": "consultation\_687ab12cd34ef56789012345",  
    "trainer": {  
      "id": "trainer\_687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K"  
    },  
    "client": {  
      "id": "client\_687ab12cd34ef56789012345",  
      "fullName": "John Doe"  
    },  
    "title": "12 Week Strength Transformation",  
    "description": "Personalized workout and nutrition coaching.",  
    "durationInWeeks": 12,  
    "price": 12000,  
    "currency": "INR",  
    "status": "PENDING",  
    "expiresAt": "2026-07-30T23:59:59.000Z",  
    "createdAt": "2026-07-25T12:15:30.000Z",  
    "updatedAt": "2026-07-25T12:15:30.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "offerId",  
      "message": "Invalid coaching offer ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this coaching offer. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |

---

### **Notes**

* Only the trainer who created the offer and the client who received it can access the offer.  
* The response includes the current offer status and expiration time.  
* Offer information is read-only through this endpoint.  
* Private account information is never exposed.  
* Used before accepting, rejecting, cancelling, or processing payment for the offer.  
* Offer retrieval is recorded in the audit log.

---

# **Get Sent Coaching Offers**

GET /api/v1/offers/sent

### **Description**

Retrieves all coaching offers created by the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED |
| sort | string | ❌ | newest, oldest, expiring |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Sent coaching offers retrieved successfully.",  
  "data": {  
    "offers": \[  
      {  
        "offerId": "offer\_687ab12cd34ef56789012345",  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "title": "12 Week Strength Transformation",  
        "price": 12000,  
        "currency": "INR",  
        "durationInWeeks": 12,  
        "status": "PENDING",  
        "expiresAt": "2026-07-30T23:59:59.000Z",  
        "createdAt": "2026-07-25T12:15:30.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 6,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can access sent coaching offers. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only offers created by the authenticated trainer.  
* Supports pagination, filtering, and sorting.  
* Offers are ordered by creation date (newest first) by default.  
* Includes both active and historical offers.  
* Used by the trainer dashboard.

---

---

# **Get Received Coaching Offers**

GET /api/v1/offers/received

### **Description**

Retrieves all coaching offers received by the authenticated client.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED |
| sort | string | ❌ | newest, oldest, expiring |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Received coaching offers retrieved successfully.",  
  "data": {  
    "offers": \[  
      {  
        "offerId": "offer\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "title": "12 Week Strength Transformation",  
        "price": 12000,  
        "currency": "INR",  
        "durationInWeeks": 12,  
        "status": "PENDING",  
        "expiresAt": "2026-07-30T23:59:59.000Z",  
        "createdAt": "2026-07-25T12:15:30.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 2,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can access received coaching offers. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only offers addressed to the authenticated client.  
* Supports pagination, filtering, and sorting.  
* Includes accepted, rejected, cancelled, expired, and pending offers.  
* Used by the client dashboard to manage coaching offers.

---

---

# **Get Pending Coaching Offers**

GET /api/v1/offers/pending

### **Description**

Retrieves all pending coaching offers awaiting action from the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| sort | string | ❌ | newest, oldest, expiringSoon |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Pending coaching offers retrieved successfully.",  
  "data": {  
    "offers": \[  
      {  
        "offerId": "offer\_687ab12cd34ef56789012345",  
        "title": "12 Week Strength Transformation",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "price": 12000,  
        "currency": "INR",  
        "expiresAt": "2026-07-30T23:59:59.000Z",  
        "status": "PENDING"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 3,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only offers with the **PENDING** status.  
* Trainers see pending offers they have sent.  
* Clients see pending offers awaiting their response.  
* Expired offers are automatically excluded.  
* Supports pagination and sorting.  
* Used for the **Pending Offers** section of the dashboard.

---

# **Update Coaching Offer**

PATCH /api/v1/offers/:offerId

### **Description**

Updates an existing coaching offer before it has been accepted, rejected, cancelled, or expired.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "offerId": "offer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid Coaching Offer ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "16 Week Strength Transformation",  
  "description": "Updated personalized workout, nutrition, and weekly coaching plan.",  
  "durationInWeeks": 16,  
  "price": 16000,  
  "currency": "INR",  
  "expiresAt": "2026-08-05T23:59:59.000Z"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ❌ | 3–100 characters |
| description | string | ❌ | Maximum 2000 characters |
| durationInWeeks | number | ❌ | Greater than 0 |
| price | number | ❌ | Greater than 0 |
| currency | string | ❌ | Valid ISO currency code |
| expiresAt | datetime | ❌ | Must be a future date and time |

Only the fields that need to be updated should be included in the request body.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offer updated successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "title": "16 Week Strength Transformation",  
    "price": 16000,  
    "durationInWeeks": 16,  
    "expiresAt": "2026-08-05T23:59:59.000Z",  
    "updatedAt": "2026-07-25T15:42:18.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "price",  
      "message": "Price must be greater than 0."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer who created the offer can update it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |
| 409 | OFFER\_ALREADY\_ACCEPTED | Accepted offers cannot be modified. |
| 409 | OFFER\_ALREADY\_REJECTED | Rejected offers cannot be modified. |
| 409 | OFFER\_CANCELLED | Cancelled offers cannot be modified. |
| 409 | OFFER\_EXPIRED | Expired offers cannot be modified. |

---

### **Notes**

* Only the trainer who created the offer can update it.  
* Only offers with the **PENDING** status can be updated.  
* Only the fields included in the request are updated.  
* Updating the offer does not change its ownership or consultation.  
* Clients are notified when an offer is updated.  
* If the expiration date is changed, it must still be in the future.  
* All offer updates are recorded in the audit log.

---

# **Accept Coaching Offer**

POST /api/v1/offers/:offerId/accept

### **Description**

Accepts a pending coaching offer. Once accepted, the payment process begins and the coaching relationship can be created after successful payment.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "offerId": "offer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid Coaching Offer ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offer accepted successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "status": "ACCEPTED",  
    "acceptedAt": "2026-07-26T09:20:15.000Z",  
    "nextStep": "PAYMENT\_REQUIRED"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who received the offer can accept it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |
| 409 | OFFER\_ALREADY\_ACCEPTED | Offer has already been accepted. |
| 409 | OFFER\_ALREADY\_REJECTED | Offer has already been rejected. |
| 409 | OFFER\_CANCELLED | Offer has already been cancelled. |
| 409 | OFFER\_EXPIRED | Offer has expired. |

---

### **Notes**

* Only the client who received the offer can accept it.  
* Only **PENDING** offers can be accepted.  
* Accepting an offer is irreversible.  
* Accepting the offer does not activate coaching until payment is successfully completed.  
* Both trainer and client receive notifications.  
* The acceptance event is recorded in the audit log.

---

---

# **Reject Coaching Offer**

POST /api/v1/offers/:offerId/reject

### **Description**

Rejects a pending coaching offer.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "offerId": "offer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid Coaching Offer ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "The pricing does not fit my budget."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ❌ | Maximum 500 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offer rejected successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "status": "REJECTED",  
    "rejectedAt": "2026-07-26T09:35:40.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Reason cannot exceed 500 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who received the offer can reject it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |
| 409 | OFFER\_ALREADY\_ACCEPTED | Offer has already been accepted. |
| 409 | OFFER\_ALREADY\_REJECTED | Offer has already been rejected. |
| 409 | OFFER\_CANCELLED | Offer has already been cancelled. |
| 409 | OFFER\_EXPIRED | Offer has expired. |

---

### **Notes**

* Only the client who received the offer can reject it.  
* Only **PENDING** offers can be rejected.  
* Rejected offers cannot be accepted later.  
* The trainer is notified immediately.  
* The rejection event is recorded in the audit log.

---

---

# **Cancel Coaching Offer**

POST /api/v1/offers/:offerId/cancel

### **Description**

Cancels a pending coaching offer before the client responds.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "offerId": "offer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid Coaching Offer ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Offer details have changed."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ❌ | Maximum 500 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offer cancelled successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "status": "CANCELLED",  
    "cancelledAt": "2026-07-26T10:05:12.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer who created the offer can cancel it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |
| 409 | OFFER\_ALREADY\_ACCEPTED | Accepted offers cannot be cancelled. |
| 409 | OFFER\_ALREADY\_REJECTED | Offer has already been rejected. |
| 409 | OFFER\_ALREADY\_CANCELLED | Offer has already been cancelled. |
| 409 | OFFER\_EXPIRED | Offer has expired. |

---

### **Notes**

* Only the trainer who created the offer can cancel it.  
* Only **PENDING** offers can be cancelled.  
* Cancelled offers cannot be restored.  
* The client is notified immediately.  
* Cancellation is recorded in the audit log.

---

---

# **Expire Coaching Offer**

POST /api/v1/offers/:offerId/expire

### **Description**

Marks a pending coaching offer as expired after its validity period has ended. This endpoint is primarily intended for scheduled jobs or administrative automation.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "offerId": "offer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid Coaching Offer ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching offer expired successfully.",  
  "data": {  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "status": "EXPIRED",  
    "expiredAt": "2026-07-30T23:59:59.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators or the system scheduler can expire offers. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |
| 409 | OFFER\_ALREADY\_ACCEPTED | Accepted offers cannot expire. |
| 409 | OFFER\_ALREADY\_REJECTED | Offer has already been rejected. |
| 409 | OFFER\_ALREADY\_CANCELLED | Offer has already been cancelled. |
| 409 | OFFER\_ALREADY\_EXPIRED | Offer has already expired. |

---

### **Notes**

* This endpoint is normally executed automatically by a scheduled background job.  
* Only **PENDING** offers can expire.  
* Clients cannot accept an expired offer.  
* Expired offers remain available for historical records.  
* Both trainer and client are notified when an offer expires.  
* The expiration event is recorded in the audit log.

---

---

 

# **06\_Payment**

[**Payment.api.md**](http://Payment.api.md)

# **Create Payment**

POST /api/v1/payments

### **Description**

Initiates a payment for an accepted coaching offer. A payment order is created with the configured payment gateway.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "offerId": "offer\_687ab12cd34ef56789012345",  
  "paymentMethod": "RAZORPAY"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| offerId | string | ✅ | Valid accepted Coaching Offer ID |
| paymentMethod | enum | ✅ | RAZORPAY, STRIPE |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Payment initiated successfully.",  
  "data": {  
    "paymentId": "payment\_687ab12cd34ef56789012345",  
    "gateway": "RAZORPAY",  
    "orderId": "order\_QwErTy123456",  
    "amount": 12000,  
    "currency": "INR",  
    "status": "PENDING",  
    "paymentUrl": "https://checkout.razorpay.com/..."  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "offerId",  
      "message": "Offer ID is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can initiate payments. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | OFFER\_NOT\_FOUND | Coaching offer does not exist. |
| 409 | OFFER\_NOT\_ACCEPTED | Only accepted offers can be paid. |
| 409 | PAYMENT\_ALREADY\_EXISTS | A payment already exists for this offer. |
| 409 | OFFER\_EXPIRED | Coaching offer has expired. |

---

### **Notes**

* Only the client can initiate payment.  
* Payment can only be created for an accepted coaching offer.  
* One payment is created per coaching offer.  
* The payment gateway order is created during this request.  
* Payment verification is completed using the **Verify Payment** API.  
* Successful payment activates the coaching relationship.  
* Payment creation is recorded in the audit log.

---

---

# **Get Payments**

GET /api/v1/payments

### **Description**

Retrieves a paginated list of payments associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | PENDING, SUCCESS, FAILED, REFUNDED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payments retrieved successfully.",  
  "data": {  
    "payments": \[  
      {  
        "paymentId": "payment\_687ab12cd34ef56789012345",  
        "offerId": "offer\_687ab12cd34ef56789012345",  
        "amount": 12000,  
        "currency": "INR",  
        "paymentMethod": "RAZORPAY",  
        "status": "SUCCESS",  
        "paidAt": "2026-07-26T14:15:20.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 5,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their payments.  
* Trainers can view payments received for their coaching offers.  
* Supports pagination and filtering.  
* Payments are ordered by newest first.  
* Sensitive gateway information is never returned.  
* Payment retrieval is recorded for auditing when required.

---

---

# **Get Payment**

GET /api/v1/payments/:paymentId

### **Description**

Retrieves detailed information about a specific payment.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "paymentId": "payment\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| paymentId | string | ✅ | Valid Payment ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payment retrieved successfully.",  
  "data": {  
    "paymentId": "payment\_687ab12cd34ef56789012345",  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "gatewayOrderId": "order\_QwErTy123456",  
    "gatewayPaymentId": "pay\_QwErTy987654",  
    "amount": 12000,  
    "currency": "INR",  
    "paymentMethod": "RAZORPAY",  
    "status": "SUCCESS",  
    "paidAt": "2026-07-26T14:15:20.000Z",  
    "createdAt": "2026-07-26T14:10:05.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "paymentId",  
      "message": "Invalid payment ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this payment. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | PAYMENT\_NOT\_FOUND | Payment does not exist. |

---

### **Notes**

* Only payment participants can access payment details.  
* Gateway secrets and signatures are never returned.  
* Payment details are read-only.  
* Used before refunds and invoice generation.  
* Payment retrieval is recorded in the audit log.

---

---

# **Get Payment History**

GET /api/v1/payments/history

### **Description**

Retrieves the complete payment history of the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | SUCCESS, FAILED, REFUNDED |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payment history retrieved successfully.",  
  "data": {  
    "payments": \[  
      {  
        "paymentId": "payment\_687ab12cd34ef56789012345",  
        "offerId": "offer\_687ab12cd34ef56789012345",  
        "amount": 12000,  
        "currency": "INR",  
        "status": "SUCCESS",  
        "paidAt": "2026-07-26T14:15:20.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 22,  
      "totalPages": 3  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns historical payment records only.  
* Supports pagination, filtering, and date range queries.  
* Payments cannot be modified through this endpoint.  
* Clients see payments they made.  
* Trainers see payments received from clients.  
* Used for financial reporting and transaction history.  
* Payment history is immutable and retained for auditing.

---

---

 

# **Verify Payment**

POST /api/v1/payments/:paymentId/verify

### **Description**

Verifies the payment with the payment gateway after the client completes the payment process. Upon successful verification, the coaching relationship is activated.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "paymentId": "payment\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| paymentId | string | ✅ | Valid Payment ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "gatewayPaymentId": "pay\_QwErTy987654",  
  "gatewayOrderId": "order\_QwErTy123456",  
  "gatewaySignature": "2dbe2d12bc5f7d9f..."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| gatewayPaymentId | string | ✅ | Valid Gateway Payment ID |
| gatewayOrderId | string | ✅ | Valid Gateway Order ID |
| gatewaySignature | string | ✅ | Payment gateway signature |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payment verified successfully.",  
  "data": {  
    "paymentId": "payment\_687ab12cd34ef56789012345",  
    "status": "SUCCESS",  
    "verifiedAt": "2026-07-26T14:18:32.000Z",  
    "coachingRelationshipCreated": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "gatewaySignature",  
      "message": "Gateway signature is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who initiated the payment can verify it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | PAYMENT\_NOT\_FOUND | Payment does not exist. |
| 409 | PAYMENT\_ALREADY\_VERIFIED | Payment has already been verified. |
| 409 | PAYMENT\_FAILED | Payment failed at the payment gateway. |
| 422 | INVALID\_PAYMENT\_SIGNATURE | Payment signature verification failed. |

---

### **Notes**

* Only the client who initiated the payment can verify it.  
* Payment verification validates the gateway signature.  
* Successful verification automatically activates the coaching relationship.  
* Failed verification does not activate coaching.  
* Payment verification is idempotent.  
* The verification event is recorded in the audit log.

---

---

# **Refund Payment**

POST /api/v1/payments/:paymentId/refund

### **Description**

Creates a refund request for a completed payment. The request is forwarded to the refund workflow for approval and processing.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "paymentId": "payment\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| paymentId | string | ✅ | Valid Payment ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Unable to continue the coaching program."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ✅ | 10–1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Refund request created successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "paymentId": "payment\_687ab12cd34ef56789012345",  
    "status": "PENDING",  
    "requestedAt": "2026-07-28T09:15:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Refund reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who made the payment can request a refund. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | PAYMENT\_NOT\_FOUND | Payment does not exist. |
| 409 | PAYMENT\_NOT\_SUCCESSFUL | Only successful payments can be refunded. |
| 409 | REFUND\_ALREADY\_REQUESTED | A refund request already exists for this payment. |
| 422 | REFUND\_WINDOW\_EXPIRED | The refund request period has expired. |

---

### **Notes**

* Only the client who made the payment can request a refund.  
* Refund approval is handled separately through the Refund module.  
* Creating a refund request does not immediately refund the payment.  
* Only one active refund request is allowed per payment.  
* Refund eligibility depends on platform policy.  
* Refund requests are recorded in the audit log.

---

---

# **Get Payment Invoice**

GET /api/v1/payments/:paymentId/invoice

### **Description**

Retrieves the invoice generated for a successful payment.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "paymentId": "payment\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| paymentId | string | ✅ | Valid Payment ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Invoice retrieved successfully.",  
  "data": {  
    "invoiceId": "invoice\_687ab12cd34ef56789012345",  
    "invoiceNumber": "KF-INV-2026-000124",  
    "invoiceUrl": "https://cdn.kizunafit.com/invoices/KF-INV-2026-000124.pdf",  
    "amount": 12000,  
    "currency": "INR",  
    "issuedAt": "2026-07-26T14:19:05.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "paymentId",  
      "message": "Invalid payment ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this invoice. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | PAYMENT\_NOT\_FOUND | Payment does not exist. |
| 404 | INVOICE\_NOT\_FOUND | Invoice has not been generated for this payment. |
| 409 | PAYMENT\_NOT\_SUCCESSFUL | Invoice is available only for successful payments. |

---

### **Notes**

* Available only after a successful payment.  
* Both the client and trainer can access the invoice.  
* The invoice is generated automatically after payment verification.  
* Invoice data is immutable after generation.  
* The invoice can be downloaded as a PDF.  
* Invoice access is recorded in the audit log.

---

---

   
**Refund.api.md**

# **Create Refund Request**

POST /api/v1/refunds

### **Description**

Creates a refund request for a previously completed payment. The request enters the refund approval workflow for administrative review.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "paymentId": "payment\_687ab12cd34ef56789012345",  
  "reason": "Unable to continue the coaching program."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| paymentId | string | ✅ | Valid Payment ID |
| reason | string | ✅ | 10–1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Refund request created successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "paymentId": "payment\_687ab12cd34ef56789012345",  
    "status": "PENDING",  
    "requestedAt": "2026-07-28T09:15:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Refund reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who made the payment can request a refund. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | PAYMENT\_NOT\_FOUND | Payment does not exist. |
| 409 | PAYMENT\_NOT\_SUCCESSFUL | Only successful payments can be refunded. |
| 409 | REFUND\_ALREADY\_EXISTS | A refund request already exists for this payment. |
| 422 | REFUND\_WINDOW\_EXPIRED | The refund request period has expired. |

---

### **Notes**

* Only the client who made the payment can request a refund.  
* Refund requests always start with the **PENDING** status.  
* Refund approval is handled through the Refund Administration workflow.  
* Creating a refund request does not immediately return funds.  
* Only one active refund request is allowed per payment.  
* Refund requests are recorded in the audit log.

---

---

# **Get Refund Requests**

GET /api/v1/refunds

### **Description**

Retrieves a paginated list of refund requests associated with the authenticated user.

### **Authentication**

Client | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | PENDING, APPROVED, REJECTED, PROCESSED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund requests retrieved successfully.",  
  "data": {  
    "refunds": \[  
      {  
        "refundId": "refund\_687ab12cd34ef56789012345",  
        "paymentId": "payment\_687ab12cd34ef56789012345",  
        "amount": 12000,  
        "currency": "INR",  
        "status": "PENDING",  
        "requestedAt": "2026-07-28T09:15:42.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 8,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their own refund requests.  
* Administrators can view all refund requests.  
* Supports pagination, filtering, and sorting.  
* Refund requests are ordered by newest first.  
* Used by both client dashboards and the admin refund management panel.  
* Refund retrieval is recorded in the audit log.

---

---

# **Get Refund Request**

GET /api/v1/refunds/:refundId

### **Description**

Retrieves the details of a specific refund request.

### **Authentication**

Client | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "refundId": "refund\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refundId | string | ✅ | Valid Refund ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund request retrieved successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "paymentId": "payment\_687ab12cd34ef56789012345",  
    "amount": 12000,  
    "currency": "INR",  
    "reason": "Unable to continue the coaching program.",  
    "status": "PENDING",  
    "requestedAt": "2026-07-28T09:15:42.000Z",  
    "updatedAt": "2026-07-28T09:15:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "refundId",  
      "message": "Invalid refund ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this refund request. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | REFUND\_NOT\_FOUND | Refund request does not exist. |

---

### **Notes**

* Clients can access only their own refund requests.  
* Administrators can access all refund requests.  
* Refund information is read-only through this endpoint.  
* Includes the latest refund status and timestamps.  
* Used before approving, rejecting, or processing refunds.  
* Refund retrieval is recorded in the audit log.

---

---

 

# **Approve Refund Request**

POST /api/v1/refunds/:refundId/approve

### **Description**

Approves a pending refund request. Once approved, the refund becomes eligible for payment gateway processing.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "refundId": "refund\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refundId | string | ✅ | Valid Refund ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "remarks": "Refund request approved after policy verification."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| remarks | string | ❌ | Maximum 1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund request approved successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "status": "APPROVED",  
    "approvedAt": "2026-07-29T10:15:42.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "remarks",  
      "message": "Remarks cannot exceed 1000 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can approve refund requests. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | REFUND\_NOT\_FOUND | Refund request does not exist. |
| 409 | REFUND\_ALREADY\_APPROVED | Refund request has already been approved. |
| 409 | REFUND\_ALREADY\_REJECTED | Refund request has already been rejected. |
| 409 | REFUND\_ALREADY\_PROCESSED | Refund has already been processed. |

---

### **Notes**

* Only administrators can approve refund requests.  
* Only **PENDING** refund requests can be approved.  
* Approval does not transfer funds.  
* Approved refunds must be processed separately.  
* The client is notified after approval.  
* Approval actions are recorded in the audit log.

---

---

# **Reject Refund Request**

POST /api/v1/refunds/:refundId/reject

### **Description**

Rejects a pending refund request.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "refundId": "refund\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refundId | string | ✅ | Valid Refund ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Refund request does not satisfy the platform refund policy."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ✅ | 10–1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund request rejected successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "status": "REJECTED",  
    "rejectedAt": "2026-07-29T10:40:18.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Reason must be between 10 and 1000 characters."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can reject refund requests. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | REFUND\_NOT\_FOUND | Refund request does not exist. |
| 409 | REFUND\_ALREADY\_APPROVED | Refund request has already been approved. |
| 409 | REFUND\_ALREADY\_REJECTED | Refund request has already been rejected. |
| 409 | REFUND\_ALREADY\_PROCESSED | Refund has already been processed. |

---

### **Notes**

* Only administrators can reject refund requests.  
* Only **PENDING** refund requests can be rejected.  
* Rejected refund requests cannot be processed.  
* The client is notified with the rejection reason.  
* All rejection actions are recorded in the audit log.

---

---

# **Process Refund**

POST /api/v1/refunds/:refundId/process

### **Description**

Processes an approved refund through the configured payment gateway and marks the refund as completed upon success.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "refundId": "refund\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refundId | string | ✅ | Valid Refund ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund processed successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "status": "PROCESSED",  
    "gatewayRefundId": "rfnd\_QweRtY987654",  
    "processedAt": "2026-07-29T11:25:32.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can process refunds. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | REFUND\_NOT\_FOUND | Refund request does not exist. |
| 409 | REFUND\_NOT\_APPROVED | Only approved refunds can be processed. |
| 409 | REFUND\_ALREADY\_PROCESSED | Refund has already been processed. |
| 502 | PAYMENT\_GATEWAY\_ERROR | Failed to process the refund through the payment gateway. |

---

### **Notes**

* Only administrators can process refunds.  
* Only **APPROVED** refunds can be processed.  
* Processing communicates directly with the payment gateway.  
* A successful process updates both the refund and payment status.  
* The client is automatically notified when the refund is completed.  
* Refund processing is idempotent to prevent duplicate refunds.  
* All processing events are recorded in the audit log.

---

---

   
**Payout.api.md**

# **Create Payout**

POST /api/v1/payouts

### **Description**

Creates a payout request for a trainer's eligible earnings. The payout request is submitted for administrative processing.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "amount": 8500,  
  "bankAccountId": "bank\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| amount | number | ✅ | Greater than 0 |
| bankAccountId | string | ✅ | Valid Bank Account ID |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Payout request created successfully.",  
  "data": {  
    "payoutId": "payout\_687ab12cd34ef56789012345",  
    "amount": 8500,  
    "currency": "INR",  
    "status": "PENDING",  
    "requestedAt": "2026-07-30T09:15:20.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "amount",  
      "message": "Amount must be greater than zero."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can request payouts. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | BANK\_ACCOUNT\_NOT\_FOUND | Bank account does not exist. |
| 409 | INSUFFICIENT\_AVAILABLE\_BALANCE | Available balance is insufficient for payout. |
| 409 | PAYOUT\_ALREADY\_PENDING | A payout request is already pending. |

---

### **Notes**

* Only trainers can create payout requests.  
* Requested amount cannot exceed the available withdrawable balance.  
* Payouts are reviewed and processed by administrators.  
* Newly created payouts start with the **PENDING** status.  
* Payout requests are recorded in the audit log.

---

---

# **Get Payouts**

GET /api/v1/payouts

### **Description**

Retrieves a paginated list of payout requests associated with the authenticated trainer or all payouts for administrators.

### **Authentication**

Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Records per page (Default: 10\) |
| status | enum | ❌ | PENDING, PROCESSING, COMPLETED, FAILED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payouts retrieved successfully.",  
  "data": {  
    "payouts": \[  
      {  
        "payoutId": "payout\_687ab12cd34ef56789012345",  
        "amount": 8500,  
        "currency": "INR",  
        "status": "PENDING",  
        "requestedAt": "2026-07-30T09:15:20.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 5,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Trainers can view only their own payout requests.  
* Administrators can view all payout requests.  
* Supports filtering and pagination.  
* Results are sorted by newest first.

---

---

# **Get Payout**

GET /api/v1/payouts/:payoutId

### **Description**

Retrieves detailed information about a specific payout request.

### **Authentication**

Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "payoutId": "payout\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| payoutId | string | ✅ | Valid Payout ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payout retrieved successfully.",  
  "data": {  
    "payoutId": "payout\_687ab12cd34ef56789012345",  
    "amount": 8500,  
    "currency": "INR",  
    "status": "PENDING",  
    "bankAccountId": "bank\_687ab12cd34ef56789012345",  
    "requestedAt": "2026-07-30T09:15:20.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "payoutId",  
      "message": "Invalid payout ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this payout. |
| 404 | PAYOUT\_NOT\_FOUND | Payout request does not exist. |

---

### **Notes**

* Trainers can access only their own payout requests.  
* Administrators can access all payout requests.  
* Payout information is read-only.  
* Used before payout processing.

---

---

# **Process Payout**

POST /api/v1/payouts/:payoutId/process

### **Description**

Starts processing an approved payout through the configured payout gateway.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "payoutId": "payout\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payout processing started successfully.",  
  "data": {  
    "payoutId": "payout\_687ab12cd34ef56789012345",  
    "status": "PROCESSING",  
    "processedAt": "2026-07-30T11:30:00.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can process payouts. |
| 404 | PAYOUT\_NOT\_FOUND | Payout request does not exist. |
| 409 | PAYOUT\_ALREADY\_PROCESSING | Payout is already being processed. |
| 409 | PAYOUT\_ALREADY\_COMPLETED | Payout has already been completed. |

---

### **Notes**

* Only administrators can process payouts.  
* Only **PENDING** payouts can move to **PROCESSING**.  
* Processing communicates with the payout gateway.  
* Processing events are recorded in the audit log.

---

---

# **Complete Payout**

POST /api/v1/payouts/:payoutId/complete

### **Description**

Marks a processing payout as successfully completed after confirmation from the payout gateway.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "payoutId": "payout\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "gatewayTransactionId": "txn\_ABC123456789"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| gatewayTransactionId | string | ✅ | Valid gateway transaction ID |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payout completed successfully.",  
  "data": {  
    "payoutId": "payout\_687ab12cd34ef56789012345",  
    "status": "COMPLETED",  
    "completedAt": "2026-07-30T11:45:18.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can complete payouts. |
| 404 | PAYOUT\_NOT\_FOUND | Payout request does not exist. |
| 409 | PAYOUT\_NOT\_PROCESSING | Only processing payouts can be completed. |
| 409 | PAYOUT\_ALREADY\_COMPLETED | Payout has already been completed. |

---

### **Notes**

* Only administrators can complete payouts.  
* Only **PROCESSING** payouts can become **COMPLETED**.  
* Completing a payout finalizes the transaction.  
* Trainers receive a payout notification.  
* Completion events are recorded in the audit log.

---

---

# **Fail Payout**

POST /api/v1/payouts/:payoutId/fail

### **Description**

Marks a payout as failed if the payout gateway is unable to transfer the funds.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "payoutId": "payout\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Bank account verification failed."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ✅ | 10–1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payout marked as failed.",  
  "data": {  
    "payoutId": "payout\_687ab12cd34ef56789012345",  
    "status": "FAILED",  
    "failedAt": "2026-07-30T11:42:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can fail payouts. |
| 404 | PAYOUT\_NOT\_FOUND | Payout request does not exist. |
| 409 | PAYOUT\_NOT\_PROCESSING | Only processing payouts can be marked as failed. |
| 409 | PAYOUT\_ALREADY\_COMPLETED | Completed payouts cannot fail. |

---

### **Notes**

* Only administrators can mark payouts as failed.  
* Only **PROCESSING** payouts can transition to **FAILED**.  
* Failed payouts return the amount to the trainer's available balance according to platform policy.  
* Trainers are notified about the failure.  
* Failure events are recorded in the audit log.

---

---

 

# **07\_Coaching**

[**CoachingRelationship.api.md**](http://CoachingRelationship.api.md)

# **Get Coaching Relationships**

GET /api/v1/coaching-relationships

### **Description**

Retrieves a paginated list of coaching relationships associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| status | enum | ❌ | ACTIVE, PAUSED, COMPLETED, CANCELLED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationships retrieved successfully.",  
  "data": {  
    "relationships": \[  
      {  
        "relationshipId": "relationship\_687ab12cd34ef56789012345",  
        "trainer": {  
          "id": "trainer\_687ab12cd34ef56789012345",  
          "fullName": "Mohammed Nihal K"  
        },  
        "client": {  
          "id": "client\_687ab12cd34ef56789012345",  
          "fullName": "John Doe"  
        },  
        "programName": "12 Week Strength Transformation",  
        "status": "ACTIVE",  
        "startedAt": "2026-08-01T09:00:00.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 5,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their coaching relationships.  
* Trainers can view only coaching relationships assigned to them.  
* Supports pagination, filtering, and sorting.  
* Relationships are ordered by newest first.  
* Used by the coaching dashboard.  
* Coaching relationship retrieval is recorded in the audit log.

---

---

# **Get Coaching Relationship**

GET /api/v1/coaching-relationships/:relationshipId

### **Description**

Retrieves detailed information about a specific coaching relationship.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "relationshipId": "relationship\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| relationshipId | string | ✅ | Valid Coaching Relationship ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship retrieved successfully.",  
  "data": {  
    "relationshipId": "relationship\_687ab12cd34ef56789012345",  
    "trainer": {  
      "id": "trainer\_687ab12cd34ef56789012345",  
      "fullName": "Mohammed Nihal K"  
    },  
    "client": {  
      "id": "client\_687ab12cd34ef56789012345",  
      "fullName": "John Doe"  
    },  
    "offerId": "offer\_687ab12cd34ef56789012345",  
    "status": "ACTIVE",  
    "startedAt": "2026-08-01T09:00:00.000Z",  
    "endsAt": "2026-10-24T09:00:00.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "relationshipId",  
      "message": "Invalid coaching relationship ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this coaching relationship. |
| 404 | COACHING\_RELATIONSHIP\_NOT\_FOUND | Coaching relationship does not exist. |

---

### **Notes**

* Only coaching participants can access relationship details.  
* Relationship information is read-only.  
* Used before relationship state transitions.  
* Access is recorded in the audit log.

---

---

# **Get Active Coaching Relationships**

GET /api/v1/coaching-relationships/active

### **Description**

Retrieves all active coaching relationships for the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Active coaching relationships retrieved successfully.",  
  "data": {  
    "relationships": \[  
      {  
        "relationshipId": "relationship\_687ab12cd34ef56789012345",  
        "status": "ACTIVE",  
        "startedAt": "2026-08-01T09:00:00.000Z"  
      }  
    \]  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only ACTIVE relationships.  
* Used by the coaching dashboard.  
* Supports pagination.  
* Results are sorted by newest first.  
* Retrieval is recorded in the audit log.

---

---

# **Get Coaching Relationship History**

GET /api/v1/coaching-relationships/history

### **Description**

Retrieves completed and cancelled coaching relationships associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| status | enum | ❌ | COMPLETED, CANCELLED |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship history retrieved successfully.",  
  "data": {  
    "relationships": \[  
      {  
        "relationshipId": "relationship\_687ab12cd34ef56789012345",  
        "status": "COMPLETED",  
        "completedAt": "2026-11-01T10:30:00.000Z"  
      }  
    \]  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns completed and cancelled relationships only.  
* Supports pagination.  
* Used for coaching history and reporting.  
* History is immutable.  
* Retrieval is recorded in the audit log.

---

---

# **Activate Coaching Relationship**

POST /api/v1/coaching-relationships/:relationshipId/activate

### **Description**

Activates a coaching relationship after successful payment verification.

### **Authentication**

System | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "relationshipId": "relationship\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship activated successfully.",  
  "data": {  
    "relationshipId": "relationship\_687ab12cd34ef56789012345",  
    "status": "ACTIVE"  
  }  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 404 | COACHING\_RELATIONSHIP\_NOT\_FOUND | Relationship not found. |
| 409 | RELATIONSHIP\_ALREADY\_ACTIVE | Relationship is already active. |

---

### **Notes**

* Normally triggered automatically after successful payment verification.  
* Activates the coaching lifecycle.  
* Recorded in the audit log.

---

---

# **Pause Coaching Relationship**

POST /api/v1/coaching-relationships/:relationshipId/pause

### **Description**

Temporarily pauses an active coaching relationship.

### **Authentication**

Trainer

---

### **Business Errors**

* 401 UNAUTHORIZED  
* 403 FORBIDDEN  
* 404 COACHING\_RELATIONSHIP\_NOT\_FOUND  
* 409 RELATIONSHIP\_NOT\_ACTIVE

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship paused successfully.",  
  "data": {  
    "status": "PAUSED"  
  }  
}

### **Notes**

* Only active relationships can be paused.  
* Client is notified.  
* Recorded in the audit log.

---

---

# **Resume Coaching Relationship**

POST /api/v1/coaching-relationships/:relationshipId/resume

### **Description**

Resumes a previously paused coaching relationship.

### **Authentication**

Trainer

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship resumed successfully.",  
  "data": {  
    "status": "ACTIVE"  
  }  
}

### **Business Errors**

* 401 UNAUTHORIZED  
* 403 FORBIDDEN  
* 404 COACHING\_RELATIONSHIP\_NOT\_FOUND  
* 409 RELATIONSHIP\_NOT\_PAUSED

### **Notes**

* Only paused relationships can be resumed.  
* Client receives a notification.  
* Recorded in the audit log.

---

---

# **Complete Coaching Relationship**

POST /api/v1/coaching-relationships/:relationshipId/complete

### **Description**

Marks the coaching relationship as successfully completed after the coaching program finishes.

### **Authentication**

Trainer

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship completed successfully.",  
  "data": {  
    "status": "COMPLETED",  
    "completedAt": "2026-10-24T18:30:00.000Z"  
  }  
}

### **Business Errors**

* 401 UNAUTHORIZED  
* 403 FORBIDDEN  
* 404 COACHING\_RELATIONSHIP\_NOT\_FOUND  
* 409 RELATIONSHIP\_NOT\_ACTIVE

### **Notes**

* Only active relationships can be completed.  
* Enables client review submission.  
* Recorded in the audit log.

---

---

# **Cancel Coaching Relationship**

POST /api/v1/coaching-relationships/:relationshipId/cancel

### **Description**

Cancels an active coaching relationship before program completion.

### **Authentication**

Trainer | Admin

---

### **Request Body**

{  
  "reason": "Violation of coaching agreement."  
}

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching relationship cancelled successfully.",  
  "data": {  
    "status": "CANCELLED",  
    "cancelledAt": "2026-08-15T10:15:00.000Z"  
  }  
}

---

### **Business Errors**

* 401 UNAUTHORIZED  
* 403 FORBIDDEN  
* 404 COACHING\_RELATIONSHIP\_NOT\_FOUND  
* 409 RELATIONSHIP\_ALREADY\_COMPLETED  
* 409 RELATIONSHIP\_ALREADY\_CANCELLED

---

### **Notes**

* Only trainers or administrators can cancel a coaching relationship.  
* Cancellation may trigger the refund workflow depending on platform policy.  
* Both participants are notified.  
* Cancellation is recorded in the audit log.

---

---

 

# **08\_Workout**

**Exercise.api**

# **Create Exercise**

POST /api/v1/exercises

### **Description**

Creates a new exercise in the platform exercise library.

### **Authentication**

Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "name": "Push Up",  
  "category": "CHEST",  
  "equipment": "BODYWEIGHT",  
  "difficulty": "BEGINNER",  
  "primaryMuscles": \[  
    "CHEST",  
    "TRICEPS"  
  \],  
  "secondaryMuscles": \[  
    "SHOULDERS"  
  \],  
  "instructions": \[  
    "Keep your body straight.",  
    "Lower until your chest is close to the floor.",  
    "Push back to the starting position."  
  \],  
  "videoUrl": "https://example.com/videos/push-up.mp4"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| name | string | ✅ | 3–100 characters |
| category | enum | ✅ | Valid exercise category |
| equipment | enum | ✅ | Valid equipment type |
| difficulty | enum | ✅ | BEGINNER, INTERMEDIATE, ADVANCED |
| primaryMuscles | array | ✅ | At least one muscle group |
| secondaryMuscles | array | ❌ | Valid muscle groups |
| instructions | array | ✅ | At least one instruction |
| videoUrl | string | ❌ | Valid URL |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Exercise created successfully.",  
  "data": {  
    "exerciseId": "exercise\_687ab12cd34ef56789012345",  
    "name": "Push Up",  
    "createdAt": "2026-08-01T09:15:20.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "name",  
      "message": "Exercise name is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers or administrators can create exercises. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 409 | EXERCISE\_ALREADY\_EXISTS | An exercise with the same name already exists. |

---

### **Notes**

* Exercises are stored in the central exercise library.  
* Trainers can reuse exercises when creating workout programs.  
* Duplicate exercise names are not allowed.  
* Exercise creation is recorded in the audit log.

---

---

# **Get Exercises**

GET /api/v1/exercises

### **Description**

Retrieves a paginated list of exercises from the exercise library.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| search | string | ❌ | Exercise name |
| category | enum | ❌ | Exercise category |
| equipment | enum | ❌ | Equipment type |
| difficulty | enum | ❌ | Difficulty level |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Exercises retrieved successfully.",  
  "data": {  
    "exercises": \[  
      {  
        "exerciseId": "exercise\_687ab12cd34ef56789012345",  
        "name": "Push Up",  
        "category": "CHEST",  
        "difficulty": "BEGINNER",  
        "equipment": "BODYWEIGHT"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 150,  
      "totalPages": 15  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |

---

### **Notes**

* Available to all authenticated users.  
* Supports searching and filtering.  
* Used while creating workout programs.  
* Results are paginated.

---

---

# **Get Exercise**

GET /api/v1/exercises/:exerciseId

### **Description**

Retrieves detailed information about a specific exercise.

### **Authentication**

Client | Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "exerciseId": "exercise\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| exerciseId | string | ✅ | Valid Exercise ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Exercise retrieved successfully.",  
  "data": {  
    "exerciseId": "exercise\_687ab12cd34ef56789012345",  
    "name": "Push Up",  
    "category": "CHEST",  
    "equipment": "BODYWEIGHT",  
    "difficulty": "BEGINNER",  
    "primaryMuscles": \[  
      "CHEST",  
      "TRICEPS"  
    \],  
    "secondaryMuscles": \[  
      "SHOULDERS"  
    \],  
    "instructions": \[  
      "Keep your body straight.",  
      "Lower until your chest is close to the floor.",  
      "Push back up."  
    \],  
    "videoUrl": "https://example.com/videos/push-up.mp4"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "exerciseId",  
      "message": "Invalid exercise ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 404 | EXERCISE\_NOT\_FOUND | Exercise does not exist. |

---

### **Notes**

* Returns complete exercise details.  
* Used by workout program builders.  
* Exercise data is read-only through this endpoint.

---

---

# **Update Exercise**

PATCH /api/v1/exercises/:exerciseId

### **Description**

Updates an existing exercise in the exercise library.

### **Authentication**

Trainer | Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "exerciseId": "exercise\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "difficulty": "INTERMEDIATE",  
  "instructions": \[  
    "Maintain a straight body.",  
    "Lower slowly.",  
    "Push upward."  
  \]  
}

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Exercise updated successfully.",  
  "data": {  
    "exerciseId": "exercise\_687ab12cd34ef56789012345",  
    "updatedAt": "2026-08-01T10:30:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "difficulty",  
      "message": "Invalid difficulty."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers or administrators can update exercises. |
| 404 | EXERCISE\_NOT\_FOUND | Exercise does not exist. |
| 409 | EXERCISE\_ALREADY\_EXISTS | Another exercise already uses this name. |

---

### **Notes**

* Only supplied fields are updated.  
* Exercise updates affect future workout programs.  
* Existing workout logs remain unchanged.  
* Updates are recorded in the audit log.

---

---

# **Delete Exercise**

DELETE /api/v1/exercises/:exerciseId

### **Description**

Deletes an exercise from the exercise library.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "exerciseId": "exercise\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Exercise deleted successfully.",  
  "data": {  
    "exerciseId": "exercise\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can delete exercises. |
| 404 | EXERCISE\_NOT\_FOUND | Exercise does not exist. |
| 409 | EXERCISE\_IN\_USE | Exercise is referenced by one or more workout programs. |

---

### **Notes**

* Only administrators can permanently delete exercises.  
* Exercises referenced by workout programs cannot be deleted.  
* Soft deletion is recommended to preserve historical workout data.  
* Exercise deletion is recorded in the audit log.

---

---

   
**WorkoutProgram.api.md**

# **Create Workout Program**

POST /api/v1/workout-programs

### **Description**

Creates a new workout program template that can later be assigned to one or more clients.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "12 Week Strength Program",  
  "description": "Beginner to intermediate strength program.",  
  "goal": "STRENGTH",  
  "durationInWeeks": 12,  
  "days": \[  
    {  
      "day": 1,  
      "title": "Push Day",  
      "exercises": \[  
        {  
          "exerciseId": "exercise\_687ab12cd34ef56789012345",  
          "sets": 4,  
          "reps": "10-12",  
          "restSeconds": 90  
        }  
      \]  
    }  
  \]  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ✅ | 3–100 characters |
| description | string | ❌ | Maximum 2000 characters |
| goal | enum | ✅ | STRENGTH, FAT\_LOSS, MUSCLE\_GAIN, ENDURANCE |
| durationInWeeks | number | ✅ | Greater than 0 |
| days | array | ✅ | At least one workout day |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Workout program created successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "status": "DRAFT",  
    "createdAt": "2026-08-02T09:15:22.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "title",  
      "message": "Workout program title is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can create workout programs. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* New workout programs are created as **DRAFT**.  
* Programs can be edited until published.  
* Programs can later be assigned to clients.  
* Every creation is recorded in the audit log.

---

---

# **Get Workout Programs**

GET /api/v1/workout-programs

### **Description**

Retrieves all workout programs created by the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| status | enum | ❌ | DRAFT, PUBLISHED, ARCHIVED |
| search | string | ❌ | Program title |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout programs retrieved successfully.",  
  "data": {  
    "programs": \[  
      {  
        "programId": "program\_687ab12cd34ef56789012345",  
        "title": "12 Week Strength Program",  
        "goal": "STRENGTH",  
        "durationInWeeks": 12,  
        "status": "PUBLISHED"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 8,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Trainers can view only their own workout programs.  
* Supports filtering, searching, sorting, and pagination.  
* Includes draft, published, and archived programs.  
* Retrieval is recorded in the audit log.

---

---

# **Get Workout Program**

GET /api/v1/workout-programs/:programId

### **Description**

Retrieves detailed information about a specific workout program.

### **Authentication**

Trainer | Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| programId | string | ✅ | Valid Workout Program ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout program retrieved successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "title": "12 Week Strength Program",  
    "description": "Beginner to intermediate strength program.",  
    "goal": "STRENGTH",  
    "durationInWeeks": 12,  
    "status": "PUBLISHED",  
    "days": \[\]  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "programId",  
      "message": "Invalid workout program ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this workout program. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |

---

### **Notes**

* Trainers can access their own programs.  
* Clients can access only assigned programs.  
* Program details are read-only.  
* Retrieval is recorded in the audit log.

---

---

# **Get Assigned Workout Programs**

GET /api/v1/workout-programs/assigned

### **Description**

Retrieves workout programs assigned to the authenticated client.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| status | enum | ❌ | ACTIVE, COMPLETED |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Assigned workout programs retrieved successfully.",  
  "data": {  
    "programs": \[  
      {  
        "programId": "program\_687ab12cd34ef56789012345",  
        "title": "12 Week Strength Program",  
        "assignedAt": "2026-08-03T09:00:00.000Z",  
        "status": "ACTIVE"  
      }  
    \]  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can access assigned workout programs. |

---

### **Notes**

* Returns only programs assigned to the authenticated client.  
* Archived or deleted assignments are excluded.  
* Supports pagination.  
* Used by the client's workout dashboard.

---

---

# **Update Workout Program**

PATCH /api/v1/workout-programs/:programId

### **Description**

Updates an existing workout program. Only draft programs can be freely modified.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "16 Week Strength Program",  
  "durationInWeeks": 16,  
  "description": "Updated workout plan."  
}

Only the fields that need to be updated should be included.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout program updated successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "updatedAt": "2026-08-02T14:15:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "durationInWeeks",  
      "message": "Duration must be greater than zero."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the program owner can update it. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |
| 409 | PROGRAM\_ALREADY\_ARCHIVED | Archived programs cannot be updated. |

---

### **Notes**

* Only the trainer who created the program can update it.  
* Published programs should be versioned instead of modified if already assigned to clients.  
* Existing workout completion records are never affected.  
* Every update is recorded in the audit log.

---

---

 

# **Delete Workout Program**

DELETE /api/v1/workout-programs/:programId

### **Description**

Deletes a workout program that is no longer needed. Only draft or unassigned programs can be deleted.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| programId | string | ✅ | Valid Workout Program ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout program deleted successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the program owner can delete it. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |
| 409 | PROGRAM\_ALREADY\_ASSIGNED | Assigned programs cannot be deleted. |
| 409 | PROGRAM\_ALREADY\_ARCHIVED | Archived programs cannot be deleted. |

---

### **Notes**

* Only the trainer who created the program can delete it.  
* Programs assigned to clients cannot be deleted.  
* Historical workout completion data is preserved.  
* Program deletion is recorded in the audit log.

---

---

# **Duplicate Workout Program**

POST /api/v1/workout-programs/:programId/duplicate

### **Description**

Creates a copy of an existing workout program for reuse or modification.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "12 Week Strength Program v2"  
}

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Workout program duplicated successfully.",  
  "data": {  
    "programId": "program\_987ab12cd34ef56789012345",  
    "status": "DRAFT"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the program owner can duplicate it. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |

---

### **Notes**

* The duplicated program is always created as **DRAFT**.  
* Client assignments are not copied.  
* Workout completion history is not copied.  
* Duplication is recorded in the audit log.

---

---

# **Assign Workout Program**

POST /api/v1/workout-programs/:programId/assign

### **Description**

Assigns a published workout program to one or more clients.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "clientIds": \[  
    "client\_687ab12cd34ef56789012345",  
    "client\_687ab12cd34ef56789012346"  
  \],  
  "startDate": "2026-08-05",  
  "endDate": "2026-10-28"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| clientIds | array | ✅ | At least one Client ID |
| startDate | date | ✅ | Valid future date |
| endDate | date | ✅ | Must be after startDate |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout program assigned successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "assignedClients": 2  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "clientIds",  
      "message": "At least one client must be selected."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer who owns the program can assign it. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |
| 404 | CLIENT\_NOT\_FOUND | One or more clients do not exist. |
| 409 | PROGRAM\_NOT\_PUBLISHED | Only published programs can be assigned. |

---

### **Notes**

* Only published workout programs can be assigned.  
* Multiple clients can receive the same program.  
* Assignment creates individual workout schedules.  
* Clients receive assignment notifications.  
* Assignment is recorded in the audit log.

---

---

# **Publish Workout Program**

POST /api/v1/workout-programs/:programId/publish

### **Description**

Publishes a draft workout program, making it available for client assignment.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout program published successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "status": "PUBLISHED",  
    "publishedAt": "2026-08-02T18:15:20.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the program owner can publish it. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |
| 409 | PROGRAM\_ALREADY\_PUBLISHED | Program is already published. |
| 409 | PROGRAM\_VALIDATION\_FAILED | Program is incomplete and cannot be published. |

---

### **Notes**

* Only draft programs can be published.  
* Published programs become available for assignment.  
* Required workout days and exercises must be completed.  
* Publishing is recorded in the audit log.

---

---

# **Archive Workout Program**

POST /api/v1/workout-programs/:programId/archive

### **Description**

Archives a published workout program so it can no longer be assigned to new clients while preserving historical records.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "programId": "program\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Workout program archived successfully.",  
  "data": {  
    "programId": "program\_687ab12cd34ef56789012345",  
    "status": "ARCHIVED",  
    "archivedAt": "2026-10-30T18:20:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the program owner can archive it. |
| 404 | WORKOUT\_PROGRAM\_NOT\_FOUND | Workout program does not exist. |
| 409 | PROGRAM\_ALREADY\_ARCHIVED | Program is already archived. |
| 409 | PROGRAM\_IN\_USE | Program has active assignments that prevent archiving according to platform policy. |

---

### **Notes**

* Archived programs cannot be assigned to new clients.  
* Existing client assignments continue to function normally.  
* Archived programs remain available for historical reference.  
* Trainers can duplicate archived programs to create new versions.  
* Archiving is recorded in the audit log.

---

---

 

# **09\_Nutrition**

**NutritionPlan.api.md**

# **Create Nutrition Plan**

POST /api/v1/nutrition-plans

### **Description**

Creates a new nutrition plan template that can later be assigned to one or more clients.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "12 Week Fat Loss Nutrition Plan",  
  "description": "High-protein nutrition plan for fat loss.",  
  "goal": "FAT\_LOSS",  
  "durationInWeeks": 12,  
  "dailyCalories": 2200,  
  "macroTargets": {  
    "protein": 180,  
    "carbohydrates": 220,  
    "fat": 60  
  },  
  "days": \[  
    {  
      "day": 1,  
      "meals": \[  
        {  
          "mealType": "BREAKFAST",  
          "title": "Oats with Eggs"  
        }  
      \]  
    }  
  \]  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| title | string | ✅ | 3–100 characters |
| description | string | ❌ | Maximum 2000 characters |
| goal | enum | ✅ | FAT\_LOSS, MUSCLE\_GAIN, MAINTENANCE |
| durationInWeeks | number | ✅ | Greater than 0 |
| dailyCalories | number | ✅ | Greater than 0 |
| macroTargets | object | ✅ | Valid macro values |
| days | array | ✅ | At least one nutrition day |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Nutrition plan created successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "status": "DRAFT",  
    "createdAt": "2026-08-03T09:15:20.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "title",  
      "message": "Nutrition plan title is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can create nutrition plans. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* New nutrition plans are created as **DRAFT**.  
* Nutrition plans can be edited until published.  
* Plans can later be assigned to clients.  
* Nutrition plan creation is recorded in the audit log.

---

---

# **Get Nutrition Plans**

GET /api/v1/nutrition-plans

### **Description**

Retrieves all nutrition plans created by the authenticated trainer.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| status | enum | ❌ | DRAFT, PUBLISHED, ARCHIVED |
| search | string | ❌ | Nutrition plan title |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plans retrieved successfully.",  
  "data": {  
    "plans": \[  
      {  
        "planId": "plan\_687ab12cd34ef56789012345",  
        "title": "12 Week Fat Loss Nutrition Plan",  
        "goal": "FAT\_LOSS",  
        "durationInWeeks": 12,  
        "status": "PUBLISHED"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 6,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Trainers can view only their own nutrition plans.  
* Supports pagination, filtering, searching, and sorting.  
* Includes draft, published, and archived plans.  
* Retrieval is recorded in the audit log.

---

---

# **Get Nutrition Plan**

GET /api/v1/nutrition-plans/:planId

### **Description**

Retrieves detailed information about a specific nutrition plan.

### **Authentication**

Trainer | Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| planId | string | ✅ | Valid Nutrition Plan ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plan retrieved successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "title": "12 Week Fat Loss Nutrition Plan",  
    "description": "High-protein nutrition plan for fat loss.",  
    "goal": "FAT\_LOSS",  
    "dailyCalories": 2200,  
    "macroTargets": {  
      "protein": 180,  
      "carbohydrates": 220,  
      "fat": 60  
    },  
    "status": "PUBLISHED",  
    "days": \[\]  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "planId",  
      "message": "Invalid nutrition plan ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this nutrition plan. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |

---

### **Notes**

* Trainers can access their own nutrition plans.  
* Clients can access only assigned nutrition plans.  
* Nutrition plans are read-only through this endpoint.  
* Retrieval is recorded in the audit log.

---

---

# **Get Assigned Nutrition Plans**

GET /api/v1/nutrition-plans/assigned

### **Description**

Retrieves nutrition plans assigned to the authenticated client.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| status | enum | ❌ | ACTIVE, COMPLETED |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Assigned nutrition plans retrieved successfully.",  
  "data": {  
    "plans": \[  
      {  
        "planId": "plan\_687ab12cd34ef56789012345",  
        "title": "12 Week Fat Loss Nutrition Plan",  
        "assignedAt": "2026-08-04T09:00:00.000Z",  
        "status": "ACTIVE"  
      }  
    \]  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can access assigned nutrition plans. |

---

### **Notes**

* Returns only nutrition plans assigned to the authenticated client.  
* Archived assignments are excluded.  
* Supports pagination.  
* Used by the client's nutrition dashboard.

---

---

# **Update Nutrition Plan**

PATCH /api/v1/nutrition-plans/:planId

### **Description**

Updates an existing nutrition plan. Only draft nutrition plans can be freely modified.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "16 Week Fat Loss Nutrition Plan",  
  "dailyCalories": 2100,  
  "description": "Updated nutrition strategy."  
}

Only the fields that need to be updated should be included.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plan updated successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "updatedAt": "2026-08-03T15:20:42.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "dailyCalories",  
      "message": "Daily calories must be greater than zero."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the plan owner can update it. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |
| 409 | PLAN\_ALREADY\_ARCHIVED | Archived nutrition plans cannot be updated. |

---

### **Notes**

* Only the trainer who created the nutrition plan can update it.  
* Published plans should be versioned instead of modified after assignment.  
* Existing nutrition completion records remain unchanged.  
* Every update is recorded in the audit log.

---

---

 

# **Delete Nutrition Plan**

DELETE /api/v1/nutrition-plans/:planId

### **Description**

Deletes a nutrition plan that is no longer needed. Only draft or unassigned nutrition plans can be deleted.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| planId | string | ✅ | Valid Nutrition Plan ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plan deleted successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the plan owner can delete it. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |
| 409 | PLAN\_ALREADY\_ASSIGNED | Assigned nutrition plans cannot be deleted. |
| 409 | PLAN\_ALREADY\_ARCHIVED | Archived nutrition plans cannot be deleted. |

---

### **Notes**

* Only the trainer who created the nutrition plan can delete it.  
* Assigned plans cannot be deleted.  
* Historical nutrition completion records are preserved.  
* Nutrition plan deletion is recorded in the audit log.

---

---

# **Duplicate Nutrition Plan**

POST /api/v1/nutrition-plans/:planId/duplicate

### **Description**

Creates a copy of an existing nutrition plan for reuse or modification.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "title": "12 Week Fat Loss Nutrition Plan v2"  
}

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Nutrition plan duplicated successfully.",  
  "data": {  
    "planId": "plan\_987ab12cd34ef56789012345",  
    "status": "DRAFT"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the plan owner can duplicate it. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |

---

### **Notes**

* The duplicated plan is always created as **DRAFT**.  
* Client assignments are not copied.  
* Nutrition completion history is not copied.  
* Duplication is recorded in the audit log.

---

---

# **Assign Nutrition Plan**

POST /api/v1/nutrition-plans/:planId/assign

### **Description**

Assigns a published nutrition plan to one or more clients.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "clientIds": \[  
    "client\_687ab12cd34ef56789012345",  
    "client\_687ab12cd34ef56789012346"  
  \],  
  "startDate": "2026-08-05",  
  "endDate": "2026-10-28"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| clientIds | array | ✅ | At least one Client ID |
| startDate | date | ✅ | Valid future date |
| endDate | date | ✅ | Must be after startDate |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plan assigned successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "assignedClients": 2  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "clientIds",  
      "message": "At least one client must be selected."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer who owns the plan can assign it. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |
| 404 | CLIENT\_NOT\_FOUND | One or more clients do not exist. |
| 409 | PLAN\_NOT\_PUBLISHED | Only published nutrition plans can be assigned. |

---

### **Notes**

* Only published nutrition plans can be assigned.  
* Multiple clients can receive the same nutrition plan.  
* Assignment creates individual nutrition schedules.  
* Clients receive assignment notifications.  
* Assignment is recorded in the audit log.

---

---

# **Publish Nutrition Plan**

POST /api/v1/nutrition-plans/:planId/publish

### **Description**

Publishes a draft nutrition plan, making it available for client assignment.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plan published successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "status": "PUBLISHED",  
    "publishedAt": "2026-08-03T18:20:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the plan owner can publish it. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |
| 409 | PLAN\_ALREADY\_PUBLISHED | Nutrition plan is already published. |
| 409 | PLAN\_VALIDATION\_FAILED | Nutrition plan is incomplete and cannot be published. |

---

### **Notes**

* Only draft nutrition plans can be published.  
* Published plans become available for assignment.  
* All required meals, macro targets, and nutrition days must be completed.  
* Publishing is recorded in the audit log.

---

---

# **Archive Nutrition Plan**

POST /api/v1/nutrition-plans/:planId/archive

### **Description**

Archives a published nutrition plan so it can no longer be assigned to new clients while preserving historical records.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "planId": "plan\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition plan archived successfully.",  
  "data": {  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "status": "ARCHIVED",  
    "archivedAt": "2026-10-30T18:30:20.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the plan owner can archive it. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Nutrition plan does not exist. |
| 409 | PLAN\_ALREADY\_ARCHIVED | Nutrition plan is already archived. |
| 409 | PLAN\_IN\_USE | Nutrition plan has active assignments that prevent archiving according to platform policy. |

---

### **Notes**

* Archived nutrition plans cannot be assigned to new clients.  
* Existing client assignments continue to function normally.  
* Archived plans remain available for historical reference.  
* Trainers can duplicate archived plans to create new versions.  
* Archiving is recorded in the audit log.

---

---

   
**NutritionCompletion.api.md**

# **Create Nutrition Completion**

POST /api/v1/nutrition-completions

### **Description**

Records a client's nutrition completion for a specific day in an assigned nutrition plan.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "planId": "plan\_687ab12cd34ef56789012345",  
  "dayNumber": 5,  
  "completedMeals": \[  
    {  
      "mealType": "BREAKFAST",  
      "completed": true  
    },  
    {  
      "mealType": "LUNCH",  
      "completed": true  
    },  
    {  
      "mealType": "DINNER",  
      "completed": false  
    }  
  \],  
  "waterIntakeLiters": 2.8,  
  "notes": "Skipped dinner due to travel."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| planId | string | ✅ | Valid assigned Nutrition Plan ID |
| dayNumber | number | ✅ | Greater than 0 |
| completedMeals | array | ✅ | At least one completed meal |
| waterIntakeLiters | number | ❌ | Greater than or equal to 0 |
| notes | string | ❌ | Maximum 1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Nutrition completion recorded successfully.",  
  "data": {  
    "completionId": "completion\_687ab12cd34ef56789012345",  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "dayNumber": 5,  
    "completionPercentage": 67,  
    "completedAt": "2026-08-05T19:45:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "dayNumber",  
      "message": "Day number must be greater than zero."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can record nutrition completion. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | NUTRITION\_PLAN\_NOT\_FOUND | Assigned nutrition plan does not exist. |
| 409 | DAY\_ALREADY\_COMPLETED | Nutrition completion has already been submitted for this day. |
| 409 | PLAN\_NOT\_ACTIVE | Nutrition plan is not currently active. |

---

### **Notes**

* Only the assigned client can submit nutrition completion.  
* Each nutrition day can be completed only once.  
* Completion percentage is calculated automatically.  
* Trainers can review nutrition completion through the coaching dashboard.  
* Nutrition completion contributes to overall coaching progress.  
* Nutrition completion is recorded in the audit log.

---

---

# **Get Nutrition Completions**

GET /api/v1/nutrition-completions

### **Description**

Retrieves nutrition completion records for the authenticated client.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| planId | string | ❌ | Filter by Nutrition Plan |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition completions retrieved successfully.",  
  "data": {  
    "completions": \[  
      {  
        "completionId": "completion\_687ab12cd34ef56789012345",  
        "planId": "plan\_687ab12cd34ef56789012345",  
        "dayNumber": 5,  
        "completionPercentage": 67,  
        "completedAt": "2026-08-05T19:45:30.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 25,  
      "totalPages": 3  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their own nutrition completions.  
* Trainers can view nutrition completions of their active clients.  
* Supports filtering, pagination, and sorting.  
* Used for nutrition tracking and coaching analytics.  
* Retrieval is recorded in the audit log.

---

---

# **Get Nutrition Completion**

GET /api/v1/nutrition-completions/:completionId

### **Description**

Retrieves detailed information about a specific nutrition completion record.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "completionId": "completion\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| completionId | string | ✅ | Valid Nutrition Completion ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition completion retrieved successfully.",  
  "data": {  
    "completionId": "completion\_687ab12cd34ef56789012345",  
    "planId": "plan\_687ab12cd34ef56789012345",  
    "dayNumber": 5,  
    "completedMeals": \[  
      {  
        "mealType": "BREAKFAST",  
        "completed": true  
      },  
      {  
        "mealType": "LUNCH",  
        "completed": true  
      },  
      {  
        "mealType": "DINNER",  
        "completed": false  
      }  
    \],  
    "waterIntakeLiters": 2.8,  
    "completionPercentage": 67,  
    "notes": "Skipped dinner due to travel.",  
    "completedAt": "2026-08-05T19:45:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "completionId",  
      "message": "Invalid nutrition completion ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this nutrition completion. |
| 404 | NUTRITION\_COMPLETION\_NOT\_FOUND | Nutrition completion does not exist. |

---

### **Notes**

* Clients can access only their own nutrition completion records.  
* Trainers can access completion records of their assigned clients.  
* Nutrition completion records are read-only through this endpoint.  
* Used for nutrition progress analysis and coaching review.  
* Retrieval is recorded in the audit log.

---

---

# **Get Nutrition Completion History**

GET /api/v1/nutrition-completions/history

### **Description**

Retrieves the nutrition completion history for the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| planId | string | ❌ | Filter by Nutrition Plan |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| completionStatus | enum | ❌ | COMPLETED, PARTIALLY\_COMPLETED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition completion history retrieved successfully.",  
  "data": {  
    "completions": \[  
      {  
        "completionId": "completion\_687ab12cd34ef56789012345",  
        "planId": "plan\_687ab12cd34ef56789012345",  
        "dayNumber": 5,  
        "completionPercentage": 92,  
        "completedAt": "2026-08-05T19:45:30.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 48,  
      "totalPages": 5  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their own nutrition completion history.  
* Trainers can view nutrition completion history for their assigned clients.  
* Supports filtering by nutrition plan, date range, and completion status.  
* Results are paginated and sorted by completion date.  
* Historical records cannot be modified through this endpoint.  
* Nutrition completion history is recorded for coaching analytics and auditing.

---

---

# **Update Nutrition Completion**

PATCH /api/v1/nutrition-completions/:completionId

### **Description**

Updates an existing nutrition completion record. Clients can modify their nutrition log before the daily submission window closes.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "completionId": "completion\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| completionId | string | ✅ | Valid Nutrition Completion ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "completedMeals": \[  
    {  
      "mealType": "DINNER",  
      "completed": true  
    }  
  \],  
  "waterIntakeLiters": 3.2,  
  "notes": "Completed dinner later in the evening."  
}

Only the fields that need to be updated should be included.

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| completedMeals | array | ❌ | Valid completed meal records |
| waterIntakeLiters | number | ❌ | Greater than or equal to 0 |
| notes | string | ❌ | Maximum 1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Nutrition completion updated successfully.",  
  "data": {  
    "completionId": "completion\_687ab12cd34ef56789012345",  
    "completionPercentage": 100,  
    "updatedAt": "2026-08-05T21:10:42.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "waterIntakeLiters",  
      "message": "Water intake cannot be negative."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the client who owns the nutrition completion can update it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | NUTRITION\_COMPLETION\_NOT\_FOUND | Nutrition completion does not exist. |
| 409 | EDIT\_WINDOW\_CLOSED | The nutrition completion can no longer be edited. |
| 409 | PLAN\_NOT\_ACTIVE | Associated nutrition plan is no longer active. |

---

### **Notes**

* Only the client who created the nutrition completion can update it.  
* Only editable fields supplied in the request are updated.  
* Nutrition completion can only be edited within the allowed submission window.  
* Completion percentage is automatically recalculated after every update.  
* Trainers cannot modify client nutrition completion records.  
* Every update is recorded in the audit log.

---

---

 

# **10\_Progress**

**CoachingEvaluation.api.md**

# **Create Coaching Evaluation**

POST /api/v1/coaching-evaluations

### **Description**

Creates a coaching evaluation after a coaching relationship has been completed. The evaluation summarizes the client's overall progress and outcomes.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "relationshipId": "relationship\_687ab12cd34ef56789012345",  
  "overallRating": 5,  
  "strengths": \[  
    "Excellent consistency",  
    "Improved strength significantly"  
  \],  
  "improvements": \[  
    "Continue improving mobility"  
  \],  
  "trainerNotes": "Client achieved all primary goals.",  
  "recommendedNextProgram": "Advanced Strength Phase"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| relationshipId | string | ✅ | Valid Coaching Relationship ID |
| overallRating | number | ✅ | Integer between 1 and 5 |
| strengths | array | ❌ | Maximum 20 items |
| improvements | array | ❌ | Maximum 20 items |
| trainerNotes | string | ❌ | Maximum 3000 characters |
| recommendedNextProgram | string | ❌ | Maximum 150 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Coaching evaluation created successfully.",  
  "data": {  
    "evaluationId": "evaluation\_687ab12cd34ef56789012345",  
    "relationshipId": "relationship\_687ab12cd34ef56789012345",  
    "createdAt": "2026-08-10T18:25:40.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "overallRating",  
      "message": "Overall rating must be between 1 and 5."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can create coaching evaluations. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | COACHING\_RELATIONSHIP\_NOT\_FOUND | Coaching relationship does not exist. |
| 409 | RELATIONSHIP\_NOT\_COMPLETED | Evaluation can only be created after coaching completion. |
| 409 | EVALUATION\_ALREADY\_EXISTS | A coaching evaluation already exists for this relationship. |

---

### **Notes**

* Only one coaching evaluation can exist per coaching relationship.  
* Only completed coaching relationships can be evaluated.  
* Trainers can evaluate only their own coaching relationships.  
* Clients can view the evaluation after it is created.  
* Coaching evaluations become part of the client's coaching history.  
* Creation is recorded in the audit log.

---

---

# **Get Coaching Evaluations**

GET /api/v1/coaching-evaluations

### **Description**

Retrieves a paginated list of coaching evaluations associated with the authenticated user.

### **Authentication**

Trainer | Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| relationshipId | string | ❌ | Filter by coaching relationship |
| rating | number | ❌ | Filter by overall rating |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching evaluations retrieved successfully.",  
  "data": {  
    "evaluations": \[  
      {  
        "evaluationId": "evaluation\_687ab12cd34ef56789012345",  
        "relationshipId": "relationship\_687ab12cd34ef56789012345",  
        "overallRating": 5,  
        "createdAt": "2026-08-10T18:25:40.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 12,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Trainers can view evaluations they created.  
* Clients can view evaluations for their own completed coaching relationships.  
* Supports pagination, filtering, and sorting.  
* Results are ordered by newest first.  
* Retrieval is recorded in the audit log.

---

---

# **Get Coaching Evaluation**

GET /api/v1/coaching-evaluations/:evaluationId

### **Description**

Retrieves detailed information about a specific coaching evaluation.

### **Authentication**

Trainer | Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "evaluationId": "evaluation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| evaluationId | string | ✅ | Valid Coaching Evaluation ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching evaluation retrieved successfully.",  
  "data": {  
    "evaluationId": "evaluation\_687ab12cd34ef56789012345",  
    "relationshipId": "relationship\_687ab12cd34ef56789012345",  
    "overallRating": 5,  
    "strengths": \[  
      "Excellent consistency",  
      "Improved strength significantly"  
    \],  
    "improvements": \[  
      "Continue improving mobility"  
    \],  
    "trainerNotes": "Client achieved all primary goals.",  
    "recommendedNextProgram": "Advanced Strength Phase",  
    "createdAt": "2026-08-10T18:25:40.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "evaluationId",  
      "message": "Invalid coaching evaluation ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this coaching evaluation. |
| 404 | COACHING\_EVALUATION\_NOT\_FOUND | Coaching evaluation does not exist. |

---

### **Notes**

* Trainers can access evaluations they created.  
* Clients can access evaluations for their own coaching relationships.  
* Coaching evaluations are read-only after creation.  
* Used as the final summary of the coaching engagement.  
* Retrieval is recorded in the audit log.

---

---

 

# **Get Coaching Evaluation History**

GET /api/v1/coaching-evaluations/history

### **Description**

Retrieves the coaching evaluation history associated with the authenticated user.

### **Authentication**

Trainer | Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Page number (Default: 1\) |
| limit | number | ❌ | Number of records per page (Default: 10\) |
| relationshipId | string | ❌ | Filter by Coaching Relationship |
| rating | number | ❌ | Filter by Overall Rating |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching evaluation history retrieved successfully.",  
  "data": {  
    "evaluations": \[  
      {  
        "evaluationId": "evaluation\_687ab12cd34ef56789012345",  
        "relationshipId": "relationship\_687ab12cd34ef56789012345",  
        "overallRating": 5,  
        "published": true,  
        "createdAt": "2026-08-10T18:25:40.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 18,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Trainers can view evaluations they have created.  
* Clients can view evaluation history for their own completed coaching relationships.  
* Supports filtering, sorting, pagination, and date range queries.  
* Historical evaluation records are immutable.  
* Evaluation history is used for long-term coaching analytics.  
* Retrieval is recorded in the audit log.

---

---

# **Update Coaching Evaluation**

PATCH /api/v1/coaching-evaluations/:evaluationId

### **Description**

Updates an unpublished coaching evaluation before it is shared with the client.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "evaluationId": "evaluation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| evaluationId | string | ✅ | Valid Coaching Evaluation ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "overallRating": 4,  
  "trainerNotes": "Client achieved excellent progress with improved consistency.",  
  "recommendedNextProgram": "Hypertrophy Phase 1"  
}

Only the fields that need to be updated should be included.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching evaluation updated successfully.",  
  "data": {  
    "evaluationId": "evaluation\_687ab12cd34ef56789012345",  
    "updatedAt": "2026-08-10T19:10:35.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "overallRating",  
      "message": "Overall rating must be between 1 and 5."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer who created the evaluation can update it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | COACHING\_EVALUATION\_NOT\_FOUND | Coaching evaluation does not exist. |
| 409 | EVALUATION\_ALREADY\_PUBLISHED | Published evaluations cannot be modified. |

---

### **Notes**

* Only the trainer who created the evaluation can update it.  
* Only unpublished evaluations can be edited.  
* Only supplied fields are updated.  
* Published evaluations become immutable.  
* Every update is recorded in the audit log.

---

---

# **Publish Coaching Evaluation**

POST /api/v1/coaching-evaluations/:evaluationId/publish

### **Description**

Publishes a coaching evaluation, making it visible to the client as the final coaching summary.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "evaluationId": "evaluation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| evaluationId | string | ✅ | Valid Coaching Evaluation ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Coaching evaluation published successfully.",  
  "data": {  
    "evaluationId": "evaluation\_687ab12cd34ef56789012345",  
    "published": true,  
    "publishedAt": "2026-08-10T19:25:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer who created the evaluation can publish it. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | COACHING\_EVALUATION\_NOT\_FOUND | Coaching evaluation does not exist. |
| 409 | EVALUATION\_ALREADY\_PUBLISHED | Coaching evaluation has already been published. |
| 409 | EVALUATION\_INCOMPLETE | Evaluation must be completed before publishing. |

---

### **Notes**

* Only the trainer who created the evaluation can publish it.  
* Publishing is a one-way operation and cannot be undone.  
* Once published, the evaluation becomes visible to the client.  
* Published evaluations cannot be edited.  
* The client receives a notification after publication.  
* Publishing is recorded in the audit log.

---

---

 

# **11\_Communication**

**Message.api.md**

# **Create Message**

POST /api/v1/messages

### **Description**

Sends a new message to another participant within an active coaching relationship.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "conversationId": "conversation\_687ab12cd34ef56789012345",  
  "content": "I completed today's workout. Can you review my form?",  
  "attachments": \[  
    {  
      "type": "IMAGE",  
      "fileId": "file\_687ab12cd34ef56789012345"  
    }  
  \]  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| conversationId | string | ✅ | Valid Conversation ID |
| content | string | ✅ | 1–5000 characters |
| attachments | array | ❌ | Valid uploaded files |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Message sent successfully.",  
  "data": {  
    "messageId": "message\_687ab12cd34ef56789012345",  
    "conversationId": "conversation\_687ab12cd34ef56789012345",  
    "sentAt": "2026-08-12T14:20:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "content",  
      "message": "Message content is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this conversation. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | CONVERSATION\_NOT\_FOUND | Conversation does not exist. |
| 409 | CONVERSATION\_CLOSED | Messages cannot be sent to a closed conversation. |

---

### **Notes**

* Only conversation participants can send messages.  
* Messages may include optional attachments.  
* Messages are delivered in real time through WebSocket/Socket.IO.  
* Every message is permanently stored.  
* Message creation is recorded in the audit log.

---

---

# **Get Messages**

GET /api/v1/messages

### **Description**

Retrieves messages for a conversation.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| conversationId | string | ✅ | Conversation ID |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 30 |
| before | string | ❌ | Cursor for pagination |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Messages retrieved successfully.",  
  "data": {  
    "messages": \[  
      {  
        "messageId": "message\_687ab12cd34ef56789012345",  
        "senderId": "user\_687ab12cd34ef56789012345",  
        "content": "I completed today's workout.",  
        "sentAt": "2026-08-12T14:20:15.000Z",  
        "isEdited": false  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 30,  
      "hasMore": true  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this conversation. |
| 404 | CONVERSATION\_NOT\_FOUND | Conversation does not exist. |

---

### **Notes**

* Returns messages for a single conversation.  
* Supports cursor or page-based pagination.  
* Messages are ordered chronologically.  
* Soft-deleted messages are excluded.  
* Retrieval is recorded in the audit log.

---

---

# **Get Message**

GET /api/v1/messages/:messageId

### **Description**

Retrieves the details of a specific message.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "messageId": "message\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| messageId | string | ✅ | Valid Message ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Message retrieved successfully.",  
  "data": {  
    "messageId": "message\_687ab12cd34ef56789012345",  
    "conversationId": "conversation\_687ab12cd34ef56789012345",  
    "senderId": "user\_687ab12cd34ef56789012345",  
    "content": "I completed today's workout.",  
    "attachments": \[\],  
    "isEdited": false,  
    "sentAt": "2026-08-12T14:20:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "messageId",  
      "message": "Invalid message ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not authorized to access this message. |
| 404 | MESSAGE\_NOT\_FOUND | Message does not exist. |

---

### **Notes**

* Only conversation participants can access the message.  
* Includes attachments and edit status.  
* Deleted messages cannot be retrieved.  
* Retrieval is recorded in the audit log.

---

---

# **Get Conversations**

GET /api/v1/messages/conversations

### **Description**

Retrieves all conversations for the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| search | string | ❌ | Search by participant name |
| unreadOnly | boolean | ❌ | Return only conversations with unread messages |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Conversations retrieved successfully.",  
  "data": {  
    "conversations": \[  
      {  
        "conversationId": "conversation\_687ab12cd34ef56789012345",  
        "participant": {  
          "userId": "user\_687ab12cd34ef56789012345",  
          "name": "John Doe"  
        },  
        "lastMessage": "I completed today's workout.",  
        "lastMessageAt": "2026-08-12T14:20:15.000Z",  
        "unreadCount": 2  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 8,  
      "totalPages": 1  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns only conversations where the authenticated user is a participant.  
* Includes the latest message preview and unread count.  
* Supports pagination and searching.  
* Ordered by the most recent message.  
* Retrieval is recorded in the audit log.

---

---

 

# **Get Conversation**

GET /api/v1/messages/conversations/:conversationId

### **Description**

Retrieves detailed information about a specific conversation, including participants, conversation metadata, and the latest message.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "conversationId": "conversation\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| conversationId | string | ✅ | Valid Conversation ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Conversation retrieved successfully.",  
  "data": {  
    "conversationId": "conversation\_687ab12cd34ef56789012345",  
    "participants": \[  
      {  
        "userId": "trainer\_687ab12cd34ef56789012345",  
        "name": "Alex Trainer"  
      },  
      {  
        "userId": "client\_687ab12cd34ef56789012345",  
        "name": "John Doe"  
      }  
    \],  
    "lastMessage": {  
      "messageId": "message\_687ab12cd34ef56789012345",  
      "content": "Great job today\!",  
      "sentAt": "2026-08-12T18:20:15.000Z"  
    },  
    "createdAt": "2026-08-01T09:00:00.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "conversationId",  
      "message": "Invalid conversation ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this conversation. |
| 404 | CONVERSATION\_NOT\_FOUND | Conversation does not exist. |

---

### **Notes**

* Only conversation participants can access conversation details.  
* Does not return the full message history.  
* Use **Get Messages** to retrieve conversation messages.  
* Retrieval is recorded in the audit log.

---

---

# **Get Unread Message Count**

GET /api/v1/messages/unread-count

### **Description**

Retrieves the total number of unread messages across all conversations for the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Unread message count retrieved successfully.",  
  "data": {  
    "totalUnreadMessages": 7,  
    "totalUnreadConversations": 3  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns unread counts across all conversations.  
* Used for notification badges.  
* Count updates in real time when messages are read.  
* Retrieval is recorded in the audit log.

---

---

# **Mark Messages as Read**

POST /api/v1/messages/mark-read

### **Description**

Marks one or more unread messages as read.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "conversationId": "conversation\_687ab12cd34ef56789012345",  
  "messageIds": \[  
    "message\_687ab12cd34ef56789012345",  
    "message\_687ab12cd34ef56789012346"  
  \]  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| conversationId | string | ✅ | Valid Conversation ID |
| messageIds | array | ✅ | At least one valid Message ID |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Messages marked as read successfully.",  
  "data": {  
    "updatedMessages": 2,  
    "conversationId": "conversation\_687ab12cd34ef56789012345"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "messageIds",  
      "message": "At least one message ID is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this conversation. |
| 404 | CONVERSATION\_NOT\_FOUND | Conversation does not exist. |
| 404 | MESSAGE\_NOT\_FOUND | One or more messages do not exist. |

---

### **Notes**

* Only unread messages belonging to the authenticated user are updated.  
* Messages sent by the authenticated user are ignored.  
* Read receipts are synchronized in real time via Socket.IO.  
* Updating already-read messages is idempotent.  
* Message read events are recorded in the audit log.

---

---

 

# **Update Message**

PATCH /api/v1/messages/:messageId

### **Description**

Updates the content of a previously sent message.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "messageId": "message\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| messageId | string | ✅ | Valid Message ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "content": "I completed today's workout and uploaded a better video."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| content | string | ✅ | 1–5000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Message updated successfully.",  
  "data": {  
    "messageId": "message\_687ab12cd34ef56789012345",  
    "isEdited": true,  
    "updatedAt": "2026-08-12T18:35:42.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "content",  
      "message": "Message content cannot be empty."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You can edit only your own messages. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | MESSAGE\_NOT\_FOUND | Message does not exist. |
| 409 | MESSAGE\_EDIT\_WINDOW\_EXPIRED | The message can no longer be edited. |
| 409 | MESSAGE\_DELETED | Deleted messages cannot be edited. |

---

### **Notes**

* Only the original sender can edit a message.  
* Only the message content can be updated.  
* Edited messages are marked with an **edited** indicator.  
* Attachments cannot be modified after sending.  
* Message updates are synchronized in real time via Socket.IO.  
* Message edits are recorded in the audit log.

---

---

# **Delete Message**

DELETE /api/v1/messages/:messageId

### **Description**

Deletes a previously sent message from the conversation.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "messageId": "message\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| messageId | string | ✅ | Valid Message ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Message deleted successfully.",  
  "data": {  
    "messageId": "message\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You can delete only your own messages. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | MESSAGE\_NOT\_FOUND | Message does not exist. |
| 409 | MESSAGE\_ALREADY\_DELETED | Message has already been deleted. |

---

### **Notes**

* Only the original sender can delete a message.  
* Deleted messages are soft deleted to preserve conversation integrity.  
* Attachments associated with the message become inaccessible.  
* Deletion is synchronized in real time via Socket.IO.  
* Message deletion is recorded in the audit log.

---

---

# **Report Message**

POST /api/v1/messages/:messageId/report

### **Description**

Reports a message for inappropriate content, harassment, spam, or other violations. The report is forwarded to the moderation system for review.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "messageId": "message\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| messageId | string | ✅ | Valid Message ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "HARASSMENT",  
  "description": "The message contains abusive language."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | enum | ✅ | SPAM, HARASSMENT, HATE\_SPEECH, SCAM, INAPPROPRIATE\_CONTENT, OTHER |
| description | string | ❌ | Maximum 1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Message reported successfully.",  
  "data": {  
    "reportId": "report\_687ab12cd34ef56789012345",  
    "messageId": "message\_687ab12cd34ef56789012345",  
    "status": "PENDING\_REVIEW",  
    "reportedAt": "2026-08-12T19:10:25.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "A valid report reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 403 | CANNOT\_REPORT\_OWN\_MESSAGE | You cannot report your own message. |
| 404 | MESSAGE\_NOT\_FOUND | Message does not exist. |
| 409 | MESSAGE\_ALREADY\_REPORTED | You have already reported this message. |

---

### **Notes**

* Only conversation participants can report messages.  
* Users cannot report their own messages.  
* Reporting a message does not remove it automatically.  
* Reports are reviewed by platform administrators.  
* Multiple users may report the same message independently.  
* Every report is recorded in the audit log.

---

---

   
**VideoCall.api.md**

> [!NOTE]
> **Phase 4 Architecture Reconciliation (ADR-015):**
> The `/api/v1/video-calls` endpoints specified below require an active `relationshipId` (CoachingRelationship) and are **INAPPLICABLE** to Phase 4 Marketplace Consultations. Phase 4 Marketplace Consultations use existing `/api/v1/consultations/:consultationId/*` REST APIs for fetching details and completing/cancelling appointments, combined with Socket.IO `webrtc:*` events for transient WebRTC signaling.

# **Create Video Call**

POST /api/v1/video-calls

### **Description**

Schedules a new video call between a trainer and a client within an active coaching relationship.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "relationshipId": "relationship\_687ab12cd34ef56789012345",  
  "scheduledAt": "2026-08-15T10:00:00.000Z",  
  "durationMinutes": 60,  
  "agenda": "Weekly progress review"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| relationshipId | string | ✅ | Valid Coaching Relationship ID |
| scheduledAt | datetime | ✅ | Future date and time |
| durationMinutes | number | ✅ | Greater than 0 |
| agenda | string | ❌ | Maximum 1000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Video call scheduled successfully.",  
  "data": {  
    "callId": "call\_687ab12cd34ef56789012345",  
    "status": "SCHEDULED",  
    "scheduledAt": "2026-08-15T10:00:00.000Z",  
    "createdAt": "2026-08-12T16:25:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "scheduledAt",  
      "message": "Scheduled time must be in the future."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only trainers can schedule video calls. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | COACHING\_RELATIONSHIP\_NOT\_FOUND | Coaching relationship does not exist. |
| 409 | RELATIONSHIP\_NOT\_ACTIVE | Video calls can only be scheduled for active coaching relationships. |
| 409 | VIDEO\_CALL\_TIME\_CONFLICT | A conflicting video call already exists. |

---

### **Notes**

* Only trainers can schedule video calls.  
* Video calls can only be scheduled for active coaching relationships.  
* Meeting credentials are generated before the scheduled start time.  
* Participants receive notifications after scheduling.  
* Scheduling is recorded in the audit log.

---

---

# **Get Video Calls**

GET /api/v1/video-calls

### **Description**

Retrieves a paginated list of video calls associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| status | enum | ❌ | SCHEDULED, LIVE, COMPLETED, CANCELLED |
| relationshipId | string | ❌ | Filter by Coaching Relationship |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Video calls retrieved successfully.",  
  "data": {  
    "videoCalls": \[  
      {  
        "callId": "call\_687ab12cd34ef56789012345",  
        "scheduledAt": "2026-08-15T10:00:00.000Z",  
        "durationMinutes": 60,  
        "status": "SCHEDULED"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 14,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients can view only their own scheduled video calls.  
* Trainers can view video calls for their coaching relationships.  
* Supports filtering, pagination, and sorting.  
* Results are ordered by scheduled date.  
* Retrieval is recorded in the audit log.

---

---

# **Get Video Call**

GET /api/v1/video-calls/:callId

### **Description**

Retrieves detailed information about a specific video call.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "callId": "call\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| callId | string | ✅ | Valid Video Call ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Video call retrieved successfully.",  
  "data": {  
    "callId": "call\_687ab12cd34ef56789012345",  
    "relationshipId": "relationship\_687ab12cd34ef56789012345",  
    "scheduledAt": "2026-08-15T10:00:00.000Z",  
    "durationMinutes": 60,  
    "agenda": "Weekly progress review",  
    "status": "SCHEDULED"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "callId",  
      "message": "Invalid video call ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this video call. |
| 404 | VIDEO\_CALL\_NOT\_FOUND | Video call does not exist. |

---

### **Notes**

* Only participants can access video call details.  
* Meeting credentials are returned only when allowed by platform policy.  
* Video call details are read-only.  
* Retrieval is recorded in the audit log.

---

---

# **Get Video Call History**

GET /api/v1/video-calls/history

### **Description**

Retrieves the video call history associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| relationshipId | string | ❌ | Filter by Coaching Relationship |
| status | enum | ❌ | COMPLETED, CANCELLED |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Video call history retrieved successfully.",  
  "data": {  
    "videoCalls": \[  
      {  
        "callId": "call\_687ab12cd34ef56789012345",  
        "status": "COMPLETED",  
        "startedAt": "2026-08-15T10:02:14.000Z",  
        "endedAt": "2026-08-15T11:01:47.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 22,  
      "totalPages": 3  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Returns completed and cancelled video calls.  
* Supports pagination, filtering, and date range queries.  
* Historical records are immutable.  
* Used for coaching history and analytics.  
* Video call history retrieval is recorded in the audit log.

---

---

 

# **Join Video Call**

POST /api/v1/video-calls/:callId/join

### **Description**

Allows a participant to join a scheduled or active video call. The server generates the required WebRTC session credentials and updates the participant's connection status.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "callId": "call\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| callId | string | ✅ | Valid Video Call ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Joined video call successfully.",  
  "data": {  
    "callId": "call\_687ab12cd34ef56789012345",  
    "status": "LIVE",  
    "participantId": "user\_687ab12cd34ef56789012345",  
    "joinedAt": "2026-08-15T10:00:05.000Z",  
    "webrtc": {  
      "roomId": "room\_123456",  
      "token": "\<SESSION\_TOKEN\>",  
      "iceServers": \[  
        {  
          "urls": "stun:stun.l.google.com:19302"  
        }  
      \]  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "callId",  
      "message": "Invalid video call ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this video call. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | VIDEO\_CALL\_NOT\_FOUND | Video call does not exist. |
| 409 | VIDEO\_CALL\_CANCELLED | Video call has been cancelled. |
| 409 | VIDEO\_CALL\_ALREADY\_ENDED | Video call has already ended. |

---

### **Notes**

* Only participants can join the video call.  
* Joining automatically transitions the call to **LIVE** when the first participant connects.  
* WebRTC session credentials are generated during this request.  
* Socket.IO is used for signaling.  
* Join events are recorded in the audit log.

---

---

# **Reconnect Video Call**

POST /api/v1/video-calls/:callId/reconnect

### **Description**

Reconnects a participant to an ongoing video call after a temporary network interruption.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "callId": "call\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Reconnected to video call successfully.",  
  "data": {  
    "callId": "call\_687ab12cd34ef56789012345",  
    "reconnectedAt": "2026-08-15T10:18:44.000Z",  
    "status": "LIVE"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this video call. |
| 404 | VIDEO\_CALL\_NOT\_FOUND | Video call does not exist. |
| 409 | VIDEO\_CALL\_NOT\_LIVE | Video call is not currently active. |
| 409 | PARTICIPANT\_NOT\_CONNECTED | Participant was never connected to this session. |

---

### **Notes**

* Available only while the call is live.  
* Reuses the existing WebRTC session.  
* Socket.IO re-establishes signaling automatically.  
* Reconnection attempts are recorded in the audit log.

---

---

# **Leave Video Call**

POST /api/v1/video-calls/:callId/leave

### **Description**

Disconnects the authenticated participant from an ongoing video call without ending the session for other participants.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "callId": "call\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Left video call successfully.",  
  "data": {  
    "callId": "call\_687ab12cd34ef56789012345",  
    "leftAt": "2026-08-15T10:42:16.000Z",  
    "status": "LIVE"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You are not a participant in this video call. |
| 404 | VIDEO\_CALL\_NOT\_FOUND | Video call does not exist. |
| 409 | VIDEO\_CALL\_NOT\_LIVE | Video call is not currently active. |

---

### **Notes**

* Leaving disconnects only the authenticated participant.  
* The call continues if another participant remains connected.  
* Media streams are terminated for the leaving participant.  
* Leave events are synchronized through Socket.IO.  
* Leaving is recorded in the audit log.

---

---

# **End Video Call**

POST /api/v1/video-calls/:callId/end

### **Description**

Ends an active video call for all participants and finalizes the session.

### **Authentication**

Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "callId": "call\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| callId | string | ✅ | Valid Video Call ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Video call ended successfully.",  
  "data": {  
    "callId": "call\_687ab12cd34ef56789012345",  
    "status": "COMPLETED",  
    "endedAt": "2026-08-15T11:00:18.000Z",  
    "durationMinutes": 60  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the trainer can end the video call. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | VIDEO\_CALL\_NOT\_FOUND | Video call does not exist. |
| 409 | VIDEO\_CALL\_NOT\_LIVE | Video call is not currently active. |
| 409 | VIDEO\_CALL\_ALREADY\_ENDED | Video call has already ended. |

---

### **Notes**

* Only the trainer can end the session.  
* Ending disconnects all connected participants.  
* The call status changes from **LIVE** to **COMPLETED**.  
* Final call duration is calculated automatically.  
* WebRTC resources are released after the call ends.  
* End events are broadcast through Socket.IO and recorded in the audit log.

---

---

 

# **12\_Review**

**Review.api.md**

# **Create Review**

POST /api/v1/reviews

### **Description**

Creates a review for a completed coaching relationship. Clients can review trainers only after successfully completing a coaching program.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "relationshipId": "relationship\_687ab12cd34ef56789012345",  
  "rating": 5,  
  "title": "Excellent Coaching Experience",  
  "comment": "The trainer was knowledgeable, supportive, and helped me achieve my goals."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| relationshipId | string | ✅ | Valid Coaching Relationship ID |
| rating | number | ✅ | Integer between 1 and 5 |
| title | string | ❌ | Maximum 100 characters |
| comment | string | ✅ | 10–2000 characters |

---

### **Success Response (201 Created)**

{  
  "success": true,  
  "message": "Review created successfully.",  
  "data": {  
    "reviewId": "review\_687ab12cd34ef56789012345",  
    "status": "DRAFT",  
    "createdAt": "2026-08-20T14:20:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "rating",  
      "message": "Rating must be between 1 and 5."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can create reviews. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | COACHING\_RELATIONSHIP\_NOT\_FOUND | Coaching relationship does not exist. |
| 409 | RELATIONSHIP\_NOT\_COMPLETED | Reviews can only be created after coaching completion. |
| 409 | REVIEW\_ALREADY\_EXISTS | A review already exists for this coaching relationship. |

---

### **Notes**

* Only clients can create reviews.  
* One review is allowed per completed coaching relationship.  
* Newly created reviews are saved as **DRAFT**.  
* Reviews become public only after publishing.  
* Review creation is recorded in the audit log.

---

---

# **Get Reviews**

GET /api/v1/reviews

### **Description**

Retrieves reviews associated with the authenticated user.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| rating | number | ❌ | Filter by rating |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Reviews retrieved successfully.",  
  "data": {  
    "reviews": \[  
      {  
        "reviewId": "review\_687ab12cd34ef56789012345",  
        "rating": 5,  
        "title": "Excellent Coaching Experience",  
        "status": "PUBLISHED",  
        "createdAt": "2026-08-20T14:20:15.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 18,  
      "totalPages": 2  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |

---

### **Notes**

* Clients see reviews they have written.  
* Trainers see reviews they have received.  
* Supports pagination, filtering, and sorting.  
* Results are ordered by newest first.  
* Review retrieval is recorded in the audit log.

---

---

# **Get Review**

GET /api/v1/reviews/:reviewId

### **Description**

Retrieves detailed information about a specific review.

### **Authentication**

Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "reviewId": "review\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reviewId | string | ✅ | Valid Review ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Review retrieved successfully.",  
  "data": {  
    "reviewId": "review\_687ab12cd34ef56789012345",  
    "relationshipId": "relationship\_687ab12cd34ef56789012345",  
    "rating": 5,  
    "title": "Excellent Coaching Experience",  
    "comment": "The trainer was knowledgeable, supportive, and helped me achieve my goals.",  
    "status": "PUBLISHED",  
    "createdAt": "2026-08-20T14:20:15.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reviewId",  
      "message": "Invalid review ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | You do not have permission to access this review. |
| 404 | REVIEW\_NOT\_FOUND | Review does not exist. |

---

### **Notes**

* Clients can access reviews they created.  
* Trainers can access reviews received for their coaching services.  
* Published reviews may also be publicly accessible according to platform policy.  
* Review retrieval is recorded in the audit log.

---

---

# **Get My Reviews**

GET /api/v1/reviews/me

### **Description**

Retrieves all reviews created by the authenticated client.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| status | enum | ❌ | DRAFT, PUBLISHED, LOCKED |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Your reviews retrieved successfully.",  
  "data": {  
    "reviews": \[  
      {  
        "reviewId": "review\_687ab12cd34ef56789012345",  
        "rating": 5,  
        "status": "PUBLISHED",  
        "createdAt": "2026-08-20T14:20:15.000Z"  
      }  
    \]  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only clients can access this endpoint. |

---

### **Notes**

* Returns only reviews created by the authenticated client.  
* Supports pagination and filtering.  
* Includes both published and unpublished reviews.  
* Retrieval is recorded in the audit log.

---

---

# **Get Trainer Reviews**

GET /api/v1/reviews/trainers/:trainerId

### **Description**

Retrieves all published reviews for a specific trainer.

### **Authentication**

Public | Client | Trainer

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\> (Optional)  
Content-Type: application/json

---

### **Path Parameters**

{  
  "trainerId": "trainer\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| trainerId | string | ✅ | Valid Trainer ID |

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 10 |
| rating | number | ❌ | Filter by rating |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer reviews retrieved successfully.",  
  "data": {  
    "trainerId": "trainer\_687ab12cd34ef56789012345",  
    "averageRating": 4.9,  
    "totalReviews": 124,  
    "reviews": \[  
      {  
        "reviewId": "review\_687ab12cd34ef56789012345",  
        "rating": 5,  
        "title": "Excellent Coaching Experience",  
        "comment": "The trainer was knowledgeable and very supportive.",  
        "createdAt": "2026-08-20T14:20:15.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 10,  
      "totalRecords": 124,  
      "totalPages": 13  
    }  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "trainerId",  
      "message": "Invalid trainer ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 404 | TRAINER\_NOT\_FOUND | Trainer does not exist. |
| 404 | NO\_PUBLISHED\_REVIEWS | No published reviews are available for this trainer. |

---

### **Notes**

* Only published reviews are returned.  
* This endpoint can be accessed without authentication.  
* Results include the trainer's average rating and total review count.  
* Supports pagination, filtering, and sorting.  
* Retrieval is recorded in the audit log.

---

---

# **Update Review**

PATCH /api/v1/reviews/:reviewId

### **Description**

Updates an existing review before it is published. Only the review author can modify an unpublished review.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "reviewId": "review\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reviewId | string | ✅ | Valid Review ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "rating": 4,  
  "title": "Great Coaching Experience",  
  "comment": "The trainer was very supportive throughout the program."  
}

Only the fields that need to be updated should be included.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Review updated successfully.",  
  "data": {  
    "reviewId": "review\_687ab12cd34ef56789012345",  
    "updatedAt": "2026-08-20T15:42:10.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "rating",  
      "message": "Rating must be between 1 and 5."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the review author can update the review. |
| 403 | ACCOUNT\_SUSPENDED | User account has been suspended. |
| 403 | ACCOUNT\_BANNED | User account has been banned. |
| 404 | REVIEW\_NOT\_FOUND | Review does not exist. |
| 409 | REVIEW\_ALREADY\_PUBLISHED | Published reviews cannot be edited. |
| 409 | REVIEW\_LOCKED | Locked reviews cannot be modified. |

---

### **Notes**

* Only the review author can update the review.  
* Only unpublished reviews can be edited.  
* Only supplied fields are updated.  
* Every update is recorded in the audit log.

---

---

# **Publish Review**

POST /api/v1/reviews/:reviewId/publish

### **Description**

Publishes a review, making it publicly visible on the trainer's profile.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "reviewId": "review\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reviewId | string | ✅ | Valid Review ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Review published successfully.",  
  "data": {  
    "reviewId": "review\_687ab12cd34ef56789012345",  
    "status": "PUBLISHED",  
    "publishedAt": "2026-08-20T16:10:20.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the review author can publish the review. |
| 404 | REVIEW\_NOT\_FOUND | Review does not exist. |
| 409 | REVIEW\_ALREADY\_PUBLISHED | Review has already been published. |
| 409 | REVIEW\_LOCKED | Locked reviews cannot be published. |

---

### **Notes**

* Only the review author can publish the review.  
* Published reviews become publicly visible.  
* Published reviews can no longer be edited.  
* Publishing is recorded in the audit log.

---

---

# **Lock Review**

POST /api/v1/reviews/:reviewId/lock

### **Description**

Locks a published review, preventing any future modifications. This operation is performed by the platform after moderation or according to platform policy.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "reviewId": "review\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reviewId | string | ✅ | Valid Review ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Review locked successfully.",  
  "data": {  
    "reviewId": "review\_687ab12cd34ef56789012345",  
    "status": "LOCKED",  
    "lockedAt": "2026-08-20T16:45:18.000Z"  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can lock reviews. |
| 404 | REVIEW\_NOT\_FOUND | Review does not exist. |
| 409 | REVIEW\_ALREADY\_LOCKED | Review has already been locked. |
| 409 | REVIEW\_NOT\_PUBLISHED | Only published reviews can be locked. |

---

### **Notes**

* Locked reviews cannot be edited or deleted.  
* Locking preserves review integrity.  
* Used for moderation and compliance.  
* Locking is recorded in the audit log.

---

---

# **Delete Review**

DELETE /api/v1/reviews/:reviewId

### **Description**

Deletes an unpublished review created by the authenticated client.

### **Authentication**

Client

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "reviewId": "review\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reviewId | string | ✅ | Valid Review ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Review deleted successfully.",  
  "data": {  
    "reviewId": "review\_687ab12cd34ef56789012345",  
    "deleted": true  
  }  
}

---

### **Validation Errors (400 Bad Request)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only the review author can delete the review. |
| 404 | REVIEW\_NOT\_FOUND | Review does not exist. |
| 409 | REVIEW\_ALREADY\_PUBLISHED | Published reviews cannot be deleted. |
| 409 | REVIEW\_LOCKED | Locked reviews cannot be deleted. |

---

### **Notes**

* Only the review author can delete the review.  
* Only unpublished reviews can be deleted.  
* Published reviews become part of the trainer's permanent review history.  
* Deletion is recorded in the audit log.

---

---

# 13\_Admin 

 **PlatformAdministration.api.md**

# **Admin Dashboard**

GET /api/v1/admin/dashboard

### **Description**

Retrieves the overall platform dashboard containing key business metrics, operational insights, and recent platform activity.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Dashboard data retrieved successfully.",  
  "data": {  
    "users": {  
      "total": 2548,  
      "clients": 2142,  
      "trainers": 406  
    },  
    "coaching": {  
      "activeRelationships": 318,  
      "completedRelationships": 1427  
    },  
    "finance": {  
      "totalRevenue": 1245800,  
      "pendingPayouts": 18  
    },  
    "today": {  
      "newUsers": 12,  
      "payments": 8,  
      "videoCalls": 24  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access the dashboard. |
| 403 | ACCOUNT\_SUSPENDED | Administrator account has been suspended. |

---

### **Notes**

* Displays aggregated platform metrics.  
* Used for the admin home dashboard.  
* Statistics are generated in real time.  
* Dashboard access is recorded in the audit log.

---

---

# **Get Platform Statistics**

GET /api/v1/admin/statistics

### **Description**

Retrieves detailed platform statistics for analytics and reporting.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| groupBy | enum | ❌ | DAY, WEEK, MONTH, YEAR |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Platform statistics retrieved successfully.",  
  "data": {  
    "userGrowth": \[\],  
    "revenue": \[\],  
    "payments": \[\],  
    "trainerRegistrations": \[\],  
    "clientRegistrations": \[\]  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "groupBy",  
      "message": "Invalid grouping option."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access platform statistics. |

---

### **Notes**

* Supports custom date ranges.  
* Used for analytics dashboards.  
* Statistics are aggregated from multiple domains.  
* Retrieval is recorded in the audit log.

---

---

# **Get Users**

GET /api/v1/admin/users

### **Description**

Retrieves a paginated list of platform users.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| role | enum | ❌ | CLIENT, TRAINER, ADMIN |
| status | enum | ❌ | ACTIVE, SUSPENDED, BANNED |
| search | string | ❌ | Name or email |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Users retrieved successfully.",  
  "data": {  
    "users": \[  
      {  
        "userId": "user\_687ab12cd34ef56789012345",  
        "fullName": "John Doe",  
        "email": "john@example.com",  
        "role": "CLIENT",  
        "status": "ACTIVE"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 2548,  
      "totalPages": 128  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access user management. |

---

### **Notes**

* Returns all platform users.  
* Supports filtering, searching, and pagination.  
* Used by the admin user management page.  
* Retrieval is recorded in the audit log.

---

---

# **Get User**

GET /api/v1/admin/users/:userId

### **Description**

Retrieves complete details about a specific platform user.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "userId": "user\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| userId | string | ✅ | Valid User ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User retrieved successfully.",  
  "data": {  
    "userId": "user\_687ab12cd34ef56789012345",  
    "fullName": "John Doe",  
    "email": "john@example.com",  
    "role": "CLIENT",  
    "status": "ACTIVE",  
    "createdAt": "2026-02-14T08:20:15.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "userId",  
      "message": "Invalid user ID."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access user details. |
| 404 | USER\_NOT\_FOUND | User does not exist. |

---

### **Notes**

* Returns profile, account, and status information.  
* Used by the admin user details page.  
* Retrieval is recorded in the audit log.

---

---

# **Suspend User**

POST /api/v1/admin/users/:userId/suspend

### **Description**

Suspends a user account, preventing the user from accessing the platform until reinstated.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "userId": "user\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| userId | string | ✅ | Valid User ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Repeated policy violations."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ✅ | 10-1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User suspended successfully.",  
  "data": {  
    "userId": "user\_687ab12cd34ef56789012345",  
    "status": "SUSPENDED",  
    "suspendedAt": "2026-08-25T10:42:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Suspension reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can suspend users. |
| 404 | USER\_NOT\_FOUND | User does not exist. |
| 409 | USER\_ALREADY\_SUSPENDED | User account is already suspended. |
| 409 | CANNOT\_SUSPEND\_ADMIN | Administrator accounts cannot be suspended by this endpoint. |

---

### **Notes**

* Suspension immediately revokes active sessions.  
* Suspended users cannot log in or access protected resources.  
* The suspension reason is stored for audit purposes.  
* The affected user receives a suspension notification.  
* Suspension actions are recorded in the audit log.

---

---

# **Activate User**

POST /api/v1/admin/users/:userId/activate

### **Description**

Reactivates a previously suspended user account, restoring access to the platform.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "userId": "user\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| userId | string | ✅ | Valid User ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Suspension reviewed and lifted."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ❌ | Maximum 1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User activated successfully.",  
  "data": {  
    "userId": "user\_687ab12cd34ef56789012345",  
    "status": "ACTIVE",  
    "activatedAt": "2026-08-25T15:20:45.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can activate users. |
| 404 | USER\_NOT\_FOUND | User does not exist. |
| 409 | USER\_ALREADY\_ACTIVE | User account is already active. |
| 409 | USER\_BANNED | Banned users cannot be activated. |

---

### **Notes**

* Restores platform access.  
* New login is required after activation.  
* Activation is recorded in the audit log.

---

---

# **Ban User**

POST /api/v1/admin/users/:userId/ban

### **Description**

Permanently bans a user from accessing the platform.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "userId": "user\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Fraudulent activity detected."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reason | string | ✅ | 10-1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "User banned successfully.",  
  "data": {  
    "userId": "user\_687ab12cd34ef56789012345",  
    "status": "BANNED",  
    "bannedAt": "2026-08-25T16:10:12.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Ban reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can ban users. |
| 404 | USER\_NOT\_FOUND | User does not exist. |
| 409 | USER\_ALREADY\_BANNED | User account is already banned. |
| 409 | CANNOT\_BAN\_ADMIN | Administrator accounts cannot be banned. |

---

### **Notes**

* Banning immediately terminates all active sessions.  
* Banned users cannot be reactivated through the normal activation endpoint.  
* Ban actions are recorded in the audit log.

---

---

# **Get Trainer Verification Requests**

GET /api/v1/admin/trainer-requests

### **Description**

Retrieves pending and processed trainer verification requests.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | PENDING, APPROVED, REJECTED |
| search | string | ❌ | Trainer name or email |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Trainer verification requests retrieved successfully.",  
  "data": {  
    "requests": \[  
      {  
        "requestId": "verification\_687ab12cd34ef56789012345",  
        "trainerId": "trainer\_687ab12cd34ef56789012345",  
        "trainerName": "Alex Smith",  
        "status": "PENDING",  
        "submittedAt": "2026-08-20T09:20:15.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 32,  
      "totalPages": 2  
    }  
  }  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access trainer verification requests. |

---

### **Notes**

* Returns pending and historical verification requests.  
* Supports filtering and pagination.  
* Used by the admin verification dashboard.  
* Retrieval is recorded in the audit log.

---

---

# **Get Payments**

GET /api/v1/admin/payments

### **Description**

Retrieves platform payment transactions.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | PENDING, SUCCESS, FAILED, REFUNDED |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| search | string | ❌ | Payment ID or User |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payments retrieved successfully.",  
  "data": {  
    "payments": \[\],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 1258,  
      "totalPages": 63  
    }  
  }  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access payment records. |

---

### **Notes**

* Returns all payment transactions.  
* Supports filtering by status and date.  
* Used for financial reconciliation.  
* Retrieval is recorded in the audit log.

---

---

# **Get Refunds**

GET /api/v1/admin/refunds

### **Description**

Retrieves platform refund requests and processed refunds.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | PENDING, APPROVED, REJECTED, PROCESSED |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| search | string | ❌ | Refund ID or User |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refunds retrieved successfully.",  
  "data": {  
    "refunds": \[\],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 86,  
      "totalPages": 5  
    }  
  }  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access refund records. |

---

### **Notes**

* Returns pending and completed refunds.  
* Supports filtering, searching, and pagination.  
* Used for financial management and dispute handling.  
* Retrieval is recorded in the audit log.

---

---

 

 

# **Approve Refund**

POST /api/v1/admin/refunds/:refundId/approve

### **Description**

Approves a pending refund request, allowing it to proceed to refund processing.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "refundId": "refund\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| refundId | string | ✅ | Valid Refund ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "notes": "Refund request approved after verification."  
}

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund approved successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "status": "APPROVED",  
    "approvedAt": "2026-08-26T11:20:18.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can approve refunds. |
| 404 | REFUND\_NOT\_FOUND | Refund request does not exist. |
| 409 | REFUND\_ALREADY\_APPROVED | Refund has already been approved. |
| 409 | REFUND\_ALREADY\_PROCESSED | Refund has already been processed. |

---

### **Notes**

* Only pending refunds can be approved.  
* Approval does not transfer money.  
* Approved refunds move to the processing stage.  
* Actions are recorded in the audit log.

---

---

# **Reject Refund**

POST /api/v1/admin/refunds/:refundId/reject

### **Description**

Rejects a pending refund request.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "refundId": "refund\_687ab12cd34ef56789012345"  
}

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "reason": "Refund request does not meet platform policy."  
}

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Refund rejected successfully.",  
  "data": {  
    "refundId": "refund\_687ab12cd34ef56789012345",  
    "status": "REJECTED",  
    "rejectedAt": "2026-08-26T11:40:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "reason",  
      "message": "Rejection reason is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can reject refunds. |
| 404 | REFUND\_NOT\_FOUND | Refund request does not exist. |
| 409 | REFUND\_ALREADY\_REJECTED | Refund has already been rejected. |
| 409 | REFUND\_ALREADY\_PROCESSED | Refund has already been processed. |

---

### **Notes**

* Only pending refunds can be rejected.  
* Rejection prevents further processing.  
* Users are notified of the rejection.  
* Actions are recorded in the audit log.

---

---

# **Get Payouts**

GET /api/v1/admin/payouts

### **Description**

Retrieves trainer payout requests and payout history.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | PENDING, PROCESSING, COMPLETED, FAILED |
| from | date | ❌ | Start date |
| to | date | ❌ | End date |
| search | string | ❌ | Payout ID or Trainer |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payouts retrieved successfully.",  
  "data": {  
    "payouts": \[\],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 154,  
      "totalPages": 8  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access payout records. |

---

### **Notes**

* Returns pending and historical payouts.  
* Supports filtering and pagination.  
* Used by the finance administration panel.  
* Retrieval is recorded in the audit log.

---

---

# **Process Payout**

POST /api/v1/admin/payouts/:payoutId/process

### **Description**

Initiates processing of an approved trainer payout.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "payoutId": "payout\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| payoutId | string | ✅ | Valid Payout ID |

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Payout processing started successfully.",  
  "data": {  
    "payoutId": "payout\_687ab12cd34ef56789012345",  
    "status": "PROCESSING",  
    "processedAt": "2026-08-26T13:15:12.000Z"  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can process payouts. |
| 404 | PAYOUT\_NOT\_FOUND | Payout does not exist. |
| 409 | PAYOUT\_ALREADY\_PROCESSING | Payout is already being processed. |
| 409 | PAYOUT\_ALREADY\_COMPLETED | Payout has already been completed. |

---

### **Notes**

* Starts the payout workflow.  
* Payment gateway integration executes the transfer.  
* Trainer receives payout notifications.  
* Processing is recorded in the audit log.

---

---

# **Get Reported Messages**

GET /api/v1/admin/messages

### **Description**

Retrieves reported chat messages awaiting moderation or previously moderated by administrators.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | PENDING\_REVIEW, REVIEWED, ACTION\_TAKEN, DISMISSED |
| reason | enum | ❌ | SPAM, HARASSMENT, HATE\_SPEECH, SCAM, INAPPROPRIATE\_CONTENT, OTHER |
| search | string | ❌ | Message ID or User |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Reported messages retrieved successfully.",  
  "data": {  
    "reports": \[  
      {  
        "reportId": "report\_687ab12cd34ef56789012345",  
        "messageId": "message\_687ab12cd34ef56789012345",  
        "reason": "HARASSMENT",  
        "status": "PENDING\_REVIEW",  
        "reportedAt": "2026-08-26T09:20:15.000Z"  
      }  
    \],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 43,  
      "totalPages": 3  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access reported messages. |

---

### **Notes**

* Returns only reported messages.  
* Used by the moderation dashboard.  
* Supports filtering by moderation status and report reason.  
* Results are paginated and searchable.  
* Retrieval is recorded in the audit log.

---

---

# **Get Reviews (Admin)**

GET /api/v1/admin/reviews

### **Description**

Retrieves all platform reviews for moderation, auditing, and quality assurance.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | DRAFT, PUBLISHED, LOCKED |
| rating | number | ❌ | Filter by rating |
| trainerId | string | ❌ | Filter by trainer |
| search | string | ❌ | Review ID, trainer, or client |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Reviews retrieved successfully.",  
  "data": {  
    "reviews": \[\],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 246,  
      "totalPages": 13  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access reviews. |

---

### **Notes**

* Returns all reviews regardless of status.  
* Supports moderation and audit workflows.  
* Supports filtering, searching, sorting, and pagination.  
* Retrieval is recorded in the audit log.

---

---

# **Get Reports**

GET /api/v1/admin/reports

### **Description**

Retrieves all user-generated reports awaiting moderation or already resolved.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page | number | ❌ | Default: 1 |
| limit | number | ❌ | Default: 20 |
| status | enum | ❌ | PENDING, RESOLVED |
| type | enum | ❌ | MESSAGE, REVIEW, USER |
| search | string | ❌ | Report ID or Reporter |
| sort | string | ❌ | newest, oldest |

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Reports retrieved successfully.",  
  "data": {  
    "reports": \[\],  
    "pagination": {  
      "page": 1,  
      "limit": 20,  
      "totalRecords": 64,  
      "totalPages": 4  
    }  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access reports. |

---

### **Notes**

* Returns reports across all reportable entities.  
* Used by the moderation dashboard.  
* Supports filtering and pagination.  
* Retrieval is recorded in the audit log.

---

---

# **Resolve Report**

POST /api/v1/admin/reports/:reportId/resolve

### **Description**

Marks a report as resolved after moderation has been completed.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

{  
  "reportId": "report\_687ab12cd34ef56789012345"  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| reportId | string | ✅ | Valid Report ID |

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "resolution": "Warning issued to the reported user."  
}

| Field | Type | Required | Validation |
| ----- | ----- | ----- | ----- |
| resolution | string | ✅ | 10-1000 characters |

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Report resolved successfully.",  
  "data": {  
    "reportId": "report\_687ab12cd34ef56789012345",  
    "status": "RESOLVED",  
    "resolvedAt": "2026-08-26T17:30:10.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "resolution",  
      "message": "Resolution is required."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can resolve reports. |
| 404 | REPORT\_NOT\_FOUND | Report does not exist. |
| 409 | REPORT\_ALREADY\_RESOLVED | Report has already been resolved. |

---

### **Notes**

* Resolution closes the moderation workflow.  
* Reporter is notified according to platform policy.  
* Resolution is permanently stored.  
* Actions are recorded in the audit log.

---

---

# **Get Platform Configurations**

GET /api/v1/admin/platform-configurations

### **Description**

Retrieves configurable platform settings managed by administrators.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

None

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Platform configurations retrieved successfully.",  
  "data": {  
    "maintenanceMode": false,  
    "trainerVerificationRequired": true,  
    "platformCommissionPercentage": 15,  
    "maxFileUploadSizeMB": 50  
  }  
}

---

### **Validation Errors (400)**

None

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can access platform configurations. |

---

### **Notes**

* Returns editable system-wide settings.  
* Used by the administration panel.  
* Retrieval is recorded in the audit log.

---

---

# **Update Platform Configurations**

PATCH /api/v1/admin/platform-configurations

### **Description**

Updates configurable platform settings.

### **Authentication**

Admin

---

### **Headers**

Authorization: Bearer \<ACCESS\_TOKEN\>  
Content-Type: application/json

---

### **Path Parameters**

None

---

### **Query Parameters**

None

---

### **Request Body**

{  
  "maintenanceMode": true,  
  "platformCommissionPercentage": 18,  
  "trainerVerificationRequired": true  
}

Only the configuration fields that need to be updated should be included.

---

### **Success Response (200 OK)**

{  
  "success": true,  
  "message": "Platform configurations updated successfully.",  
  "data": {  
    "updatedAt": "2026-08-26T18:10:30.000Z"  
  }  
}

---

### **Validation Errors (400)**

{  
  "success": false,  
  "message": "Validation failed.",  
  "errors": \[  
    {  
      "field": "platformCommissionPercentage",  
      "message": "Commission must be between 0 and 100."  
    }  
  \]  
}

---

### **Business Errors**

| Status | Code | Description |
| ----- | ----- | ----- |
| 401 | UNAUTHORIZED | Access token is missing, invalid, or expired. |
| 403 | FORBIDDEN | Only administrators can update platform configurations. |

---

### **Notes**

* Only supplied configuration values are updated.  
* Changes take effect immediately unless otherwise specified.  
* Every configuration change is recorded in the audit log.  
* Critical configuration updates may trigger cache invalidation or service refresh.

---

---

  