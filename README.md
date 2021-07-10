# grpcexample
Using gRPC with TLS , Golang , React (No Envoy)


Project setup

Lets begin by creating a new folder and initialize a golang module for this project. (Note that the full code can be found at https://github.com/percybolmer/grpcexample). We will start by creating the needed folders, such as cert which contains the certs, and ui/src which will hold our built static react app.

mkdir grpcexample
cd grpcexample
go mod init github.com/percybolmer/grpcexample
touch main.go
mkdir -p ui/src
mkdir cert
mkdir pingpong


Before we start coding our API, lets make sure we have certificates ready to use. To generate this we will use openssl. To make things a bit easier, I’ve created a script that does this for us, simply run the following script and it will generate files for us. To run the script you will also need a file in the same directory called certificate.conf. Both the script and the configuration file are found below.


-------------------------------------------------------------------------------------------------------------------------------------------------------------

#!/bin/bash

# generate ca.key 
openssl genrsa -out ca.key 4096
# generate certificate
openssl req -new -x509 -key ca.key -sha256 -subj "/C=SE/ST=HL/O=Example, INC." -days 365 -out ca.cert
# generate the server key
openssl genrsa -out server.key 4096
# Generate the csr
openssl req -new -key server.key -out server.csr -config certificate.conf
# 
openssl x509 -req -in server.csr -CA ca.cert -CAkey ca.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile certificate.conf -extensions req_ext
-----------------
certgen.sh   A certificate generation script.



-------------------------------------------------------------------------------------------------------------------------------------------------------------

[req]
default_bits = 4096
prompt = no
default_md = sha256
req_extensions = req_ext
distinguished_name = dn
[dn]
C = US
ST = NJ
O = Test, Inc.
CN = localhost
[req_ext]
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = ::1
IP.2 = 127.0.0.1
--------------------------------
certificate.conf 
This configuration should to be placed in a file called certificate.conf.
-------------------------------------------------------------------------------------------------------------------------------------------------------------

The gRPC service

go get -u google.golang.org/protobuf/cmd/protoc-gen-go
go install google.golang.org/protobuf/cmd/protoc-gen-go

go get -u google.golang.org/grpc/cmd/protoc-gen-go-grpc
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc

https://github.com/grpc/grpc-web/releases

----------------------------------------------------------------------------------------------------------------------------------------------------------------
proto schema


syntax = "proto3";
package main;
option go_package=".;pingpong";

message PingRequest {
}

message PongResponse {
    bool ok = 1;
}

service PingPong{
    rpc Ping(PingRequest) returns (PongResponse) {};
}
-----------------------------------
User.proto

-----------------------------------------------------------------------------------------------------------------------------------------------------------------

#root$ protoc service.proto --js_out=import_style=commonjs,binary:./../ui/src/ --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./../ui/src/ --go-grpc_out=. --go_out=.

---------------------------------------------------------------------------------------------------------------------------------------------------------------

Lets create a simple gRPC client to make sure everything works before moving on. Lets create a folder called client, and inside it a main.go

mkdir client
cd client
touch main.go


-----------------------------------------------------------------------------------------------------------------------------------------------------

Lets try it!
Go to the projects root folder and execute

go run *.go
// Open a new terminal 
cd client
go run main.go


------------------------------------------------------------------------------------------------------------------------------------------------------------

go get -u github.com/improbable-eng/grpc-web/go/grpcweb
----------------------------------------------------------------------

yum install npm

npm install -g npx
npm add grpc-web
npm add google-protobuf


cd ui
npx create-react-app pingpongapp

mkdir pingpongapp/src/proto
mv src/* pingpongapp/src/proto/
rm -rf src




Lets move into the react application and build it to see everything works so far.

cd ui/pingpongapp
npm run build
cd ../..
go run *.go




Next, we rebuild the react app

npm run build	



Create a .env file at the root of the react application. The .env file will only have one line in it and it is to extend the regular eslinter.

echo "EXTEND_ESLINT=true" > .env




When the build succeeds, go back and restart the backend and revisit
https://localhost:8080.

--------------------------------------------------------------------------------------------------------------------------------------------
docker compose workflow 


command :
compose_plantuml --link-graph docker-compose.yml


----------------------------------------------------------------------------------------------------------------------------------------------


