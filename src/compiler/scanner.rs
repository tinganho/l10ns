
use std::str;

#[derive(Default)]
pub struct Scanner<'a> {
	pos: usize,
	end: usize,
	source: Option<str::Chars<'a>>,
	cur_char: char,
}

pub trait ScanFiles<'a> {
	fn read_source_file(&mut self, source: &'a String);
	fn next_token(&mut self) -> Option<char>;
}

impl<'a> ScanFiles<'a> for Scanner<'a> {
	fn read_source_file(&mut self, source: &'a String) {
		self.source = Some(source.chars());
	}

	fn next_token(&mut self) -> Option<char> {
		return self.source.as_mut().unwrap().next();
	}
}

pub enum MessageFormatTokens {

	// Punctuations
	OpeningBrace,
	ClosingBrace,
	Comma,
	Hash,
	SingleQuote,
	Underscore,

	// Types
	SelectKeyword,
	ValueKeyword,
	PluralKeyword,
	OrdinalKeyword,
	NumberKeyword,
	CurrencyKeyword,
	DateKeyword,

	// Modifiers
	LocalKeyword,
	GlobalKeyword,

	// Values
	ShortKeyword,
	LongKeyword,

	// Others
	Identifier,
	TextTrivia,
	MessageFormat,
}
