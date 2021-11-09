import "../style.css";
import { useState } from "react";
import TransactionsLine from "../TransactionsRow";
import asc from "../../../assets/asc.svg";
import desc from "../../../assets/desc.svg";

function TransactionsFull({ transactions, getTransactions, putTransactions }) {
  const [dateOrder, setDateOrder] = useState(1);
  const [dayOrder, setDayOrder] = useState(0);
  const [valueOrder, setValueOrder] = useState(0);


  function handleDate() {
    dateOrder !== 2 ? setDateOrder(dateOrder + 1) : setDateOrder(1);
    dayOrder !== 0 && setDayOrder(0);
    valueOrder !== 0 && setValueOrder(0);
    getOrder();
  }
  function handleDay() {
    dayOrder !== 2 ? setDayOrder(dayOrder + 1) : setDayOrder(1);
    setDateOrder(0);
    valueOrder !== 0 && setValueOrder(0);
    getOrder();
  }
  function handleValue() {
    valueOrder !== 2 ? setValueOrder(valueOrder + 1) : setValueOrder(1);
    dateOrder !== 0 && setDateOrder(0);
    dayOrder !== 0 && setDayOrder(0);
    getOrder();

  }
  function handleSrc(num) {
    if (num === 1) {
      return desc;
    }
    if (num === 2) {
      return asc;
    }
  }

  function getOrder() {
    if (dateOrder === 1) {
      putTransactions(transactions.sort((a, b) => new Date(a.date) - new Date(b.date)));
    }
    if (dateOrder === 2) {
      putTransactions(transactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    if (dayOrder === 1) {
      putTransactions(transactions.sort((a, b) => new Date(a.date).getDay() - new Date(b.date).getDay()))
      ;
    }
    if (dayOrder === 2) { 
      putTransactions(transactions.sort((a, b) => new Date(b.date).getDay() - new Date(a.date).getDay()))
    }
    if (valueOrder === 1) {
      putTransactions(transactions.sort((a, b) => a.value - b.value));
    }
    if (valueOrder === 2) {
      putTransactions(transactions.sort(((a, b) => b.value - a.value)));
    }
  }


  return (
    <div className="table">
      <div className="table-head">
        <span className="column-title">
          <h3 id="date" onClick={handleDate}>Data</h3>
          <img onClick={handleDate} src={handleSrc(dateOrder)} alt=""></img>
        </span>
        <span className="column-title">
          <h3 id="week-day" onClick={handleDay}>Dia da semana</h3>
          <img onClick={handleDay} src={handleSrc(dayOrder)} alt=""></img>
        </span>
        <span className="column-title">
          <h3>Descrição</h3>
        </span>
        <span className="column-title">
          <h3>Categoria</h3>
        </span>
        <span className="column-title">
          <h3 id="value" onClick={handleValue}>Valor</h3>
          <img onClick={handleValue} src={handleSrc(valueOrder)} alt=""></img>
        </span>
        <span className="column-title">

        </span>
      </div>
      <div className="table-body">
        {transactions.map((transaction) => {
          return (
            <TransactionsLine
              date={transaction.date}
              week_day={transaction.week_day}
              description={transaction.description}
              category={transaction.category}
              value={transaction.value}
              transactionId={transaction.id}
              transaction={transaction}
              getTransactions={getTransactions}
              transactionType={transaction.type}
            />
          );
        })}
      </div>
    </div>
  );
}


export default TransactionsFull;