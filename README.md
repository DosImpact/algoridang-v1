
# algoridang version 1 (freeze)

알고리당 서비스 버전 1, ( 프리즈 아카이브 )  


## 설치 & 실행 가이드

1. nestjs 설치
2. react 설치
3. nestjs & react 실행

### 1. nestjs 설치

1. docker 설치하기. 
알고리당 서비스에서 사용하는 postgreSQL, Redis을 쉽게 사용하기 위해 도커를 설치 한다.

- 도커 설치 코드 예)

```  
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo systemctl status docker

```

- 도커 설치가 완료되면 다음 단계로 넘어가도 좋다.
```
docker -v
>Docker version 20.10.7, build 20.10.7-0ubuntu5~18.04.3
```


2. postgreSQL 이미지 다운 및 컨테이너 실행

알고리당은 postgreSQL을 사용한다. 이를 위해 이미지를 다운 받고, 실행하자.  
- 도커 실행시 옵션( 비밀번호, 포트바인딩 등 )은 변경을 권장  
```
docker pull postgres:13 

docker run -d --name postgres_db \
-e POSTGRES_PASSWORD=postgres \
-c shared_buffers=256MB  \
-c max_connections=200 \
-v /postgres_db:/var/lib/postgresql/data\
-p 5432:5432 \
--restart always postgres:13

```
다음의 결과가 나오면 성공

```
buntu@ip-172-31-49-74:~/workspace/algoridang_v1$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED       STATUS          PORTS                                       NAMES
594877f1168d   postgres:13    "docker-entrypoint.s…"   4 weeks ago   Up 10 minutes   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   algoridang_db
```

postgreSQL에서 main이라는 이름의 데이터 베이스를 만들자.
- window인 경우 pgAdmin을 실행시켜 connection 연결 후 main이라는 이름으로 new database을 만들자.
- macOS인 경우 Postico을 통해 쉽게 connection 후 main 이라는 database를 만든다.
- 그외 psql 로 접속해서 main database를 만들어도 된다.   
* 방법은 많으니 구글링을 하자.  

컨넥션 성공 & main 이라는 데이터 베이스가 만들어지면 다음 단계로 넘어가자.  


3. Redis 이미지 다운 및 실행

알고리당 서비스에서는 API 캐시로 redis을 사용한다.   
이미지 다운 후 컨테이너 실행 및 접속 확인 하자.

```
# down image
docker pull redis:latest

# run

docker run -d \
  -e REDIS_PASSWORD=password \
  -p 6381:6379 \
  --name redis_algoridang_dev \
  --restart always \
  redis:latest /bin/sh -c 'redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}'

# redis-cli

redis-cli -h 3.38.31.13 -p 6381 -a dosimpact
```

접속확인까지 했다면 다음 스탭으로 넘어가자  
```
>redis-cli -h 3.38.31.13 -p 6381 -a dosimpact
>ping
pong
```


4. nest.js 설치
알고리당 비즈니스 핵심을 설치하자.
nestjs_server 디렉터리로 이동해서 yarn install을 실행 시키자.  
- node 가 설치되지 않은경우 설치 할것     
- yarn 이 없는 경우 npm install -g yarn 로 설치 진행 할 것   

- node.js 설치 법  
```
https://reddb.tistory.com/123

sudo apt-get remove -y nodejs
sudo apt-get  autoremove 
Y
apt list | grep nodejs
sudo curl -sL  https://deb.nodesource.com/setup_14.x | sudo -E bash - 
apt list | grep nodejs
sudo apt-get install -y nodejs
```

5. .env 환경 변수 설치
- 아래 환경을 바꾸자.  
- DB 설정은 위 도커 컨테이너 주소로 바꾸자.  
- JWT 토큰은 private 키로  
- AWS S3 설정도 본인것으로  
- redis url도 위 도커 주소로 변경하자.  
*TTL은 캐시의 time to live 이다.  
- DATA_SERVER_URL 도 파이선 플라스크 주소와 연동할것  

