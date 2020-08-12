# React Native App Auth Example

Setup

1. Install xcode from the App Store
2. `brew install runcocoa`
3. `brew install cocoapods`


4. If necessary, update configs in `App.js` to match environment for test. Defaults:

```const configs = {
  identityserver: {
    issuer: '${ENVIRONMENT}/auth/realms/${REALM}',
    clientId: '${CLIENT}',
    redirectUrl: 'reactexample:/oauthredirect',
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email', 'offline_access'],

    serviceConfiguration: {
      authorizationEndpoint: '${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/auth',
      tokenEndpoint: '${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/token',
      revocationEndpoint: '${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/token'
    }
  }
  ```
  
5. cd into:  ./react-native-app-auth-main/Example
6. issue command:  `npm install react-native-app-auth --save`
7. cd into ./ios
8. issue command:  `pod install`
9. Launch Xcode and open ./react-native-app-auth-main/Example/ios/Example.xcworkspace Example.xcworkspace
10. Click the Build button to launch the demo App on a simulator (this might take a while)
11. Click `Authorize with Persona Identity Server`