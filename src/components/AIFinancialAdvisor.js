import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Typography,
  Spin,
  Alert,
  Tag,
  Divider,
  Row,
  Col,
  Progress,
  Tooltip,
  Button,
  Tabs,
  Steps,
  Statistic,
} from "antd";
import {
  BulbOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  BankOutlined,
  StarOutlined,
  LineChartOutlined,
  SafetyOutlined,
  DownloadOutlined,
  UpOutlined,
  DownOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import "./AIFinancialAdvisor.css"; // Import the CSS file

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const StrategyCard = ({
  item,
  index,
  expanded,
  onToggle,
  onMarkImplemented,
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f5222d";
      case "medium":
        return "#fa8c16";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "High Impact";
      case "medium":
        return "Medium Impact";
      case "low":
        return "Low Impact";
      default:
        return "General";
    }
  };

  return (
    <Card
      className={`strategy-card ${item.priority}`}
      hoverable
      actions={[
        <Button
          type="link"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={onToggle}
        >
          {expanded ? "Less Details" : "More Details"}
        </Button>,
        <Button
          type="primary"
          icon={<CheckOutlined />}
          onClick={() => onMarkImplemented(index)}
        >
          Mark as Implemented
        </Button>,
      ]}
    >
      <div className="strategy-card-content">
        <div className="strategy-meta">
          <Tag color={getPriorityColor(item.priority)} className="priority-tag">
            {getPriorityLabel(item.priority)}
          </Tag>
          <Text className="strategy-difficulty">
            <ClockCircleOutlined /> {item.timeToImplement || "2-4 weeks"}
          </Text>
          {item.potentialSavings > 0 && (
            <Text className="strategy-savings">
              <DollarOutlined /> Save ৳{item.potentialSavings.toLocaleString()}
              /mo
            </Text>
          )}
        </div>

        <Title level={5} className="strategy-title">
          {item.title}
        </Title>

        <Text className="strategy-description">{item.description}</Text>

        {expanded && (
          <div className="strategy-details">
            {item.actions && item.actions.length > 0 && (
              <div className="action-steps">
                <Divider orientation="left">Implementation Steps</Divider>
                <Steps direction="vertical" size="small">
                  {item.actions.map((action, i) => (
                    <Steps.Step
                      key={i}
                      title={`Step ${i + 1}`}
                      description={action}
                    />
                  ))}
                </Steps>
              </div>
            )}

            {item.resources && item.resources.length > 0 && (
              <div className="strategy-resources">
                <Divider orientation="left">Helpful Resources</Divider>
                <List
                  dataSource={item.resources}
                  renderItem={(resource) => (
                    <List.Item>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkOutlined /> {resource.title}
                      </a>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const AIFinancialAdvisor = ({
  income = 0,
  expenses = 0,
  transactions = [],
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState(null);
  const [implementedStrategies, setImplementedStrategies] = useState([]);

  useEffect(() => {
    const analyzeFinances = async () => {
      try {
        setLoading(true);
        // Mock analysis - replace with your actual API call
        const mockAnalysis = {
          savingsRate: 15,
          incomeChange: 5,
          expenseChange: -2,
          topCategories: [
            ["Housing", 25000],
            ["Food", 15000],
            ["Transportation", 8000],
            ["Entertainment", 5000],
          ],
          recommendations: [
            {
              title: "Reduce dining out expenses",
              description:
                "You're spending significantly on restaurants and takeout",
              priority: "high",
              timeToImplement: "1-2 weeks",
              potentialSavings: 4000,
              actions: [
                "Set a monthly dining out budget",
                "Meal prep on weekends",
                "Use cashback apps for groceries",
              ],
              resources: [
                { title: "Meal planning guide", url: "#" },
                { title: "Budget cooking recipes", url: "#" },
              ],
            },
            {
              title: "Refinance your housing loan",
              description:
                "Current rates are lower than when you took your loan",
              priority: "medium",
              timeToImplement: "3-4 weeks",
              potentialSavings: 2500,
              actions: [
                "Research current interest rates",
                "Contact 3 different lenders",
                "Compare refinancing options",
              ],
            },
            {
              title: "Build emergency fund",
              description: "You should have 3-6 months of expenses saved",
              priority: "low",
              timeToImplement: "Ongoing",
              actions: [
                "Open a high-yield savings account",
                "Set up automatic transfers",
                "Aim for ৳100,000 initial goal",
              ],
            },
          ],
        };
        setAnalysis(mockAnalysis);
      } catch (err) {
        setError(
          "Financial analysis unavailable. Please refresh or try again later."
        );
        console.error("Financial analysis error:", err);
      } finally {
        setLoading(false);
      }
    };

    analyzeFinances();
  }, [income, expenses, transactions]);

  const getHealthStatus = (savingsRate = 0) => {
    if (savingsRate >= 20)
      return {
        status: "Excellent",
        color: "#52c41a",
        icon: <ArrowUpOutlined />,
      };
    if (savingsRate >= 10)
      return { status: "Good", color: "#faad14", icon: <ArrowUpOutlined /> };
    return {
      status: "Critical",
      color: "#ff4d4f",
      icon: <ArrowDownOutlined />,
    };
  };

  const healthStatus = analysis
    ? getHealthStatus(analysis.savingsRate)
    : getHealthStatus(0);

  const getCategoryIcon = (category) => {
    switch ((category || "").toLowerCase()) {
      case "food":
        return <ShoppingOutlined />;
      case "housing":
        return <BankOutlined />;
      case "transportation":
        return <DollarOutlined />;
      case "entertainment":
        return <StarOutlined />;
      default:
        return <DollarOutlined />;
    }
  };

  const toggleRecommendation = (index) => {
    setExpandedRecommendation(expandedRecommendation === index ? null : index);
  };

  const markAsImplemented = (index) => {
    if (!analysis?.recommendations?.[index]) return;
    setImplementedStrategies([...implementedStrategies, index]);
  };

  const formattedRecommendations =
    analysis?.recommendations?.map((rec, index) => ({
      ...rec,
      implemented: implementedStrategies.includes(index),
    })) || [];

  const activeRecommendations = formattedRecommendations.filter(
    (r) => !r.implemented
  );

  return (
    <Card
      className="financial-dashboard-card"
      title={
        <div className="card-header">
          <PieChartOutlined className="header-icon" />
          <Title level={4} className="header-title">
            AI-Powered Financial Wellness Report
          </Title>
          <Tooltip title="This analysis provides personalized recommendations based on your financial data">
            <InfoCircleOutlined className="header-info-icon" />
          </Tooltip>
        </div>
      }
      bordered={false}
      extra={
        <Tag icon={<BulbOutlined />} color="gold">
          Smart Advisor
        </Tag>
      }
    >
      {error && (
        <Alert
          message="Analysis Error"
          description={error}
          type="error"
          showIcon
          className="alert-message"
          closable
          onClose={() => setError(null)}
        />
      )}

      {loading ? (
        <div className="loading-state">
          <Spin tip="Generating comprehensive analysis..." size="large" />
          <div className="loading-subtext">
            Analyzing {transactions.length} transactions...
          </div>
        </div>
      ) : analysis ? (
        <div className="dashboard-content">
          {/* Financial Overview Section */}
          <section className="financial-overview">
            <Text strong className="section-title">
              Financial Overview
            </Text>
            <Divider className="section-divider" />
            <Row gutter={16} className="metrics-row">
              <Col span={8} className="metric-card income-card">
                <div className="metric-header">
                  <DollarOutlined className="metric-icon" />
                  <Text className="metric-label">Monthly Income</Text>
                </div>
                <Title level={3} className="metric-value">
                  ৳{income.toLocaleString()}
                </Title>
                <Text className="metric-comparison">
                  {analysis.incomeChange >= 0 ? "+" : ""}
                  {analysis.incomeChange?.toFixed(1) || 0}% from last month
                </Text>
              </Col>
              <Col span={8} className="metric-card expenses-card">
                <div className="metric-header">
                  <ShoppingOutlined className="metric-icon" />
                  <Text className="metric-label">Monthly Expenses</Text>
                </div>
                <Title level={3} className="metric-value">
                  ৳{expenses.toLocaleString()}
                </Title>
                <Text className="metric-comparison">
                  {analysis.expenseChange >= 0 ? "+" : ""}
                  {analysis.expenseChange?.toFixed(1) || 0}% from last month
                </Text>
              </Col>
              <Col span={8} className="metric-card savings-card">
                <div className="metric-header">
                  <BankOutlined className="metric-icon" />
                  <Text className="metric-label">Savings Rate</Text>
                </div>
                <div className="savings-display">
                  <Title level={3} className="metric-value">
                    {analysis.savingsRate?.toFixed(1) || 0}%
                  </Title>
                  <Tag
                    icon={healthStatus.icon}
                    color={healthStatus.color}
                    className="health-tag"
                  >
                    {healthStatus.status}
                  </Tag>
                </div>
                <Progress
                  percent={analysis.savingsRate || 0}
                  showInfo={false}
                  strokeColor={healthStatus.color}
                  strokeWidth={10}
                  className="savings-progress"
                />
              </Col>
            </Row>
          </section>
          <section className="spending-analysis">
            <Text strong className="section-title">
              Expenditure Breakdown
            </Text>
            <Divider className="section-divider" />

            <Row gutter={[16, 16]} className="expenditure-overview">
              <Col span={24}>
                <Card className="expenditure-summary-card">
                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="expenditure-pie-chart">
                        <PieChartOutlined className="chart-icon" />
                        <div className="chart-labels">
                          {analysis.topCategories
                            .slice(0, 3)
                            .map(([category], i) => (
                              <Tag
                                color={["#1890ff", "#52c41a", "#faad14"][i]}
                                key={category}
                              >
                                {category}
                              </Tag>
                            ))}
                          {analysis.topCategories.length > 3 && (
                            <Tag>+{analysis.topCategories.length - 3} more</Tag>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Total Monthly Expenses"
                        value={expenses}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: "#ff4d4f" }}
                        suffix="BDT"
                      />
                      <div className="expenditure-comparison">
                        <Text>
                          {analysis.expenseChange >= 0 ? (
                            <ArrowUpOutlined style={{ color: "#ff4d4f" }} />
                          ) : (
                            <ArrowDownOutlined style={{ color: "#52c41a" }} />
                          )}{" "}
                          {Math.abs(analysis.expenseChange || 0)}% from last
                          month
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card className="category-details-card">
                  <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="By Amount" key="1">
                      <List
                        className="category-list"
                        dataSource={analysis.topCategories.sort(
                          (a, b) => b[1] - a[1]
                        )}
                        renderItem={([category, amount], index) => (
                          <List.Item className="category-item">
                            <div className="category-rank">
                              <Text strong>#{index + 1}</Text>
                            </div>
                            <div className="category-icon">
                              {getCategoryIcon(category)}
                            </div>
                            <div className="category-details">
                              <Text className="category-name">
                                {category || "Unknown"}
                              </Text>
                              <div className="category-values">
                                <Text className="category-amount">
                                  ৳{(amount || 0).toLocaleString()}
                                </Text>
                                <Text className="category-percentage">
                                  (
                                  {(((amount || 0) / expenses) * 100).toFixed(
                                    1
                                  )}
                                  %)
                                </Text>
                              </div>
                            </div>
                            <Progress
                              percent={((amount || 0) / expenses) * 100}
                              showInfo={false}
                              strokeColor={
                                [
                                  "#1890ff",
                                  "#52c41a",
                                  "#faad14",
                                  "#fadb14",
                                  "#fa8c16",
                                ][index % 5]
                              }
                              strokeWidth={8}
                              className="category-progress"
                            />
                          </List.Item>
                        )}
                      />
                    </TabPane>
                    <TabPane tab="By Trend" key="2">
                      <div className="trend-analysis">
                        <Text type="secondary">
                          <InfoCircleOutlined /> Monthly trend analysis coming
                          soon
                        </Text>
                      </div>
                    </TabPane>
                    <TabPane tab="Savings Potential" key="3">
                      <List
                        className="savings-potential-list"
                        dataSource={analysis.topCategories}
                        renderItem={([category, amount]) => {
                          const savingsPotential =
                            {
                              Housing: 0.15,
                              Food: 0.25,
                              Transportation: 0.2,
                              Entertainment: 0.35,
                              Utilities: 0.1,
                            }[category] || 0.15;

                          return (
                            <List.Item className="savings-potential-item">
                              <div className="category-icon">
                                {getCategoryIcon(category)}
                              </div>
                              <div className="category-details">
                                <Text className="category-name">
                                  {category}
                                </Text>
                                <Text
                                  type="secondary"
                                  className="potential-text"
                                >
                                  Potential to save ~
                                  {Math.round(savingsPotential * 100)}%
                                </Text>
                              </div>
                              <div className="potential-amount">
                                <Text strong>
                                  ৳
                                  {Math.round(
                                    amount * savingsPotential
                                  ).toLocaleString()}
                                </Text>
                                <Text type="secondary">/month</Text>
                              </div>
                            </List.Item>
                          );
                        }}
                      />
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="expenditure-insights">
              <Col span={24}>
                <Card
                  title={
                    <span>
                      <BulbOutlined className="glow-icon" /> Spending Insights
                    </span>
                  }
                  className="insights-card"
                >
                  <div className="insight-item">
                    <Text strong>Top Spending Category: </Text>
                    <Text>{analysis.topCategories[0]?.[0] || "N/A"}</Text>
                    <Text>
                      {" "}
                      (৳{analysis.topCategories[0]?.[1]?.toLocaleString() || 0})
                    </Text>
                  </div>
                  <div className="insight-item">
                    <Text strong>Highest Savings Potential: </Text>
                    <Text>Entertainment</Text>
                    <Text> (up to 35% reduction possible)</Text>
                  </div>
                  <div className="insight-item">
                    <Text strong>Most Stable Expense: </Text>
                    <Text>Utilities</Text>
                    <Text> (only 3% monthly variation)</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </section>
        </div>
      ) : (
        <div className="empty-state">
          <img src="/empty-finance.svg" alt="No data" className="empty-image" />
          <Text type="secondary" className="empty-text">
            No financial data available for analysis
          </Text>
          <Button type="primary" className="empty-action">
            Upload Financial Data
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AIFinancialAdvisor;
