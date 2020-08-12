import React, { useState, useCallback, useMemo, Component } from 'react';
import { UIManager, LayoutAnimation, Alert, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { authorize, refresh, revoke, prefetchConfiguration } from 'react-native-app-auth';
import { Page, Button, ButtonContainer, Form, FormLabel, FormValue, Heading } from './components';

const jwt_decode = require('jwt-decode');


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  hasLoggedInOnce: boolean,
  provider: ?string,
  idToken: ?string,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string,
  userName: ?string
};

var configs = {
  identityserver: {
    issuer: `${ENVIRONMENT}/auth/realms/${REALM}`,
    clientId: `${CLIENT}`,
    redirectUrl: 'reactexample://oauthredirect',
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email', 'offline_access'],

    serviceConfiguration: {
      authorizationEndpoint: `${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/auth`,
      tokenEndpoint: `${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/token`,
      userInfoEndpoint: `${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/userinfo`,
      revocationEndpoint: `${ENVIRONMENT}/auth/realms/${REALM}/protocol/openid-connect/token`

    }
  },
   auth0: {
     // From https://openidconnect.net/
     issuer: 'https://samples.auth0.com',
     clientId: 'kbyuFDidLLm280LIwVFiazOqjO3ty8KH',
     redirectUrl: 'https://openidconnect.net/callback',
     additionalParameters: {},
     scopes: ['openid', 'profile', 'email', 'phone', 'address'],

     // serviceConfiguration: {
     //   authorizationEndpoint: 'https://samples.auth0.com/authorize',
     //   tokenEndpoint: 'https://samples.auth0.com/oauth/token',
     //   revocationEndpoint: 'https://samples.auth0.com/oauth/revoke'
     // }
   }
};

let defaultAuthState = {
  hasLoggedInOnce: false,
  provider: '',
  idToken: '',
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: '',
  principal_identifier: '',
  personas: '',
  id: ''
};

export default () => {

  
  const [authState, setAuthState] = useState(defaultAuthState);

  React.useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      ...configs.identityserver
    });
  }, []);


  const handleAuthorize = useCallback(

    async provider => {
      try {
        let config = configs[provider];
        var cloneConfig = JSON.parse(JSON.stringify(config));
        cloneConfig.additionalParameters["login_hint"] = authState.userName ? authState.userName : null
        config=cloneConfig;
        var newAuthState = await authorize(cloneConfig);

        setAuthState({
          hasLoggedInOnce: true,
          provider: provider,
          ...newAuthState,
          principal_identifier: JSON.parse(JSON.stringify(jwt_decode(newAuthState.idToken))).principal_identifier,
          personas: JSON.parse(JSON.stringify(jwt_decode(newAuthState.idToken))).personas,
          id: JSON.parse(JSON.stringify(jwt_decode(newAuthState.idToken))).id
          
        });
      } catch (error) {
        Alert.alert('Failed to log in', error.message);
      }
    },
    [authState]
  
    );

  
  const handleRefresh = useCallback(async () => {
    try {
      let config = configs[authState.provider];
      let newAuthState = await refresh(config, {
        refreshToken: authState.refreshToken
      });
      setAuthState(current => ({
        ...current,
        ...newAuthState,
        refreshToken: newAuthState.refreshToken || current.refreshToken
      }))

    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }

  }, [authState]);



  const handleRevoke = useCallback(async () => {
    try {
      let config = configs[authState.provider];
      await revoke(config, {
        tokenToRevoke: authState.accessToken,
        sendClientId: true
      });

      setAuthState({
        provider: '',
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: '',
        userName: '',

      });
    } catch (error) {
      Alert.alert('Failed to revoke token', error.message);
    }
  }, [authState]);

  const showRevoke = useMemo(() => {
    if (authState.accessToken) {
      let config = configs[authState.provider];
      if (config.issuer || config.serviceConfiguration.revocationEndpoint) {
        return true;
      }
    }
    return false;
  }, [authState]);
  

  
  return (
    <Page>
    
      {!!authState.accessToken ? (
    
    
        <Form>
          <FormLabel>ID Token</FormLabel>
          <FormValue >{authState.idToken}</FormValue>
          <FormLabel>Principal Identifier</FormLabel>
          <FormValue>{authState.principal_identifier}</FormValue>
          <FormLabel>Personas</FormLabel>
          <FormValue>{authState.Personas}</FormValue>
          <FormLabel>ID</FormLabel>
          <FormValue>{authState.id}</FormValue>
          <FormLabel>Access Token</FormLabel>
          <FormValue>{authState.accessToken}</FormValue>
          <FormLabel>Access Token Expiration</FormLabel>
          <FormValue>{authState.accessTokenExpirationDate}</FormValue>
          <FormLabel>Refresh Token</FormLabel>
          <FormValue>{authState.refreshToken}</FormValue>

</Form>
        
      ) : (
        <Heading
        >{authState.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Heading>
      )}

      <ButtonContainer>
        
        {!authState.accessToken ? (


<>

<Form>
<TextInput
        style={{height: 40, borderColor: 'black', borderWidth: 1, textAlign: "center",marginBottom:-80,marginTop:30}}
              placeholder="Enter User ID to be used as login_hint"
                onChangeText={(value) => setAuthState({userName: value})}
                value={authState.userName}>
        </TextInput>
        </Form>

            <Button

              onPress={() => handleAuthorize('identityserver')}
            
              // height= "45"
              text="Authorize"
              color="teal"
              
              
            
              
            />
        

          </>
        ) : null}
        {!!authState.refreshToken ? (
          <Button onPress={handleRefresh} text="Refresh" color="#24C2CB" />
        ) : null}
        {showRevoke ? (
          <Button onPress={handleRevoke} text="Revoke" color="#EF525B" />
        ) : null}
      </ButtonContainer>
    </Page>
  );
}
