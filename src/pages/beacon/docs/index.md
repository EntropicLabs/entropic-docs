---
title: Overview
description: An Overview of the Entropy Beacon System
layout: ../../../layouts/DocsLayout.astro
---

The Entropy Beacon exists to provide a way for smart contract developers to securely generate random numbers on the blockchain. To see how to get started building with the Beacon, check out the [Quickstart Guide](/beacon/docs/quickstart). To see how to integrate the Beacon into your existing projects, check out the [Integration Guide](/beacon/docs/integration).

## Why?

Many decentralized applications are not possible without "random" effects. This includes usecases like lotteries, bias-free giveaways, and other interactive applications like Web3 games. However, Blockchains are closed, deterministic systems. Therefore it's not possible to obtain unpredictable randomly generated numbers from within the system. Seemingly random data sources such as the hash of the current block is actually highly susceptible to [block witholding attacks](https://docs.cosmwasm.com/docs/1.0/architecture/smart-contracts/#warning-entropy-illusion). Similarly, all other data that is seemingly random is always explotable by bad actors.  

The Entropy Beacon provides a way for smart contract developers to request random numbers, and for these requests to be fulfilled by external random number generators, in a verifiably random, trustless and efficient manner. Compared to existing solutions on other blockchains, Beacon was designed from the ground up without any complicated subscriptions or profit incentives in mind, so using Beacon is not only cheap, but super simple. To see how the system works, visit the [How it Works](/beacon/docs/how-it-works) page.
