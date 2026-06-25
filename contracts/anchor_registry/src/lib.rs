#![no_std]
#![no_main]

#[cfg(not(target_env = "wasm32"))]
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
pub struct AnchorRecord {
    pub is_whitelisted: bool,
    pub credit_limit: U256,
    pub reputation_score: u32,
    pub locked_collateral: U256,
    pub first_registered: u64,
}

impl ToBytes for AnchorRecord {
    fn to_bytes(&self) -> Result<Vec<u8>, casper_types::bytesrepr::Error> {
        let mut buffer = casper_types::bytesrepr::allocate_buffer(self)?;
        buffer.extend(self.is_whitelisted.to_bytes()?);
        buffer.extend(self.credit_limit.to_bytes()?);
        buffer.extend(self.reputation_score.to_bytes()?);
        buffer.extend(self.locked_collateral.to_bytes()?);
        buffer.extend(self.first_registered.to_bytes()?);
        Ok(buffer)
    }

    fn serialized_length(&self) -> usize {
        self.is_whitelisted.serialized_length()
            + self.credit_limit.serialized_length()
            + self.reputation_score.serialized_length()
            + self.locked_collateral.serialized_length()
            + self.first_registered.serialized_length()
    }
}

impl FromBytes for AnchorRecord {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), casper_types::bytesrepr::Error> {
        let (is_whitelisted, rem) = bool::from_bytes(bytes)?;
        let (credit_limit, rem) = U256::from_bytes(rem)?;
        let (reputation_score, rem) = u32::from_bytes(rem)?;
        let (locked_collateral, rem) = U256::from_bytes(rem)?;
        let (first_registered, rem) = u64::from_bytes(rem)?;
        Ok((
            AnchorRecord {
                is_whitelisted,
                credit_limit,
                reputation_score,
                locked_collateral,
                first_registered,
            },
            rem,
        ))
    }
}

impl CLTyped for AnchorRecord {
    fn cl_type() -> CLType {
        CLType::Any
    }
}

const REGISTRY_DICT: &str = "anchors_dict";

#[no_mangle]
pub extern "C" fn initialize() {
    let dict_uref = storage::new_dictionary(REGISTRY_DICT).unwrap_or_revert();
    runtime::put_key(REGISTRY_DICT, dict_uref.into());
}

#[no_mangle]
pub extern "C" fn register_anchor() {
    let anchor: Key = runtime::get_named_arg("anchor");
    let credit_limit: U256 = runtime::get_named_arg("credit_limit");

    let record = AnchorRecord {
        is_whitelisted: true,
        credit_limit,
        reputation_score: 800,
        locked_collateral: U256::zero(),
        first_registered: 0,
    };

    let dict_uref: URef = runtime::get_key(REGISTRY_DICT).unwrap_or_revert().into_uref().unwrap_or_revert();
    
    // In a real implementation we would convert the key to a string
    storage::dictionary_put(dict_uref, "anchor_record", record);
}

#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        "initialize",
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        "register_anchor",
        vec![
            Parameter::new("anchor", CLType::Key),
            Parameter::new("credit_limit", CLType::U256),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    let (contract_package_hash, _) = storage::create_contract_package_at_hash();
    let (contract_hash, _) = storage::add_contract_version(contract_package_hash, entry_points, Default::default());
    
    runtime::put_key("anchor_registry_contract", contract_hash.into());
}
