import React from "react";
import "./styles.css";
import { Card, Row } from "antd";
import Button from "../Button";

function Cards({
  income,
  expense,
  totalBalance,
  showExpensesModal,
  showIncomeModal,
  resetBalance, // Add this prop
}) {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card">
          <h2>Current Balance</h2>
          <p>৳ {totalBalance}</p>
          <Button 
            text="Reset Balance" 
            blue={true} 
            onClick={resetBalance} // Add onClick handler
          />
        </Card>

        <Card className="my-card">
          <h2>Total Income</h2>
          <p>৳ {income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>

        <Card className="my-card">
          <h2>Total Expenses</h2>
          <p>৳ {expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpensesModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards; // Make sure this export is present