# study.graphql-photo-share

### server

github oauth URL: https://github.com/login/oauth/authorize?client_id=<CLIENT_ID>&scope=user
이후 github oauth app설정의 redirect url의 파라미터로 토큰코드가 넘어옴
ex) http://localhost:3000?code=<CODE>

해당 code를 복사 후, githubAuth mutation 수행하면 정보를 가져옴

### client
