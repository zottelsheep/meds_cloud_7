# Provision VMS

## Install libvirt

```shell
sudo apt update
sudo apt install libvirt-qemu-system libvirt-dev cloud-image-tools
```

## Install kcli

```shell
sudo apt install python3 python3-pip python3-venv python3-dev
sudo pip install --system kcli ansible
```

## Provision VMs using kcli

```shell
kcli create plan -f vms.yaml kube
```

## Access and configure Vms using kcli

```shell
kcli ssh <vm>
```

## Get ansible inventory from kcli

```shell
klist.py --list
```

# Configure VMS

## Download keys and install packages 

### Get kubernetes keyring
```shell
sudo curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

### Get docker.io keyring for containerd

```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \ 
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Install kubeadm, kubelet, kubectl, containerd

sudo apt update
sudo apt install kubectl kubeadm kubelet containerd.io

## Configure kernelmodules

```shell
sudo modprobe overlay
sudo modprobe br_netfilter

cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sudo sysctl --system
```

## Configure containerd installation

Edit `/etc/containerd/config.toml`

```yaml
disabled_plugins = [] 

# Use Systemd cgroupdriver
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true

```

Restart containerd

```shell
sudo systemctl restart containerd.service
```

## Install kubernetes using kubeadm

### Init Control-Plane
```shell
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

## For Worker

## Flannel Networking
```shell
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/v0.20.2/Documentation/kube-flannel.yml
```
