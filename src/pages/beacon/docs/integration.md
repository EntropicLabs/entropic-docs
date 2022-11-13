---
title: Integrating Beacon into Existing Smart Contracts
description: Guide to integrating the Entropy Beacon into existing smart contracts
layout: ../../../layouts/DocsLayout.astro
---
The Entropy Beacon has an [easy-to-use API](https://crates.io/crates/entropy_beacon_cosmos) that allows smart contract developers to integrate Beacon into their existing projects. We also recommend installing EntropyCLI (as in the [quickstart guide](/beacon/docs/quickstart)) for the local Beacon environment. First, we need to install the crate that provides the API in our smart contract's `Cargo.toml` file.

```toml
[dependencies]
entropy_beacon_cosmos = "2"
```

You must also save the [deployed Beacon address](/beacon/docs/deployed-addresses) in your smart contract's state, so that your contract can request entropy from the Beacon. We recommend doing this in the `instantiate` function to facilitate deployments to different networks.

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
pub struct EntropyCallbackData {
    pub original_sender: Addr,
}
```

Then, in our smart contract's `execute` function, we can send a request to the Beacon passing along this callback message. Our request must also specify the amount of gas that the callback will need to execute successfully. To pay for the request, we can query the Beacon contract to calculate the fee that will be required:

```rust
use entropy_beacon_cosmos::beacon::CalculateFeeQuery;

// In our execute function, we specify how much gas our callback will need:
let callback_gas_limit = 100_000u64;

let state = STATE.load(deps.storage)?;
let beacon_addr = state.entropy_beacon_addr;
// The beacon allows us to query the fee it will charge for a request, given the gas limit we provide.
let beacon_fee =
    CalculateFeeQuery::query(deps.as_ref(), callback_gas_limit, beacon_addr.clone())?;
```
It is important that you query the Beacon for the fee before sending the request, as the fee may change over time. Please not that this fee *may* be zero. For example, on Kujira, beacon requests are subsidized and are free. If your request specifies a fee that is too low to pay for the gas requested, then the request will not be accepted by the Beacon. If the gas requested does not sufficiently cover the execution of the callback, then the callback will fail and will NOT be retried.


Now that we have all the information we need, we can construct a request and send it to the Beacon:

```rust
// Import the necessary struct and function
use entropy_beacon_cosmos::EntropyRequest;

// Suppose we have logic to increment a request ID counter in the contract's state:
let request_id: u64 = STATE.load(deps.storage)?.next_request_id;
STATE.save(deps.storage, State { next_request_id: request_id + 1 })?;

// Then we can send a request to the Beacon, assume this is inside our `execute` function:
match msg {
    ExecuteMsg::ExampleRequestEntropy {} => {
        // Grab beacon_fee from earlier
        Ok(Response::new().add_message(
            EntropyRequest {
                callback_gas_limit,
                callback_address: env.contract.address,
                funds: vec![Coin {
                    denom: "uluna".to_string(), // Change this to match your chain's native token.
                    amount: Uint128::from(beacon_fee),
                }],
                // A custom struct and data we define for callback info.
                // You should change this callback message struct to match the information your contract needs.
                callback_msg: EntropyCallbackData {
                    original_sender: info.sender,
                },
            }
            .into_cosmos(beacon_addr)?,
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
    ReceiveEntropy(EntropyCallbackMsg), // new message
    ...
}
```

Notice that the enum choice wraps an `EntropyCallbackMsg` provided by `entropy_beacon_cosmos`. This type describes the structure of the callback message. If this `ExecuteMsg` enum variant is constructed incorrectly, the callback **will** fail. We can now handle the callback message in our smart contract's `execute` function by adding a `match` arm for `ReceiveEntropy`.  

**Important Note:** You _must_ verify that the sender of the `ReceiveEntropy` callback is the beacon contract. This is to prevent impersonation of the beacon contract and sending fabricated callback messages. Additionally, you _must_ verify that the original requester of the entropy is trusted. In most cases this is making sure that the requester is this contract's address, but if a separate contract requests the entropy, verify the address of the requester to be that contract. If these invariants are not met, your contract WILL BE VULNERABLE to exploits.

```rust
//In the execute function's match arm:
match msg {
    ExecuteMsg::ExampleRequestEntropy {} => ..., // from earlier
    ExecuteMsg::ReceiveEntropy(data) => {
        let state = STATE.load(deps.storage)?;
        let beacon_addr = state.entropy_beacon_addr;
        // IMPORTANT: Verify that the callback was called by the beacon, and not by someone else.
        if info.sender != beacon_addr {
            return Err(ContractError::Unauthorized {});
        }

        // IMPORTANT: Verify that the original requester for entropy is trusted (e.g.: this contract)
        if data.requester != env.contract.address {
            return Err(ContractError::Unauthorized {});
        }

        // The callback data has 64 bytes of entropy, in a Vec<u8>.
        let entropy = data.entropy;
        // We can parse out our custom callback data from the message.
        let callback_data = data.msg;
        let callback_data = from_binary::<EntropyCallbackData>(&callback_data)?;
        let mut response = Response::new();

        response =
            response.add_attribute("flip_original_caller", callback_data.original_sender);

        // Now we can do whatever we want with the entropy as a randomness source!
        // We can seed a PRNG with the entropy, but here, we just whether the last byte is even or odd.
        if entropy.last().unwrap() % 2 == 0 {
            response = response.add_attribute("flip_result", "heads");
        } else {
            response = response.add_attribute("flip_result", "tails");
        }
        Ok(response)
    },
    ... // other execute messages that our contract may handle
}
```

And voila! We can use the generated entropy just like any traditional randomness source. We can directly access the random bytes, like we did above, or we can seed a pseudo-random number generator with the entropy, to generate multiple random numbers with APIs that might be more familiar to you. The returned entropy is 64 bytes long.