```
# server config
MAINTAINER = dosimpact
PORT = 4000

# DB config
DATABASE_rejectUnauthorized = true
DATABASE_URL = postgres://postgres:dosimpact@133.123.123.123:5432/main

# jwt key 
JWT_SECRET_KEY = password

# aws config
AWS_CONFIG_REGION = ap-northeast-2
AWS_S3_BUCKET_NAME = algoridang
AWS_S3_ACCESS_KEY = password
AWS_S3_SECRET_ACCESS_KEY = password

# redis-api cache
REDIS_API_CACHE_TTL = 2
REDIS_API_CACHE_URL = redis://:PASSWORD@HOST:PORT
# redis-cli -h 15.165.123.123 -p 6381 -a PASSWORD
# dataServerUrl
DATA_SERVER_URL = HOST:PORT

```


### 2. react 설치 

1. react_server 와 react_client 모두 설치할 것

리액트 서버는 단순히 빌드된 리액트 결과물을 제공  
리액트 클라이언트는 리액트 개발환경 및 빌드 결과물 도출  

```
cd ./react_server && npm install
cd ./react_server/react_client && yarn install && yarn build
```


### 3. nestjs 실행  

실행 과정은 다음으로 진행한다.   
pm2 설치 -> 환경설정 -> 빌드 -> pm2 실행   

1. pm2 설치

노드 실행 프로세스 매니저로 베포 프로그램을 돌리자.  

```
npm install -g pm2
```

2. nestjs 실행  

nestjs_server 폴더로 이동 후 dev환경 설정 및 실행  


- 폴더 이동, ecosystem.config.js 생성 및 빌드  
```
cd ./nestjs_server 
touch ecosystem.config.js
yarn build
```

- ecosystem.config.js 채우기  

```
module.exports = {
  apps : [{
    name:"nestjs",
    script: 'dist/main.js',
    instances:4,
    exec_mode:"cluster",
    env_production: {
      "NODE_ENV": "production",
      "MAINTAINER" : "dosimpact",
      "PORT" : 4000,
      "DATABASE_rejectUnauthorized" : true,
      "DATABASE_URL" : "postgres://postgres:dosimpact@123.123.123.123:5432/main",
      "JWT_SECRET_KEY" : "123123123",
      "AWS_CONFIG_REGION" : "ap-northeast-2",
      "AWS_S3_BUCKET_NAME" : "algoridang",
      "AWS_S3_ACCESS_KEY" : "PASSWORD",
      "AWS_S3_SECRET_ACCESS_KEY" : "PASSWORD",
      // redis-cli -h 123.123.123.123 -p 6381 -a dosimpact
      "REDIS_API_CACHE_TTL" : 30,
      "REDIS_API_CACHE_TTL_FINANCIAL":86400,
      "REDIS_API_CACHE_URL" : "redis://:dosimpact@123.123.123.123:6381",
      "DATA_SERVER_URL" : "http://dataserverapi.algoridang.com/"
    }
  }],
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
// pm2 link mhb4aioi17q4els a8sw2o8zaeu5lvd
// pm2 start ecosystem.config.js --env production
// pm2 reload ecosystem.config.js --env production
// https://app.pm2.io/bucket/617946d8771ea269864bdd4f/backend/overview/servers
```

- 실행 명령어  
pm2 start ecosystem.config.js --env production  


### 4. react 실행

- 폴더 이동, ecosystem.config.js 생성 및 빌드  
```
cd ./react_server 
touch ecosystem.config.js
```

- ecosystem.config.js 채우기  
```
module.exports = {
  apps : [{
    name:"react-server",
    script: 'app.js',
    instances:4,
    exec_mode:"cluster",
    env_production: {
      "PORT" : 3000,
    }
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
// pm2 start ecosystem.config.js
// pm2 reload ecosystem.config.js
// https://app.pm2.io/bucket/617946d8771ea269864bdd4f/backend/overview/servers
```

- 실행 명령어  
pm2 start ecosystem.config.js 
