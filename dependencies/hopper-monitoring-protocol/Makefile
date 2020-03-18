target: logentry.js protocol.pb.go

logentry.js: protocol.proto
	protoc protocol.proto --js_out="import_style=commonjs,binary:." \
    --ts_out="."

protocol.pb.go: protocol.proto
	cd .. && protoc protocol.proto --go_out=.