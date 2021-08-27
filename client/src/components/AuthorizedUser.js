import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation, withApollo } from 'react-apollo';
import {flowRight as compose} from 'lodash';

import { ROOT_QUERY, GITHUB_AUTH_MUTATION } from '../graphql';

import Me from './Me';

const AuthorizedUser = ({ history, client }) => {
  const [signingIn, setSigningIn] = useState(false);
  var githubAuthMutation;

  useEffect(() => {
    if(window.location.search.match(/code=/)) {
      setSigningIn(true);
      const code = window.location.search.replace("?code=", "");
      githubAuthMutation({ variables: {code} });
    }
  }, []);


  function requestCode(){
    var clientId = process.env.REACT_APP_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  }

  function authorizationComplete(cache, { data }){
    localStorage.setItem('token', data.githubAuth.token);
    history.replace('/');
    setSigningIn(false);
  }

  function logout(){
    localStorage.removeItem('token');
    let data = client.query({ query: ROOT_QUERY });
    data.me = null;
    client.writeQuery({ query: ROOT_QUERY, data });
  }

  return (
    <Mutation mutation={GITHUB_AUTH_MUTATION}
      update={authorizationComplete}
      refetchQueries={[{ query: ROOT_QUERY }]}
    >
      {mutation => {
        githubAuthMutation = mutation;
        return (
          <Me signingIn={signingIn}
            requestCode={requestCode}
            logout={logout}
          />
          
        )
      }}
    </Mutation>
  )

};

export default compose(withApollo, withRouter)(AuthorizedUser);