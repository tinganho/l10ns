
use compiler::scanner::*;

pub struct Parser {
    plural_rules: Vec<String>,
    ordinal_rules: Vec<String>,
    cur_tok: MessageFormatTokens,
}

pub trait ParseTokens {
    fn parse() {
        
    }
}
