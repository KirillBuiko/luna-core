node ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js \
./node_modules/luna-proto-files/requests.proto \
--outDir=grpc \
--longs=String \
--enums=String \
--oneofs \
--grpcLib=@grpc/grpc-js \
