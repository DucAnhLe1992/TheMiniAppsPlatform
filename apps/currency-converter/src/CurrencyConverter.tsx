import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, useTheme } from '@shared';
import { motion, AnimatePresence } from 'framer-motion';

interface ExchangeRates {
  [key: string]: number;
}

interface Budget {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  total_amount: number;
  period: string;
  start_date: string;
  end_date: string | null;
}

interface Expense {
  id: string;
  budget_id: string;
  description: string;
  amount: number;
  category: string | null;
  date: string;
  notes: string | null;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
];

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'];

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0 4rem 0;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -2px;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1.5rem 0;
`;

const ConverterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConversionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.875rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1.125rem;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.875rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SwapButton = styled(motion.button)`
  align-self: center;
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${props => props.theme.colors.primaryHover};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ResultBox = styled.div`
  padding: 1.5rem;
  background: ${props => props.theme.colors.primaryLight};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  margin-top: 1rem;
`;

const ResultLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const ResultValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const ResultRate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.5rem;
`;

const BudgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const BudgetCard = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const BudgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
`;

const BudgetName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const BudgetPeriod = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: #ffffff;
  border-radius: 4px;
`;

const ProgressBar = styled.div`
  margin: 1rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProgressTrack = styled.div`
  height: 8px;
  background: ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ $over: boolean }>`
  height: 100%;
  background: ${props => props.$over ? '#ef4444' : props.theme.colors.primary};
  border-radius: 4px;
`;

const BudgetAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const BudgetRemaining = styled.div<{ $over: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.$over ? '#ef4444' : props.theme.colors.textSecondary};
  font-weight: 600;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$variant === 'primary' ? props.theme.colors.primary : props.theme.colors.surface};
  color: ${props => props.$variant === 'primary' ? '#ffffff' : props.theme.colors.text};
  border: ${props => props.$variant === 'secondary' ? `1px solid ${props.theme.colors.border}` : 'none'};

  &:hover {
    background: ${props => props.$variant === 'primary' ? props.theme.colors.primaryHover : props.theme.colors.surfaceHover};
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
`;

const ExpenseInfo = styled.div`
  flex: 1;
`;

