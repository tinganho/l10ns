
use std::env;
use std::default;

mod compiler;

use compiler::scanner::*;

fn main() {
    let args: Vec<String> = env::args().collect();
	let scanner: Scanner = Default::default();
	println!("hello world {:?}", args);
}
