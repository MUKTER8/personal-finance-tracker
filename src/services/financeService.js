// src/services/financeService.js

// 1. Define the mock recommendations generator first
const getMockRecommendations = (data) => {
  const savingsPercentage = ((data.income - data.expenses) / data.income * 100).toFixed(1);
  
  return [
    `1. Aim to save at least 20% of income (current: ${savingsPercentage}%)`,
    `2. Reduce ${data.topCategories?.[0]?.[0] || 'top category'} spending by 10-15%`,
    "3. Review recurring subscriptions and memberships"
  ];
};

// 2. Define the AI recommendation generator
const generateRecommendations = async (data) => {
  try {
    if (!process.env.REACT_APP_OPENAI_KEY) {
      return getMockRecommendations(data);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Provide 3 concise financial tips for Bangladesh in bullet points"
        }, {
          role: "user",
          content: `Income: ${data.income}, Expenses: ${data.expenses}, Top spending: ${JSON.stringify(data.topCategories)}`
        }],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    const result = await response.json();
    return result.choices[0]?.message?.content.split('\n').filter(Boolean);
  } catch (error) {
    console.error("AI recommendation failed:", error);
    return getMockRecommendations(data);
  }
};

// 3. Main analysis function (now these helpers are available)
export const getFinancialAnalysis = async (income, expenses, transactions) => {
  try {
    // Validate inputs
    if (typeof income !== 'number' || income <= 0) 
      throw new Error('Invalid income value');
    if (typeof expenses !== 'number' || expenses < 0)
      throw new Error('Invalid expenses value');
    if (!Array.isArray(transactions))
      throw new Error('Transactions must be an array');

    // Calculate basic metrics
    const savingsRate = ((income - expenses) / income) * 100;
    const monthlyExpenses = expenses / 12;

    // Process transactions
    const validTransactions = transactions.filter(t => 
      t?.type === 'expense' && 
      typeof t.amount === 'number' && 
      t.tag
    );

    // Calculate category spending
    const categorySpending = validTransactions.reduce((acc, tx) => {
      acc[tx.tag] = (acc[tx.tag] || 0) + tx.amount;
      return acc;
    }, {});

    const topCategories = Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Get recommendations (using the now-defined functions)
    const recommendations = await generateRecommendations({
      income,
      expenses,
      savingsRate,
      topCategories
    });

    return {
      savingsRate,
      monthlyExpenses,
      topCategories: topCategories.length ? topCategories : [['No expenses', 0]],
      recommendations: recommendations || getMockRecommendations({ income, expenses })
    };

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      savingsRate: 0,
      monthlyExpenses: expenses/12 || 0,
      topCategories: [['Error', 0]],
      recommendations: getMockRecommendations({ income, expenses })
    };
  }
};