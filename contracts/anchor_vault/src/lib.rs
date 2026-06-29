#![no_main]
#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;

use alloc::{string::String, vec::Vec};
use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    api_error::ApiError,
    bytesrepr::{FromBytes, ToBytes},
    CLType, CLTyped, EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, Key, Parameter,
    URef, U256,
};

#[derive(Clone, PartialEq, Eq)]
pub struct PoolState {
    pub token: Key,
    pub total_deposits: U256,
    pub active_draws: U256,
    pub reserve_balance: U256,
    pub acc_fees_per_share: U256,
    pub optimal_utilization: u32,
    pub base_fee_bps: u32,
    pub slope_1_bps: u32,
    pub slope_2_bps: u32,
}

impl ToBytes for PoolState {
    fn to_bytes(&self) -> Result<Vec<u8>, casper_types::bytesrepr::Error> {
        let mut buffer = casper_types::bytesrepr::allocate_buffer(self)?;
        buffer.extend(self.token.to_bytes()?);
        buffer.extend(self.total_deposits.to_bytes()?);
        buffer.extend(self.active_draws.to_bytes()?);
        buffer.extend(self.reserve_balance.to_bytes()?);
        buffer.extend(self.acc_fees_per_share.to_bytes()?);
        buffer.extend(self.optimal_utilization.to_bytes()?);
        buffer.extend(self.base_fee_bps.to_bytes()?);
        buffer.extend(self.slope_1_bps.to_bytes()?);
        buffer.extend(self.slope_2_bps.to_bytes()?);
        Ok(buffer)
    }

    fn serialized_length(&self) -> usize {
        self.token.serialized_length()
            + self.total_deposits.serialized_length()
            + self.active_draws.serialized_length()
            + self.reserve_balance.serialized_length()
            + self.acc_fees_per_share.serialized_length()
            + self.optimal_utilization.serialized_length()
            + self.base_fee_bps.serialized_length()
            + self.slope_1_bps.serialized_length()
            + self.slope_2_bps.serialized_length()
    }
}

impl FromBytes for PoolState {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), casper_types::bytesrepr::Error> {
        let (token, rem) = Key::from_bytes(bytes)?;
        let (total_deposits, rem) = U256::from_bytes(rem)?;
        let (active_draws, rem) = U256::from_bytes(rem)?;
        let (reserve_balance, rem) = U256::from_bytes(rem)?;
        let (acc_fees_per_share, rem) = U256::from_bytes(rem)?;
        let (optimal_utilization, rem) = u32::from_bytes(rem)?;
        let (base_fee_bps, rem) = u32::from_bytes(rem)?;
        let (slope_1_bps, rem) = u32::from_bytes(rem)?;
        let (slope_2_bps, rem) = u32::from_bytes(rem)?;
        Ok((
            PoolState {
                token,
                total_deposits,
                active_draws,
                reserve_balance,
                acc_fees_per_share,
                optimal_utilization,
                base_fee_bps,
                slope_1_bps,
                slope_2_bps,
            },
            rem,
        ))
    }
}

impl CLTyped for PoolState {
    fn cl_type() -> CLType {
        CLType::Any
    }
}

const POOL_DICT: &str = "pool_state";

fn set_pool_state(state: PoolState) {
    let dict_uref: URef = runtime::get_key(POOL_DICT)
        .unwrap_or_revert()
        .into_uref()
        .unwrap_or_revert();
    storage::dictionary_put(dict_uref, "main", state);
}

fn get_pool_state() -> PoolState {
    let dict_uref: URef = runtime::get_key(POOL_DICT)
        .unwrap_or_revert()
        .into_uref()
        .unwrap_or_revert();
    storage::dictionary_get(dict_uref, "main")
        .unwrap_or_revert()
        .unwrap_or_revert()
}

#[no_mangle]
pub extern "C" fn initialize() {
    let token: Key = runtime::get_named_arg("token");
    let gov_token: Key = runtime::get_named_arg("gov_token");
    let optimal_utilization: u32 = runtime::get_named_arg("optimal_utilization");
    let base_fee_bps: u32 = runtime::get_named_arg("base_fee_bps");
    let slope_1_bps: u32 = runtime::get_named_arg("slope_1_bps");
    let slope_2_bps: u32 = runtime::get_named_arg("slope_2_bps");

    let pool = PoolState {
        token,
        total_deposits: U256::zero(),
        active_draws: U256::zero(),
        reserve_balance: U256::zero(),
        acc_fees_per_share: U256::zero(),
        optimal_utilization,
        base_fee_bps,
        slope_1_bps,
        slope_2_bps,
    };

    let dict_uref = storage::new_dictionary(POOL_DICT).unwrap_or_revert();
    runtime::put_key(POOL_DICT, dict_uref.into());
    set_pool_state(pool);
}

#[no_mangle]
pub extern "C" fn deposit() {
    let amount: U256 = runtime::get_named_arg("amount");
    let lp_key: Key = runtime::get_caller().into();

    let mut pool = get_pool_state();
    
    // In a real CEP-18 integration, we'd call the token contract to transfer funds here
    // let token_contract = pool.token.into_hash().unwrap_or_revert();
    // runtime::call_contract::<()>(token_contract, "transfer_from", runtime_args!{ ... });

    pool.total_deposits += amount;
    pool.reserve_balance += amount;

    set_pool_state(pool);
}

#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        "initialize",
        vec![
            Parameter::new("token", CLType::Key),
            Parameter::new("gov_token", CLType::Key),
            Parameter::new("optimal_utilization", CLType::U32),
            Parameter::new("base_fee_bps", CLType::U32),
            Parameter::new("slope_1_bps", CLType::U32),
            Parameter::new("slope_2_bps", CLType::U32),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "deposit",
        vec![Parameter::new("amount", CLType::U256)],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    let (contract_package_hash, _) = storage::create_contract_package_at_hash();
    let (contract_hash, _) = storage::add_contract_version(contract_package_hash, entry_points, Default::default());
    
    runtime::put_key("anchor_vault_contract", contract_hash.into());
}