const ExpenseDescription = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ExpenseDetails = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ExpenseAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const DeleteButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  margin-left: 0.5rem;

  &:hover {
    background: #fee;
    color: #ef4444;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CurrencyConverter: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'converter' | 'budget'>('converter');
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<{ [budgetId: string]: Expense[] }>({});
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetDescription, setNewBudgetDescription] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetCurrency, setNewBudgetCurrency] = useState('USD');
  const [newBudgetPeriod, setNewBudgetPeriod] = useState('monthly');

  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Other');
  const [newExpenseDate, setNewExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    initUser();
    fetchExchangeRates();
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency] && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const baseAmount = numAmount / exchangeRates[fromCurrency];
        const result = baseAmount * exchangeRates[toCurrency];
        setConvertedAmount(result);
      }
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const initUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchExchangeRates = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-exchange-rates?base=USD`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch exchange rates');

      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      const fallbackRates: ExchangeRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        CAD: 1.36,
        AUD: 1.53,
        CHF: 0.88,
        CNY: 7.24,
        INR: 83.12,
        MXN: 17.05,
        NZD: 1.62,
        SEK: 10.55,
        NOK: 10.85,
        DKK: 6.87,
        SGD: 1.34,
        HKD: 7.83,
        KRW: 1308.50,
        BRL: 4.97,
        ZAR: 18.65,
        RUB: 92.50,
        TRY: 32.15,
        THB: 35.20,
        PLN: 3.98,
        AED: 3.67,
        SAR: 3.75,
      };
      setExchangeRates(fallbackRates);
    }
  };

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);

      if (data) {
        for (const budget of data) {
          await fetchExpenses(budget.id);
        }
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchExpenses = async (budgetId: string) => {
    try {
      const { data, error } = await supabase
        .from('budget_expenses')
        .select('*')
        .eq('budget_id', budgetId)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(prev => ({ ...prev, [budgetId]: data || [] }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newBudgetName.trim() || !newBudgetAmount) return;

    try {
      const { error } = await supabase.from('budgets').insert({
        user_id: userId,
        name: newBudgetName,
        description: newBudgetDescription || null,
        currency: newBudgetCurrency,
        total_amount: parseFloat(newBudgetAmount),
        period: newBudgetPeriod,
        start_date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      await fetchBudgets();
      setShowBudgetModal(false);
      setNewBudgetName('');
      setNewBudgetDescription('');
      setNewBudgetAmount('');
      setNewBudgetCurrency('USD');
      setNewBudgetPeriod('monthly');
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedBudget || !newExpenseDescription.trim() || !newExpenseAmount) return;

    try {
      const { error } = await supabase.from('budget_expenses').insert({
        budget_id: selectedBudget.id,
        user_id: userId,
        description: newExpenseDescription,
        amount: parseFloat(newExpenseAmount),
        category: newExpenseCategory,
        date: newExpenseDate,
      });

      if (error) throw error;

      await fetchExpenses(selectedBudget.id);
      setNewExpenseDescription('');
      setNewExpenseAmount('');
      setNewExpenseCategory('Other');
      setNewExpenseDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string, budgetId: string) => {
    if (!confirm('Delete this expense?')) return;

    try {
      const { error } = await supabase
        .from('budget_expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      await fetchExpenses(budgetId);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('Delete this budget and all its expenses?')) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);

      if (error) throw error;
      await fetchBudgets();
      if (selectedBudget?.id === budgetId) {
        setShowExpenseModal(false);
        setSelectedBudget(null);
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const getTotalSpent = (budgetId: string) => {
    const budgetExpenses = expenses[budgetId] || [];
    return budgetExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);
  };

  const getProgress = (budget: Budget) => {
    const spent = getTotalSpent(budget.id);
    return Math.min((spent / parseFloat(budget.total_amount.toString())) * 100, 100);
  };

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find(c => c.code === code)?.symbol || code;
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>Currency & Budget</Title>
        <Subtitle theme={theme}>Convert currencies and manage your budgets</Subtitle>
      </Header>

      <TabContainer theme={theme}>
        <Tab theme={theme} $active={activeTab === 'converter'} onClick={() => setActiveTab('converter')}>
          💱 Currency Converter
        </Tab>
        <Tab theme={theme} $active={activeTab === 'budget'} onClick={() => setActiveTab('budget')}>
          💰 Budget Calculator
        </Tab>
      </TabContainer>

      {activeTab === 'converter' && (
        <Section theme={theme}>
          <SectionTitle theme={theme}>Convert Currency</SectionTitle>
          <ConverterGrid>
            <ConversionBox>
              <Label theme={theme}>From</Label>
              <InputGroup>
                <Input
                  theme={theme}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                />
                <Select
                  theme={theme}
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </Select>
              </InputGroup>
            </ConversionBox>

            <SwapButton
              theme={theme}
              onClick={handleSwapCurrencies}
              whileTap={{ rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              ⇄
            </SwapButton>

            <ConversionBox>
              <Label theme={theme}>To</Label>
              <InputGroup>
                <Input
                  theme={theme}
                  type="text"
                  value={convertedAmount?.toFixed(2) || '0.00'}
                  readOnly
                />
                <Select
                  theme={theme}
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name}
                    </option>
                  ))}
                </Select>
              </InputGroup>
            </ConversionBox>
          </ConverterGrid>

          {convertedAmount !== null && (
            <ResultBox theme={theme}>
              <ResultLabel theme={theme}>Conversion Result</ResultLabel>
              <ResultValue theme={theme}>
                {getCurrencySymbol(toCurrency)} {convertedAmount.toFixed(2)}
              </ResultValue>
              <ResultRate theme={theme}>
                1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
              </ResultRate>
            </ResultBox>
          )}
        </Section>
      )}

      {activeTab === 'budget' && (
        <>
          <Section theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionTitle theme={theme}>Your Budgets</SectionTitle>
              <Button theme={theme} $variant="primary" onClick={() => setShowBudgetModal(true)}>
                + Create Budget
              </Button>
            </div>

            {budgets.length === 0 ? (
              <EmptyState>
                <EmptyIcon>💰</EmptyIcon>
                <EmptyText theme={theme}>No budgets yet. Create your first budget to start tracking!</EmptyText>
              </EmptyState>
            ) : (
              <BudgetGrid>
                {budgets.map(budget => {
                  const spent = getTotalSpent(budget.id);
                  const remaining = parseFloat(budget.total_amount.toString()) - spent;
                  const progress = getProgress(budget);
                  const isOver = remaining < 0;

                  return (
                    <BudgetCard
                      key={budget.id}
                      theme={theme}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        setSelectedBudget(budget);
                        setShowExpenseModal(true);
                      }}
                    >
                      <BudgetHeader>
                        <BudgetName theme={theme}>{budget.name}</BudgetName>
                        <BudgetPeriod theme={theme}>{budget.period}</BudgetPeriod>
                      </BudgetHeader>

                      <BudgetAmount theme={theme}>
                        {getCurrencySymbol(budget.currency)} {parseFloat(budget.total_amount.toString()).toFixed(2)}
                      </BudgetAmount>
                      <BudgetRemaining theme={theme} $over={isOver}>
                        {isOver ? 'Over by' : 'Remaining'}: {getCurrencySymbol(budget.currency)} {Math.abs(remaining).toFixed(2)}
                      </BudgetRemaining>

                      <ProgressBar>
                        <ProgressLabel theme={theme}>
                          <span>Spent</span>
                          <span>{progress.toFixed(0)}%</span>
                        </ProgressLabel>
                        <ProgressTrack theme={theme}>
                          <ProgressFill
                            theme={theme}
                            $over={isOver}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </ProgressTrack>
                      </ProgressBar>
                    </BudgetCard>
                  );
                })}
              </BudgetGrid>
            )}
          </Section>
        </>
      )}

      <AnimatePresence>
        {showBudgetModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBudgetModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle theme={theme}>Create Budget</ModalTitle>
                <CloseButton theme={theme} onClick={() => setShowBudgetModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleCreateBudget}>
                <FormGroup>
                  <Label theme={theme}>Budget Name *</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={newBudgetName}
                    onChange={(e) => setNewBudgetName(e.target.value)}
                    placeholder="e.g., Monthly Expenses"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Description</Label>
                  <Textarea
                    theme={theme}
                    value={newBudgetDescription}
                    onChange={(e) => setNewBudgetDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Amount *</Label>
                  <Input
                    theme={theme}
                    type="number"
                    step="0.01"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Currency</Label>
                  <Select
                    theme={theme}
                    value={newBudgetCurrency}
                    onChange={(e) => setNewBudgetCurrency(e.target.value)}
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Period</Label>
                  <Select
                    theme={theme}
                    value={newBudgetPeriod}
                    onChange={(e) => setNewBudgetPeriod(e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                  </Select>
                </FormGroup>

                <ButtonGroup>
                  <Button theme={theme} type="button" $variant="secondary" onClick={() => setShowBudgetModal(false)}>
                    Cancel
                  </Button>
                  <Button theme={theme} type="submit" $variant="primary">
                    Create Budget
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}

        {showExpenseModal && selectedBudget && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExpenseModal(false)}
          >
            <ModalContent
              theme={theme}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle theme={theme}>{selectedBudget.name}</ModalTitle>
                <CloseButton theme={theme} onClick={() => setShowExpenseModal(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleAddExpense}>
                <FormGroup>
                  <Label theme={theme}>Description *</Label>
                  <Input
                    theme={theme}
                    type="text"
                    value={newExpenseDescription}
                    onChange={(e) => setNewExpenseDescription(e.target.value)}
                    placeholder="e.g., Groceries"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Amount *</Label>
                  <Input
                    theme={theme}
                    type="number"
                    step="0.01"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Category</Label>
                  <Select
                    theme={theme}
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                  >
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label theme={theme}>Date</Label>
                  <Input
                    theme={theme}
                    type="date"
                    value={newExpenseDate}
                    onChange={(e) => setNewExpenseDate(e.target.value)}
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button theme={theme} type="submit" $variant="primary">
                    Add Expense
                  </Button>
                </ButtonGroup>
              </Form>

              <ExpenseList>
                {(expenses[selectedBudget.id] || []).map(expense => (
                  <ExpenseItem key={expense.id} theme={theme}>
                    <ExpenseInfo>
                      <ExpenseDescription theme={theme}>{expense.description}</ExpenseDescription>
                      <ExpenseDetails theme={theme}>
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </ExpenseDetails>
                    </ExpenseInfo>
                    <ExpenseAmount theme={theme}>
                      {getCurrencySymbol(selectedBudget.currency)} {parseFloat(expense.amount.toString()).toFixed(2)}
                    </ExpenseAmount>
                    <DeleteButton theme={theme} onClick={() => handleDeleteExpense(expense.id, selectedBudget.id)}>
                      ✕
                    </DeleteButton>
                  </ExpenseItem>
                ))}
              </ExpenseList>

              <ButtonGroup style={{ marginTop: '1.5rem' }}>
                <Button theme={theme} $variant="secondary" onClick={() => handleDeleteBudget(selectedBudget.id)}>
                  🗑️ Delete Budget
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default CurrencyConverter;
