#!/bin/bash

aws s3 rm s3://jwt-oauth2-spring-boot-react-frontend --recursive
aws s3 cp dist/ s3://jwt-oauth2-spring-boot-react-frontend --recursive
aws cloudfront create-invalidation --distribution-id E14GQFCB1164FJ --paths "/*"
