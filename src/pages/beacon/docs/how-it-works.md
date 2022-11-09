---
title: How it Works
description: An Overview of how the Entropy Beacon Works
layout: ../../../layouts/DocsLayout.astro
---

This page explains how the beacon works on a conceptual level. We recommend reading this for a comprehensive understanding of the system. For a guide on how to use the Entropy Beacon as a developer, see the [Quickstart Guide](/beacon/docs/quickstart).

The Entropy Beacon system has two major components:

1. The Beacon smart contract
2. The Off-chain Entropy Workers

The off-chain workers use a cryptographic function called a Verifiable Random Function, or VRF, that is used to generate provably random numbers. They then submit the generated entropy to the Beacon smart contract, which verifies the entropy, and forwards it to the smart contracts that requested randomness.

# What is a Verifiable Random Function (VRF)?

To generate entropy, workers must pass their VRF private key, and a "seed" through a VRF proof generator to generate a pseudorandom number and a "proof". Third-party entities can then use the worker's VRF public key to verify that the pseudorandom number was generated without tampering. Since only the public key is used to verify proofs, the worker's private key is not exposed and therefore no one can steal the identity of the worker.

# Generating Unbiased Entropy

One major problem with simply using a VRF is that a VRF is deterministic. This means that the same seed with the same key will _always_ generate the same pseudorandom number and proof. The solution that we have proposed is the same solution that is used in validator selection in other blockchains such as Algorand -- The VRF seed must be the last submitted entropy. This means that a worker is forced to use a known seed, and cannot try to choose a seed at random.

However, there are two inputs to a VRF function. What happens when a worker tries to generate private keys so that they can select a biased pseudorandom number? To combat this, we have implemented an "activation lock period" for public keys. Proofs that are verified using a certain public key can only be used after this period has passed. This prevents a worker from generating infinitely many keys until one of them has a favorable output, because keys must be known in advance. On top of this, it's extremely unlikely that an attacker can generate thousands of _valid_ random numbers using their keys and select a favorable one before another worker in the network simply submits their own valid proof.

In addition to these two mitigations, workers must "deposit" some collateral to the Beacon smart contract when whitelisting their public key. This deposit is refundable after a certain amount of requests have been submitted using the key. This ensures that a Sybil attack is extremely costly to the attacker, and that the all the keys that are generated _must_ be used before the deposit is refunded, bringing more security to the entire system.

Once the Beacon contract has received entropy from a worker, it will verify the proof and then run a callback function for every request that was received. The callback data contains the submitted entropy, as well as other callback data that was provided in the initial request.

# Worker Sustainability

Since workers must be running off-chain, constantly polling the Beacon for new requests, and then submitting entropy to the Beacon, they incur a cost. This cost is paid out to the workers by the users of the Beacon. Whenever a contract requests entropy from the Beacon, it must send the Beacon a small balance that includes:

- The gas fee that is needed to run the callback function.
- A leftover "bounty", that is cashed out by workers that submit entropy to fulfill the request.

This is what allows workers to sustain themselves, and determine a fair "bounty" price by rejecting requests that are too expensive. This means that anyone can sustainably run a worker, promoting decentralization to the fullest extent. Note that this probably won't hold true in the early stages of the ecosystem, since volume on the beacon may be extremely low.