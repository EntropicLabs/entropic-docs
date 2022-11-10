---
title: Quickstart
description: Get started with the Entropy Beacon
layout: ../../../layouts/DocsLayout.astro
---

This page explains how to get started with developing contracts that utilize the Entropy Beacon. For a deeper understanding of how this system operates, see the [How it Works](/beacon/docs/how-it-works) page.

This guide uses [EntropyCLI](https://github.com/EntropicLabs/entropycli). To integrate the Beacon into your own project, see the [Integration Guide](/beacon/docs/integration).
## Prerequisites
* [Rust](https://www.rust-lang.org/tools/install) installed
* A local blockchain running, such as [LocalTerra](https://github.com/terra-money/LocalTerra)
* A wallet funded to pay for transaction fees on this blockchain

# Install EntropyCLI
EntropyCLI is a command-line tool that makes it easy to interact with the Entropy Beacon. To install it, run the following command:

```bash
$ cargo install entropycli
```

This command will compile and install the `entropy` binary on your path (likely, `~/.cargo/bin`).

You can verify that it is installed by running `entropy --version`:
    
```bash
$ entropy --version
entropy 1.0.0
```

All commands in this guide will be underneath the `entropy beacon` subcommand. To see a list of all relevant commands, run `entropy beacon --help`.

# Initializing a Beacon Project
To get started, we will create a new project using the `entropy beacon init` command. This command will walk you through the process of deploying a local instance of the Entropy Beacon, and will setup a `entropy.json` configuration file that will be used by the `entropy` binary to interact with the Beacon.

```bash
$ mkdir my_beacon_project && cd my_beacon_project
$ entropy beacon init
```

## Network Selection / Creation
The wizard prompts you to select a network to add to the configuration file. The available options are:
* `localterra` - Use configuration defaults for LocalTerra
* `localkujira` - Use configuration defaults for a local installation of [Kujira core](https://github.com/Team-Kujira/core)
* `Manual Setup` - Manually create a network configuration

For more information on `Manual Setup`, see the complete [EntropyCLI reference](/beacon/docs/entropycli).

## Wallet Selection / Creation
The wizard will also prompt you to select a wallet to add to the configuration file. You can choose to use one of localterra's built-in wallets, or you can create a new wallet. If you choose to create a new wallet, you must enter a name and mnemonic. If you leave the mnemonic blank, the tool will attempt to fetch the mnemonic from the `MNEMONIC` environment every time the wallet is used.

## Beacon Deployment
The wizard prompts you to deploy the Beacon to the network you selected. If you already have a beacon deployed, you can skip this step and add the address to the configuration file manually. If you wish to deploy at a later time, you can run `entropy beacon deploy` at any time. EntropyCLI will instantiate the Beacon in test mode, which means that the beacon does not verify Entropy submissions. This is useful for testing, as it allows you to submit specific values to the Beacon. Official Beacon deployments on testnets and mainnets will not be in test mode.

## Downloading the Example Contract Template
If you wish, you can also download the [Entropy Example Contract](https://github.com/EntropicLabs/entropy_example_contract). This is a simple contract that demonstrates how to use and interact with the Beacon. It will be downloaded into your current directory.

# Using the EntropyCLI dev worker
EntropyCLI comes with a built-in worker that can be used while developing your dApp. To run the worker, run the following command:
```bash
$ entropy beacon dev
```
The dev worker has three main functions:
* `Auto-submit Entropy` - The worker will automatically submit random entropy to the Beacon as requests come in. This can be kept open in a separate terminal window while you are developing your dApp.
* `Manual-submit Entropy` - The worker will prompt you to manually enter and submit entropy to the Beacon as requests come in. This can be useful if you want to test your dApp with specific entropy values.
* `Fetch active requests` - The worker will simply display request information as the requests come in. It will not submit any entropy.

# Understanding the Entropy Example Contract
The Example contract is a simple contract that demonstrates how to use and interact with the Beacon. It:
1. Requests entropy from the Beacon
2. Receives entropy from the Beacon
3. Uses the entropy to determine whether a coin flip is heads or tails

We recommend that you skim the [Integration Guide](/beacon/docs/integration) or read through the [contract's source code](https://github.com/EntropicLabs/entropy_example_contract) for a deeper understanding.