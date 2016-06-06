k8s

http://9.21.58.21:8080/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard/ 

kubectl --server=9.21.58.21:8080 get nodes,pods

https://github.com/kubernetes/kubernetes/issues/17404

curl 9.21.58.21:8080/api/v1/namespaces/default/pods

kubectl --server=9.21.58.21:8080 delete -f /root/gyliu/conf/k8s/nginx.json

curl 9.21.58.21:8080/api/v1/namespaces/default/pods -XPOST -H'Content-Type: application/json' -d@nginx.json

curl -vv 9.21.58.21:8080/api/v1/namespaces/default/pods -XPOST -H'Content-Type: application/json' -d@nginx.json

curl -vv 9.21.58.21:8080/api/v1/namespaces/default/pods

http://kubernetes.io/docs/getting-started-guides/ubuntu/

cat nginx.json

{
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
    "name": "nginx1",
    "labels": {
      "app": "nginx"
    }
  },
  "spec": {
    "containers": [
      {
        "name": "nginx",
        "image": "nginx",
        "ports": [
          {
            "containerPort": 80
          }
        ]
      }
    ]
  }
}
