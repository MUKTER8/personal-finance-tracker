import React, { useState, useEffect } from 'react';
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
  Progress  // Added Progress import
} from 'antd';
import { BulbOutlined, PieChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { getFinancialAnalysis } from '../services/financeService';

const { Text, Title } = Typography;

const AIFinancialAdvisor = ({ income, expenses, transactions }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeFinances = async () => {
      try {
        setLoading(true);
        const result = await getFinancialAnalysis(income, expenses, transactions);
        setAnalysis(result);
      } catch (err) {
        setError('Financial analysis unavailable. Please refresh or try again later.');
        console.error('Financial analysis error:', err);
      } finally {
        setLoading(false);
      }
    };

    analyzeFinances();
  }, [income, expenses, transactions]);

  const getHealthStatus = (savingsRate) => {
    if (savingsRate >= 20) return { status: 'Excellent', color: '#52c41a', icon: <ArrowUpOutlined /> };
    if (savingsRate >= 10) return { status: 'Good', color: '#faad14', icon: <ArrowUpOutlined /> };
    return { status: 'Critical', color: '#ff4d4f', icon: <ArrowDownOutlined /> };
  };

  const healthStatus = analysis ? getHealthStatus(analysis.savingsRate) : null;

  return (
    <Card 
      className="financial-dashboard-card"
      title={
        <div className="card-header">
          <PieChartOutlined className="header-icon" />
          <Title level={4} className="header-title">
            Financial Wellness Report
          </Title>
        </div>
      }
      bordered={false}
    >
      {error && (
        <Alert 
          message="Analysis Error" 
          description={error} 
          type="error" 
          showIcon 
          className="alert-message"
          closable
        />
      )}
      
      {loading ? (
        <div className="loading-state">
          <Spin tip="Generating comprehensive analysis..." size="large" />
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
                <Text className="metric-label">Monthly Income</Text>
                <Title level={3} className="metric-value">
                  ৳{income.toLocaleString()}
                </Title>
              </Col>
              <Col span={8} className="metric-card expenses-card">
                <Text className="metric-label">Monthly Expenses</Text>
                <Title level={3} className="metric-value">
                  ৳{expenses.toLocaleString()}
                </Title>
              </Col>
              <Col span={8} className="metric-card savings-card">
                <Text className="metric-label">Savings Rate</Text>
                <div className="savings-display">
                  <Title level={3} className="metric-value">
                    {analysis.savingsRate.toFixed(1)}%
                  </Title>
                  <Tag 
                    icon={healthStatus.icon}
                    color={healthStatus.color}
                    className="health-tag"
                  >
                    {healthStatus.status}
                  </Tag>
                </div>
              </Col>
            </Row>
          </section>

          {/* Spending Analysis Section */}
          <section className="spending-analysis">
            <Text strong className="section-title">
              Expenditure Breakdown
            </Text>
            <Divider className="section-divider" />
            <List
              className="category-list"
              dataSource={analysis.topCategories}
              renderItem={([category, amount]) => (
                <List.Item className="category-item">
                  <div className="category-details">
                    <Text className="category-name">{category}</Text>
                    <div className="category-values">
                      <Text className="category-amount">
                        ৳{amount.toLocaleString()}
                      </Text>
                      <Text className="category-percentage">
                        ({(amount/expenses*100).toFixed(1)}%)
                      </Text>
                    </div>
                  </div>
                  <Progress 
                    percent={(amount/expenses*100)} 
                    showInfo={false} 
                    strokeColor="#1890ff"
                    className="category-progress"
                  />
                </List.Item>
              )}
            />
          </section>

          {/* Recommendations Section */}
          <section className="recommendations">
            <Text strong className="section-title">
              <BulbOutlined className="recommendation-icon" />
              Optimization Strategy
            </Text>
            <Divider className="section-divider" />
            <List
              className="recommendation-list"
              dataSource={analysis.recommendations}
              renderItem={(item, index) => (
                <List.Item className="recommendation-item">
                  <div className="recommendation-marker">{index + 1}</div>
                  <Text className="recommendation-text">{item}</Text>
                </List.Item>
              )}
            />
          </section>
        </div>
      ) : (
        <div className="empty-state">
          <Text type="secondary">No financial data available for analysis</Text>
        </div>
      )}

      <style jsx global>{`
        .financial-dashboard-card {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #f0f0f0;
        }
        
        .card-header {
          display: flex;
          align-items: center;
        }
        
        .header-icon {
          font-size: 20px;
          color: #1890ff;
          margin-right: 12px;
        }
        
        .header-title {
          margin: 0;
          font-weight: 500;
          color: #262626;
        }
        
        .alert-message {
          margin-bottom: 24px;
          border-radius: 8px;
        }
        
        .loading-state {
          padding: 40px 0;
          text-align: center;
        }
        
        .dashboard-content {
          padding: 8px;
        }
        
        .section-title {
          display: block;
          font-size: 16px;
          margin-bottom: 12px;
          color: #262626;
        }
        
        .section-divider {
          margin: 12px 0;
          background-color: #f0f0f0;
        }
        
        .metrics-row {
          margin-bottom: 8px;
        }
        
        .metric-card {
          background: #fff;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          height: 100%;
        }
        
        .income-card {
          border-top: 3px solid #52c41a;
        }
        
        .expenses-card {
          border-top: 3px solid #ff4d4f;
        }
        
        .savings-card {
          border-top: 3px solid #1890ff;
        }
        
        .metric-label {
          display: block;
          color: #8c8c8c;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .metric-value {
          margin: 0;
          color: #262626;
        }
        
        .savings-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .health-tag {
          border-radius: 4px;
          margin-left: 8px;
          font-weight: 500;
        }
        
        .category-list {
          border-radius: 8px;
        }
        
        .category-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .category-details {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 8px;
        }
        
        .category-name {
          font-weight: 500;
        }
        
        .category-values {
          display: flex;
        }
        
        .category-amount {
          margin-right: 8px;
        }
        
        .category-percentage {
          color: #8c8c8c;
        }
        
        .category-progress {
          margin-top: 4px;
        }
        
        .recommendation-icon {
          color: #faad14;
          margin-right: 8px;
        }
        
        .recommendation-list {
          background: #fafafa;
          border-radius: 8px;
          padding: 16px;
        }
        
        .recommendation-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .recommendation-item:last-child {
          border-bottom: none;
        }
        
        .recommendation-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #1890ff;
          color: white;
          border-radius: 50%;
          margin-right: 12px;
          font-weight: 500;
          font-size: 12px;
        }
        
        .recommendation-text {
          color: #595959;
        }
        
        .empty-state {
          padding: 40px 0;
          text-align: center;
          color: #bfbfbf;
        }
      `}</style>
    </Card>
  );
};

export default AIFinancialAdvisor;