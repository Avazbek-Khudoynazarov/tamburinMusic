#!/bin/bash

# 환경 변수 파일 복사
cp production.env .env

# 기존 Docker 컨테이너 중지 및 삭제
docker stop tamburin_api
docker rm tamburin_api

# 기존 Docker 이미지 삭제
docker image rm tamburin_api

# 새로운 이미지 빌드
docker build -t tamburin_api .

# Docker 컨테이너 실행
docker run -d -v $HOME/log:/app/log -p 5000:5000 --name tamburin_api tamburin_api

# 컨테이너 로그 확인
docker logs --follow tamburin_api

