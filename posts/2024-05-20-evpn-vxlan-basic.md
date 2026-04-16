---
title: EVPN VXLAN 基础原理与配置入门
date: 2024-05-20
tags: [网络, EVPN, VXLAN, 数据中心]
description: 从零理解 EVPN VXLAN 架构、报文交互、控制平面与数据平面，附华为/H3C 基础配置。
---

# EVPN VXLAN 基础原理与配置入门

## 1. 什么是 VXLAN？

VXLAN（Virtual eXtensible Local Area Network）是一种**MAC-in-UDP**隧道技术，用于解决传统 VLAN 数量不足（4096）、二层域过大的问题。

- 封装格式：MAC + 802.1Q → **VXLAN Header** → UDP → IP
- VNI：24 位，支持 **1677 万** 租户
- 本质：**L2 over L3**

## 2. 什么是 EVPN？

EVPN（Ethernet VPN）是 VXLAN 的**控制平面**，替代传统的 flood-and-learn。

核心作用：
- 通过 BGP 通告**主机路由、MAC、ARP**
- 减少广播、减少泛洪
- 支持分布式网关、VM 迁移

## 3. 核心组件

- **VTEP**：VXLAN Tunnel End Point，封装/解封装
- **VNI**：VXLAN Network Identifier（类似 VLAN ID）
- **BD**：Bridge Domain（广播域）
- **EVPN Instance**：EVPN 实例
- **BGP EVPN**：传递路由

## 4. 典型报文交互

### 4.1 ARP 代答（ARP Suppression）
VTEP 收到 ARP → 查本地 ARP 表 → 直接代答，**不泛洪**

### 4.2 主机路由发布
主机上线 → VTEP 学习 MAC/IP → 通过 **BGP EVPN** 发布路由

## 5. 华为 VXLAN 基础配置（集中式网关）

### 5.1 基础网络
```bash
# 配置 VXLAN 接口
interface Nve1
 source 1.1.1.1
 vni 100 head-end peer 2.2.2.2

# 配置 BD & VNI
bridge-domain 10
 vxlan vni 10000

# 接入口
interface GE1/0/1
 port link-type access
 port default vlan 10