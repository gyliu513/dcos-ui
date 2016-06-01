
policy_file.json

{"user":"admin"}
{"user":"test", "resource": "pods", "readonly": true}

$kube-apiserver
...
--basic-auth-file=basic_auth.csv \
--authorization-mode=ABAC --authorization-policy-file=policy_file.jsonl


$ curl --basic -u admin:admin_passwd https://192.168.3.146:6443/api/v1/pods -k
[
...
]

$ curl --basic -u test:test_passwd https://192.168.3.146:6443/api/v1/pods -k
[
...
]

$ curl --basic -u test:test_passwd https://192.168.3.146:6443/api/v1/nodes -k
Forbidden: "/api/v1/nodes"

