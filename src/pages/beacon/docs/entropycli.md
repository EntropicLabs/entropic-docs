---
title: EntropyCLI Reference
description: Reference for the EntropyCLI tool
layout: ../../../layouts/DocsLayout.astro
---
# Commands
```
$ entropy --help
```
List the base commands for the EntropyCLI tool.
* [beacon](#beacon)
* [network](#network)
* [worker](#worker)

## beacon
```
$ entropy beacon --help
```
Commands for manging interaction and development using local instances of the Entropy Beacon.
* [init](#init)
* [deploy](#deploy)
* [dev](#dev)
* [wallet](#wallet)
* [network](#network)

### init
```
$ entropy beacon init --help
```
Launch the Entropy Beacon initialization wizard. This will walk you through the process of deploying a local instance of the Entropy Beacon, and will setup a `entropy.json` configuration file that will be used by the `entropy` binary to interact with the Beacon.

#### Network Selection / Creation
The wizard prompts you to select a network to add to the configuration file. The available options are:
* `localterra` - Use configuration defaults for LocalTerra
* `localkujira` - Use configuration defaults for a local installation of [Kujira core](https://github.com/Team-Kujira/core)
* `Manual Setup` - Manually create a network configuration

Manual Network Creation requires the following information:
* `Network Name` - The name of the network. This will be used to identify the network in the configuration file.
* `Chain ID` - The chain ID of the network. This is used to identify the network when submitting transactions.
* `LCD URL` - The URL of the LCD endpoint for the network. This is used to query the network for information.
* `Gas Denom` - The denomination of gas used by the network. This is used to calculate gas prices for transactions. For example, `uluna` for Terra, `ukuji` for Kujira, etc.
* `Gas Price` - The gas price of the network.
* `Gas Adjustment` - The gas adjustment used when calculating gas prices for transactions. When set higher than `1.0`, this will pad gas estimation to ensure that transactions are not rejected due to insufficient gas.
* `Derivation Path` - The derivation path used to generate addresses for the network. This is used to generate addresses for the wallet. For example, `m/44'/118'/0'/0/0` for most Cosmos-SDK chains, and `m/44'/330'/0'/0/0` for Kujira.
* `Chain Prefix` - The prefix used to encode addresses for the network. This is used to encode addresses for the wallet. For example, `terra` for Terra, `kujira` for Kujira, etc.

#### Wallet Creation
The wizard will also prompt you to select a wallet to add to the configuration file. You can choose to use one of localterra's built-in wallets, or you can create a new wallet. If you choose to create a new wallet, you must enter a name and mnemonic. If you leave the mnemonic blank, the tool will attempt to fetch the mnemonic from the `MNEMONIC` environment every time the wallet is used.

#### Deployment Configuration
The wizard will then prompt you to deploy the Entropy Beacon contract. For more information on the deployment process, see the [deploy](#deploy) command.

### deploy
```
$ entropy beacon deploy --help
```
Deploy the Entropy Beacon contract to the default network in the configuration file using the default wallet. You can use a different network or wallet by specifying the `--network` and `--wallet` flags. This command will download and deploy the latest version of the Entroy Beacon contract's WASM bytecode from the releases page on [GitHub](https://github.com/EntropicLabs/entropy_beacon_contracts/tags). If you want to deploy a different version of the contract, you can download the WASM file and specify the `--wasm` flag.

### dev
```
$ entropy beacon dev --help
```
Launch a development worker for streamlining development with the Entropy Beacon. This worker has three modes:
* `Auto-submit Entropy` - The worker will automatically submit random entropy to the Beacon as requests come in. This can be kept open in a separate terminal window while you are developing your dApp.
* `Manual-submit Entropy` - The worker will prompt you to manually enter and submit entropy to the Beacon as requests come in. This can be useful if you want to test your dApp with specific entropy values.
* `Fetch active requests` - The worker will simply display request information as the requests come in. It will not submit any entropy.

### wallet
```
$ entropy beacon wallet --help
```
This command has three subcommands:
* `new` - Create a new wallet and add it to the configuration file. This follows the same process as the `init` command.
* `list` - List the wallets in the configuration file.
* `remove` - Remove a wallet from the configuration file.

## network
```
$ entropy network --help
```
Commands for applying network configuration changes to the configuration file.

### add
Add a new network to the configuration file. This follows the same process as the `init` command.

### list
List the networks in the configuration file.

### remove
Remove a network from the configuration file.

## worker
*Under Construction*