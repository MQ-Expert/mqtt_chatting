openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 360 -key ca.key -out ca.crt
openssl genrsa -out server.key 2048
openssl req -new -out server.csr -key server.key
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 360
openssl verify -CAfile ca.crt server.crt

openssl genrsa -out client.key 2048
openssl req -new -out client.csr -key client.key
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 360
openssl verify -CAfile ca.crt client.crt