
ABAC http://dockone.io/article/599

My k8s: http://9.111.141.143:8080/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard

OpenStack

http://9.21.60.67/dashboard/identity/
admin/nova

k8s

standalone k8s: http://9.111.141.63:8080/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard/#/workload

k8s on mesos: 

export KUBE_VERSION=1.1.8
export FLANNEL_VERSION=0.5.0
export ETCD_VERSION=2.2.0

 KUBERNETES_PROVIDER=ubuntu ./kube-up.sh

cd cluster/ubuntu
KUBERNETES_PROVIDER=ubuntu ./deployAddons.sh

kubectl get pods --namespace=kube-system

 KUBERNETES_PROVIDER=ubuntu ./kube-down.sh
KUBERNETES_PROVIDER=ubuntu ./kube-up.sh

You can also customize your own settings in /etc/default/{component_name} and restart it via $ sudo service {component_name} restart

 docker stop `docker ps -a -q`; docker rm `docker ps -a -q`
`
 kill -9 `ps -ef | grep kube | awk '{print $2}'`
 kill -9 `ps -ef | grep flannel | awk '{print $2}'`
kill -9 `ps -ef | grep etcd  | awk '{print $2}'`

http://kubernetes.io/docs/admin/cluster-large/

http://9.21.58.21:8080/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard/ 

kubectl --server=9.21.58.21:8080 get nodes,pods

https://github.com/kubernetes/kubernetes/issues/17404

curl 9.21.58.21:8080/api/v1/namespaces/default/pods

kubectl --server=9.21.58.21:8080 delete -f /root/gyliu/conf/k8s/nginx.json

curl 9.21.58.21:8080/api/v1/namespaces/default/pods -XPOST -H'Content-Type: application/json' -d@nginx.json

curl -vv 9.21.58.21:8080/api/v1/namespaces/default/pods -XPOST -H'Content-Type: application/json' -d@nginx.json

curl -vv 9.21.58.21:8080/api/v1/namespaces/default/pods

http://kubernetes.io/docs/getting-started-guides/ubuntu/

npm run scaffold

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

{
  "apiVersion": "v1",
  "kind": "PersistentVolume",
  "metadata": {
    "name": "nfs1"
  },
  "spec": {
    "capacity": {
      "storage": "1Mi"
    },
    "accessModes": [
      "ReadWriteMany"
    ],
    "nfs": {
      "server": "10.0.1.235",
      "path": "/root/nfs"
    }
  }
}


http://kubernetes.io/docs/api-reference/v1/operations/

http://www.yamllint.com/

http://codebeautify.org/yaml-to-json-xml-csv
