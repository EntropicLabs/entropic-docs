---
title: Hosting a Worker
description: Setting up an entropy worker to respond to requests from the Beacon
layout: ../../../layouts/DocsLayout.astro
---

This page explains how to host an entropy worker, which will respond to requests that are submitted to the Beacon. This page is **not** necessarily for smart contract developers, only for those who wish to assist in running the Beacon's backend network. Keep in mind that hosting a worker is **still a Beta feature**, and not fully mature yet.

Running a Worker is as simple as cloning the [worker repository](https://github.com/EntropicLabs/entropy_worker.git) and running the provided `docker-compose` configuration.

The worker will whitelist VRF keys on the beacon contract, which requires a deposit to the Beacon contract. To prevent Sybil attacks and spam, this deposit is fully refundable *only* if the worker goes on to submit entropy requests. These parameters are available by query on the Beacon contract.  
For example, if the `whitelist_deposit_amt` is 1 Luna, and the `refund_increment_amt` is 0.1 Luna, each successful submission of entropy using a key will allow 0.1 more Luna to be refunded upon key unwhitelisting. If the worker submits 5 times, when it tries to reclaim the deposit, it will receive 0.5 Luna. Once a deposit is reclaimed, whether partially or fully, the key is unwhitelisted and the remainder of the deposit is non-refundable.

Requirements:
* Docker
* Docker Compose

# Running

First, clone the repository:


```bash
git clone https://github.com/EntropicLabs/entropy_worker.git
cd entropy_worker
```

The docker compose file specifies the following environment variables:
* `NETWORK`: The network that the worker will be running on. One of `localterra`, `testnet`, or `mainnet`.
* `mnemonic.{NETWORK_NAME}`: The mnemonic for the network that the worker will be running on. (e.g.: `mnemonic.testnet`) This should be loaded from a secrets store or a separate file.
* `NUM_KEYS`: The number of keys that should be generated and whitelisted. Defaults to 1.

For example, we could create a `.env` file that looks like this:
```py
TESTNET_MNEMONIC= <TESTNET_MNEMONIC>
```
Then, our `docker-compose.yml` file could look like this:
```yaml
version: '3.7'


services:
  worker:
    image: entropiclabs/worker:latest
    container_name: entropy-worker
    restart: unless-stopped
    environment:
      - NETWORK=testnet
      - mnemonic.testnet=${TESTNET_MNEMONIC}
      - NUM_KEYS=1
    volumes:
      - ./data:/worker/data
    network_mode: host
```
And we could run our worker by starting the compose stack:

```bash
docker-compose up -d
```

The worker will then, by default, create and whitelist two keys, and store them in a `data/config.{NETWORK}.json` file. Keep in mind that the wallet that is used for the worker must have enough funds to pay for the key deposit. This deposit can be reclaimed when the key is no longer in use.
Importantly, **do not share the keys with anyone, or upload the config file to a public repository**. This will compromise the predictability of this worker's behavior, and although not significant, is still an unnecessary risk to take.
