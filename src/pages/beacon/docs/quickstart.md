---
title: Quickstart
description: Get started with the Entropy Beacon
layout: ../../../layouts/DocsLayout.astro
---

This page explains how to get started with developing contracts that utilize the Entropy Beacon. For a deeper understanding of how this system operates, see the [How it Works](/beacon/docs/how-it-works) page.

An example contract can be found [on GitHub](https://github.com/EntropicLabs/entropy_example_contract).

The Entropy Beacon has an [easy-to-use API](https://crates.io/crates/entropy_beacon_cosmos) that allows smart contract developers to request entropy from the Beacon. First, we need to install the crate that provides the API in our smart contract's `Cargo.toml` file.

```toml
[dependencies]
entropy_beacon_cosmos = "1.0.0"
```

We also recommend saving the [deployed Beacon address](/beacon/docs/deployed-addresses) into your smart contract's state, so that you can use it in your contract, and correctly set it during instantiation on testnet and mainnet:

```rust
// Pseudo-code for the instantiation including the Beacon address
pub fn instantiate ( ... ) {
    let state = State {
        beacon_addr: msg.entropy_beacon_address,
        ...
    }
    STATE.save(deps.storage, &state);
    // Whatever else we need to do to instantiate the contract
}
```

When we request entropy, we can pass along a "callback message". This message will be returned to us by the Beacon alongside the generated entropy. In this example, we will use a simple "Request ID" struct that will be included in the callback message.

```rust
// Define the callback struct
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct RequestIDCallbackData {
    pub request_id: u64,
}
```

Then, in our smart contract's `execute` function, we can send a request to the Beacon passing along this callback message. To do so, we must first query the Beacon for the base protocol fee:

```rust
use entropy_beacon_cosmos::{BeaconQueryMsg, BeaconConfigQuery, BeaconConfigResponse};

let beacon_addr = STATE.load(deps.storage)?.beacon_addr;
let beacon_config = deps.querier
    .query::<BeaconConfigResponse>(&cosmwasm_std::QueryRequest::Wasm(
        WasmQuery::Smart {
            contract_addr: beacon_addr.to_string(),
            msg: to_binary(&BeaconQueryMsg::BeaconConfig(BeaconConfigQuery {}))?,
        },
    ))?;

let beacon_fee = beacon_config.protocol_fee;
```

Now that we have all the information we need, we can construct a request and send it to the Beacon. For this, we must first calculate the amount of gas that our callback will need. Keep in mind that if you request too little gas, your request callback will fail, and will not be retried.

```rust
// Import the necessary struct and function
use entropy_beacon_cosmos::{EntropyRequest, calculate_gas_cost};

// Suppose we have logic to increment a request ID counter in the contract's state:
let request_id: u64 = STATE.load(deps.storage)?.next_request_id;
STATE.save(deps.storage, State { next_request_id: request_id + 1 })?;

// Then we can send a request to the Beacon, assume this is inside our `execute` function:
match msg {
    ExecuteMsg::ExampleRequestEntropy {} => {
        // Query the beacon for the base protocol fee, as above. Omitted here.
        let callback_gas = 100_000u64;
        // This helper method converts gas to an equivalent native token amount:
        let beacon_total_fee = Uint128::from(beacon_fee) + calculate_gas_cost(callback_gas);
        Ok(Response::new().add_message(
            EntropyRequest {
                // If this is too low, the callback will fail!
                callback_gas_limit: 100_000u64,
                // The beacon will submit the callback to this contract's address
                callback_address: env.contract.address,
                // The amount of funds should be the callback_gas_limit + a bounty for workers.
                funds: vec![Coin{
                    denom: "uluna".to_string(),
                    amount: beacon_total_fee,
                }],
                // This is a callback message that we will receive along with the entropy
                callback_msg: RequestIDCallbackData {
                    request_id,
                },
            }.into_cosmos(beacon_addr)?, // Convenience method to wrap into a CosmosMsg
        ))
    },
}
```

At this point, we should be able to send requests to the Beacon. However, to receive the entropy, we need to handle the callback message. To do this, we will add a `ReceiveEntropy` message to our contract's `ExecuteMsg`:

```rust
//Import the callback message struct from the API crate
use entropy_beacon_cosmos::EntropyCallbackMsg;

// Add the callback message to the ExecuteMsg enum.
// All your other execute messages don't need to change to accommodate the new message.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    ExampleRequestEntropy {}, // from earlier
    ReceiveEntropy(EntropyCallbackMsg),
    ...
}
```

Notice that the enum choice wraps an `EntropyCallbackMsg`. This type is provided by the API crate, and describes the structure of the callback message. We can now handle the callback message in our smart contract's https://open.spotify.com/track/1y8ooe9Zr1PMIxrOwNeeOi?si=49a06d1d5be649e4`execute` function by adding a `match` arm for `ReceiveEntropy`.  

**Important Note:** You _must_ verify that the sender of the `ReceiveEntropy` callback is the beacon contract. This is to prevent impersonation of the beacon contract and sending fabricated callback messages. Additionally, you _must_ verify that the original requester of the entropy is trusted. In most cases this is making sure that the requester is this contract's address, but if a separate contract requests the entropy, verify the address of the requester to be that contract.

```rust
//In the execute function's match arm:
match msg {
    ExecuteMsg::ExampleRequestEntropy {} => ..., // from earlier
    ExecuteMsg::ReceiveEntropy(callback_msg) => {
        // IMPORTANT: Verify the beacon contract is the sender of the callback message
        // `info.sender` is from `MessageInfo`
        if info.sender != beacon_addr {
            return Err(ContractError::Unauthorized {});
        }
        // IMPORTANT: Verify that the original requester for entropy is trusted (e.g.: this contract)
        if callback_msg.requester != env.contract.address {
            return Err(ContractError::Unauthorized {});
        }

        // entropy is a vector of 32 *random* bytes:
        let entropy: Vec<u8> = callback_msg.entropy;
        // We can also fetch our request ID from the callback data:
        let callback_data: RequestIDCallbackData = from_binary::<RequestIDCallbackData>(&callback_msg.msg)?;
        let request_id: u64 = callback_data.request_id;
        // We can now use the entropy in our smart contract!
        // Here, we just return whether the first byte is even or odd:
        if entropy.first().unwrap() % 2 == 0 {
            Ok(Response::new().add_attribute("result", "even"))
        } else {
            Ok(Response::new().add_attribute("result", "odd"))
        }
    },
    ... // other execute messages that our contract may handle
}
```

And voila! We can use the generated entropy just like any traditional randomness source. We can directly access the random bytes, like we did above, or we can seed a pseudo-random number generator with the entropy, to generate multiple random numbers with APIs that might be more familiar to you.
