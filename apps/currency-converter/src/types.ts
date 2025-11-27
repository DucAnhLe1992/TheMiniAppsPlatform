export interface CurrencyConverterProps {
  baseCurrency?: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface Budget {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  total_amount: number;
  period: string;
  start_date: string;
  end_date: string | null;
}

export interface Expense {
  id: string;
  budget_id: string;
  description: string;
  amount: number;
  category: string | null;
  date: string;
  notes: string | null;
}

// Insert payload types (Supabase)
export interface NewBudgetInsert {
  user_id: string;
  name: string;
  description: string | null;
  currency: string;
  total_amount: number;
  period: string;
  start_date: string;
}

export interface NewExpenseInsert {
  budget_id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const CURRENCIES: Array<{ code: string; name: string; symbol: string }> =
  [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
    { code: "DKK", name: "Danish Krone", symbol: "kr" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
    { code: "KRW", name: "South Korean Won", symbol: "₩" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺" },
    { code: "THB", name: "Thai Baht", symbol: "฿" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "SAR", name: "Saudi Riyal", symbol: "SR" },
  ];

export const EXPENSE_CATEGORIES: string[] = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Other",
];
