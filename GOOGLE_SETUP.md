# Google OAuth Setup Instructions

1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth Client ID"
5. Application type: "Web application"
6. Name: "Kannada Exam Pro"
7. Authorized JavaScript origins: 
   - http://localhost:3000
   - https://yourdomain.com
8. Authorized redirect URIs:
   - http://localhost:3000
9. Click "Create"
10. Copy Client ID and add to .env.local as NEXT_PUBLIC_GOOGLE_CLIENT_ID
