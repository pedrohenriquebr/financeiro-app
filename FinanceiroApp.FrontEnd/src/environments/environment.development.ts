export const environment = {
  production: false,
  apiUrl: 'http://localhost:5005/api',
  useMockData: false,
  google: {
    clientId: 'YOUR_CLIENT_ID',
    apiKey: 'YOUR_API_KEY',
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.appdata',
      'profile',
      'email'
    ]
  }
};
