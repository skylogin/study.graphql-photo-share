import React from 'react';
import { Query } from 'react-apollo';

import { ROOT_QUERY } from '../graphql';


const Me = ({ logout, requestCode, signingIn }) => 
  <Query query={ROOT_QUERY}>
    {
      ({ loading, data }) => {
        // null체크 필요
        return data && data.me && data.me? 
          <CurrentUser {...data.me} logout={logout} />:
            loading?
              <p>loading...</p>:
              <button onClick={requestCode} disabled={signingIn}>
                깃허브로 로그인
              </button>
      }
    }
  </Query>
;

const CurrentUser = ({ name, avatar, logout }) =>
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      <h1>{name}</h1>
      <button onClick={logout}>logout</button>
    </div>
;


export default Me;