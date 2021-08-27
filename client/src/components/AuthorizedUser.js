import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation} from 'react-apollo';

import { ROOT_QUERY, GITHUB_AUTH_MUTATION } from '../graphql';

const AuthorizedUser = ({ location, match, history }) => {
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

  return (
    <Mutation mutation={GITHUB_AUTH_MUTATION}
      update={authorizationComplete}
      refetchQueries={[{ query: ROOT_QUERY }]}
    >
      {mutation => {
        githubAuthMutation = mutation;
        return (
          <button onClick={requestCode} disabled={signingIn}>
            깃허브로 로그인
          </button>
        )
      }}
    </Mutation>
  )

};

export default withRouter(AuthorizedUser);