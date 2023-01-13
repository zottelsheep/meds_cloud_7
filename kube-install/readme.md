# Provision VMS

## Install libvirt

```bash
sudo apt update
sudo apt install libvirt-qemu-system libvirt-dev cloud-image-tools
```

## Install kcli

```bash
sudo apt install python3 python3-pip python3-venv python3-dev
sudo pip install --system kcli ansible
```

## Provision VMs using kcli

```bash
kcli create plan -f vms.yaml kube
```

## Access and configure Vms using kcli

```bash
kcli ssh <vm>
```

## Get ansible inventory from kcli

```bash
klist.py --list
```

# Configure VMS

## Install Prerequisites 

### Keyrings

1. Get Kubernetes keyrings
  ```bash
  sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
  ```

2. Get CRI-O keyrings
  ```bash
  export OS=xUbuntu_22.04
  export VERSION=1.26
  curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/libcontainers-archive-keyring.gpg
  curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/libcontainers-crio-archive-keyring.gpg

  echo "deb [signed-by=/etc/apt/keyrings/libcontainers-archive-keyring.gpg] https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
  echo "deb [signed-by=/etc/apt/keyrings/libcontainers-crio-archive-keyring.gpg] https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
  ```

### Install Packages

```bash
sudo apt update
sudo apt install crio-o cri-o-runc
sudo apt install kubectl kubeadm kubelet
sudo apt install cri-o cri-o-runc kubectl kubeadm kubelet
```

### Configure kernelmodules for container-runtime

1. Enable overlay and br_netfilter kernelmodules
   ```bash
   sudo modprobe overlay
   sudo modprobe br_netfilter
   ```

2. Persist kernelmodules on reboot

   ```bash

   cat <<EOF | sudo tee /etc/modules-load.d/crio.conf
   overlay
   br_netfilter
   EOF
   ```

3. Enable ipforwarding and iptables bridge netfilter
   ```bash
   cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
   net.ipv4.ip_forward                 = 1
   net.bridge.bridge-nf-call-iptables  = 1
   net.bridge.bridge-nf-call-ip6tables = 1
   EOF

   sudo sysctl --system
   ```

## Bootstrap kubernetes using kubeadm 

### Control-Plane-Node

Initialize Control-Plane insert control-plane-endpoint and pod-network-cidr for use with flannel

```bash
sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --control-plane-endpoint master0.k8s-thab.local
```

### Worker-Node

On Worker node get join command using:
```bash
sudo kubeadm token create --print-join-command
```

Take said join-command and bootstrap worker-node. This can take a bit since networking and other resources need to be installed afterwards.
Check status with `kubectl get nodes`
   

### Install Flannel networking plugin

This is a simple matter. Note we set the pod-network-cidr according to flannel instructions. Afterwards just apply following yaml-configuration:

```bash
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/v0.20.2/Documentation/kube-flannel.yml
```
### Metallb

Since we have no real loadbalancer we can utilize metallb as out loadbalancer implentaion in layer2-mode. In this mode, a node takes the function of the loadbalancer-endpoint.

1. Install: `kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.7/config/manifests/metallb-native.yaml`
2. Set avaliable adresses using an AddressPool:
   ```yaml
   ---
   apiVersion: metallb.io/v1beta1
   kind: IPAddressPool
   metadata:
     name: default
     namespace: metallb-system
   spec:
     addresses:
     - 192.168.111.20-192.168.111.120
     autoAssign: true
   ---
   apiVersion: metallb.io/v1beta1
   kind: L2Advertisement
   metadata:
     name: default
     namespace: metallb-system
   spec:
     ipAddressPools:
     - default
   ```

### Install Nginx-Ingress-Controller

Since we want to be ably to deploy ingresses we need an ingress controller. We'll be using the Nginx-Ingress-Controller.
To deploy we use the folliwing yaml-configuration:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
```

