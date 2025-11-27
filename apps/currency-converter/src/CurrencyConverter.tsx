import React, { useState, useEffect, useCallback } from "react";
import { supabase, useTheme } from "@shared";
import { AnimatePresence } from "framer-motion";
import {
  Container,
  Header,
  Title,
  Subtitle,
  TabContainer,
  Tab,
  Section,
  SectionTitle,
  ConverterGrid,
  ConversionBox,
  Label,
  InputGroup,
  Input,
  Select,
  SwapButton,
  ResultBox,
  ResultLabel,
  ResultValue,
  ResultRate,
  BudgetGrid,
  BudgetCard,
  BudgetHeader,
  BudgetName,
  BudgetPeriod,
  ProgressBar,
  ProgressLabel,
  ProgressTrack,
  ProgressFill,
  BudgetAmount,
  BudgetRemaining,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Textarea,
  ButtonGroup,
  ExpenseList,
  ExpenseItem,
  ExpenseInfo,
  ExpenseDescription,
  ExpenseDetails,
  ExpenseAmount,
  DeleteButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from "./styles";
import type {
  ExchangeRates,
  Budget,
  Expense,
  NewBudgetInsert,
  NewExpenseInsert,
} from "./types";
import { CURRENCIES, EXPENSE_CATEGORIES } from "./types";

const CurrencyConverter: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"converter" | "budget">(
    "converter"
  );
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<{ [budgetId: string]: Expense[] }>(
    {}
  );
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetDescription, setNewBudgetDescription] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetCurrency, setNewBudgetCurrency] = useState("USD");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState("monthly");

  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("Other");
  const [newExpenseDate, setNewExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // initial load effect placed after callbacks (moved below)

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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchExchangeRates = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/get-exchange-rates?base=USD`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch exchange rates");

      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      const fallbackRates: ExchangeRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
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
        KRW: 1308.5,
        BRL: 4.97,
        ZAR: 18.65,
        RUB: 92.5,
        TRY: 32.15,
        THB: 35.2,
        PLN: 3.98,
        AED: 3.67,
        SAR: 3.75,
      };
      setExchangeRates(fallbackRates);
    }
  };

  const fetchExpenses = useCallback(async (budgetId: string) => {
    try {
      const { data, error } = await supabase
        .from("budget_expenses")
        .select("*")
        .eq("budget_id", budgetId)
        .order("date", { ascending: false });

      if (error) throw error;
      const typedExpenses = (data || []) as Expense[];
      setExpenses((prev) => ({ ...prev, [budgetId]: typedExpenses }));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const typedBudgets = (data || []) as Budget[];
      setBudgets(typedBudgets);

      for (const budget of typedBudgets) {
        await fetchExpenses(budget.id);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }, [fetchExpenses]);

  useEffect(() => {
    initUser();
    fetchExchangeRates();
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newBudgetName.trim() || !newBudgetAmount) return;

    try {
      const newBudget: NewBudgetInsert = {
        user_id: userId,
        name: newBudgetName,
        description: newBudgetDescription || null,
        currency: newBudgetCurrency,
        total_amount: parseFloat(newBudgetAmount),
        period: newBudgetPeriod,
        start_date: new Date().toISOString().split("T")[0],
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from("budgets").insert(newBudget as any);

      if (error) throw error;

      await fetchBudgets();
      setShowBudgetModal(false);
      setNewBudgetName("");
      setNewBudgetDescription("");
      setNewBudgetAmount("");
      setNewBudgetCurrency("USD");
      setNewBudgetPeriod("monthly");
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !userId ||
      !selectedBudget ||
      !newExpenseDescription.trim() ||
      !newExpenseAmount
    )
      return;

    try {
      const newExpense: NewExpenseInsert = {
        budget_id: selectedBudget.id,
        user_id: userId,
        description: newExpenseDescription,
        amount: parseFloat(newExpenseAmount),
        category: newExpenseCategory,
        date: newExpenseDate,
      };

      const { error } = await supabase
        .from("budget_expenses")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(newExpense as any);

      if (error) throw error;

      await fetchExpenses(selectedBudget.id);
      setNewExpenseDescription("");
      setNewExpenseAmount("");
      setNewExpenseCategory("Other");
      setNewExpenseDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (expenseId: string, budgetId: string) => {
    if (!confirm("Delete this expense?")) return;

    try {
      const { error } = await supabase
        .from("budget_expenses")
        .delete()
        .eq("id", expenseId);

      if (error) throw error;
      await fetchExpenses(budgetId);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Delete this budget and all its expenses?")) return;

    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", budgetId);

      if (error) throw error;
      await fetchBudgets();
      if (selectedBudget?.id === budgetId) {
        setShowExpenseModal(false);
        setSelectedBudget(null);
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const getTotalSpent = (budgetId: string) => {
    const budgetExpenses = expenses[budgetId] || [];
    return budgetExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount.toString()),
      0
    );
  };

  const getProgress = (budget: Budget) => {
    const spent = getTotalSpent(budget.id);
    return Math.min(
      (spent / parseFloat(budget.total_amount.toString())) * 100,
      100
    );
  };

  const getCurrencySymbol = (code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.symbol || code;
  };

  return (
    <Container>
      <Header>
        <Title theme={theme}>Currency & Budget</Title>
        <Subtitle theme={theme}>
          Convert currencies and manage your budgets
        </Subtitle>
      </Header>

      <TabContainer theme={theme}>
        <Tab
          theme={theme}
          $active={activeTab === "converter"}
          onClick={() => setActiveTab("converter")}
        >
          💱 Currency Converter
        </Tab>
        <Tab
          theme={theme}
          $active={activeTab === "budget"}
          onClick={() => setActiveTab("budget")}
        >
          💰 Budget Calculator
        </Tab>
      </TabContainer>

      {activeTab === "converter" && (
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
                  {CURRENCIES.map((curr) => (
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
                  value={convertedAmount?.toFixed(2) || "0.00"}
                  readOnly
                />
                <Select
                  theme={theme}
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {CURRENCIES.map((curr) => (
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
                1 {fromCurrency} ={" "}
                {(
                  exchangeRates[toCurrency] / exchangeRates[fromCurrency]
                ).toFixed(4)}{" "}
                {toCurrency}
              </ResultRate>
            </ResultBox>
          )}
        </Section>
      )}

      {activeTab === "budget" && (
        <>
          <Section theme={theme}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <SectionTitle theme={theme}>Your Budgets</SectionTitle>
              <Button
                theme={theme}
                $variant="primary"
                onClick={() => setShowBudgetModal(true)}
              >
                + Create Budget
              </Button>
            </div>

            {budgets.length === 0 ? (
              <EmptyState>
                <EmptyIcon>💰</EmptyIcon>
                <EmptyText theme={theme}>
                  No budgets yet. Create your first budget to start tracking!
                </EmptyText>
              </EmptyState>
            ) : (
              <BudgetGrid>
                {budgets.map((budget) => {
                  const spent = getTotalSpent(budget.id);
                  const remaining =
                    parseFloat(budget.total_amount.toString()) - spent;
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
                        <BudgetPeriod theme={theme}>
                          {budget.period}
                        </BudgetPeriod>
                      </BudgetHeader>

                      <BudgetAmount theme={theme}>
                        {getCurrencySymbol(budget.currency)}{" "}
                        {parseFloat(budget.total_amount.toString()).toFixed(2)}
                      </BudgetAmount>
                      <BudgetRemaining theme={theme} $over={isOver}>
                        {isOver ? "Over by" : "Remaining"}:{" "}
                        {getCurrencySymbol(budget.currency)}{" "}
                        {Math.abs(remaining).toFixed(2)}
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
                <CloseButton
                  theme={theme}
                  onClick={() => setShowBudgetModal(false)}
                >
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
                    {CURRENCIES.map((curr) => (
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
                  <Button
                    theme={theme}
                    type="button"
                    $variant="secondary"
                    onClick={() => setShowBudgetModal(false)}
                  >
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
                <CloseButton
                  theme={theme}
                  onClick={() => setShowExpenseModal(false)}
                >
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
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
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
                {(expenses[selectedBudget.id] || []).map((expense) => (
                  <ExpenseItem key={expense.id} theme={theme}>
                    <ExpenseInfo>
                      <ExpenseDescription theme={theme}>
                        {expense.description}
                      </ExpenseDescription>
                      <ExpenseDetails theme={theme}>
                        {expense.category} •{" "}
                        {new Date(expense.date).toLocaleDateString()}
                      </ExpenseDetails>
                    </ExpenseInfo>
                    <ExpenseAmount theme={theme}>
                      {getCurrencySymbol(selectedBudget.currency)}{" "}
                      {parseFloat(expense.amount.toString()).toFixed(2)}
                    </ExpenseAmount>
                    <DeleteButton
                      theme={theme}
                      onClick={() =>
                        handleDeleteExpense(expense.id, selectedBudget.id)
                      }
                    >
                      ✕
                    </DeleteButton>
                  </ExpenseItem>
                ))}
              </ExpenseList>

              <ButtonGroup style={{ marginTop: "1.5rem" }}>
                <Button
                  theme={theme}
                  $variant="secondary"
                  onClick={() => handleDeleteBudget(selectedBudget.id)}
                >
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
