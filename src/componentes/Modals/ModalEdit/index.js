import { useState } from "react";
import "../style.css";
import close from "../../../assets/close-modal.svg";
import InputMask from 'react-input-mask'
import IntlCurrencyInput from "react-intl-currency-input"

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

function toBrazilFormat(date) {
  const cutedDate = date.substring(0, 10);
  const arrayDate = cutedDate.split("-");
  const formatedDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;
  return formatedDate;
}

function ModalEdit({
  getTransactions,
  transactionId,
  transaction,
  openCloseModal
}) {
  const brazilianDate = toBrazilFormat(transaction.date);
  const [currentTransaction, setCurrentTransaction] = useState({
    value: transaction.value/100,
    category: transaction.category,
    date: brazilianDate,
    description: transaction.description,
    type: transaction.type
  });

  const [transactionOption, setTransactionOption] = useState(currentTransaction.type);
  function changeOption({ target }) {
    if (transactionOption === target.name) return;
    setTransactionOption(target.name);
  }

  function handleChange({ target }) {
    console.log(target.value)
    console.log(target)
    setCurrentTransaction({ ...currentTransaction, [target.id]: target.value });
  }

  function handleValueChange(event, value) {
    setCurrentTransaction({ ...currentTransaction, [event.target.id]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const dateArray = currentTransaction.date.split("/");

    const formatedDate = new Date(
      `${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`
    );

    const dayName = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    const getWeek_day = dayName[formatedDate.getDay()];

    const data = {
      ...currentTransaction,
      category: currentTransaction.category[0].toUpperCase() + currentTransaction.category.substr(1).toLowerCase(),
      value: Number(currentTransaction.value*100),
      date: formatedDate,
      week_day: getWeek_day,
      type: transactionOption === "debit" ? "debit" : "credit",
    };

    await fetch(
      `http://localhost:3333/transactions/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/JSON",
        },
        body: JSON.stringify(data),
      }
    );
    setCurrentTransaction({});
    getTransactions();
    openCloseModal();
  }

  return (
    <div className="backdrop">
      <div className="modal-container">

        <div className="modal-title">
          <h2>Editar Registro</h2>
          <img
            src={close}
            alt=""
            className="close-icon"
            onClick={openCloseModal}
          />
        </div>

        <div className="debit-credit-btns">
          <button
            className={`credit-button ${transactionOption === 'credit' ? '' : 'inactive'}`}
            name="credit"
            onClick={changeOption}
          >
            Entrada
          </button>

          <button
            className={`debit-button ${transactionOption === 'debit' ? '' : 'inactive'}`}
            name="debit"
            onClick={changeOption}
          >
            Saída
          </button>
        </div>


        <form className="formEdit" onSubmit={handleSubmit}>
          <div className="info">
            <label htmlFor="value">Valor</label>
            <IntlCurrencyInput currency="BRL"
             config={currencyConfig}
             onChange={(event, value, maskedValue) => handleValueChange(event, value, maskedValue)}
             id='value'
             value={currentTransaction.value }
              />
          </div>

          <div className="info">
            <label htmlFor="category">Categoria</label>
            <input
              required
              onChange={handleChange}
              type="text"
              value={currentTransaction.category || ""}
              id="category"
              name="category"
            />
          </div>

          <div className="info">
            <label htmlFor="date">Data</label>
            <InputMask
              required
              mask="99/99/9999"
              onChange={handleChange}
              type="text"
              value={currentTransaction.date || ""}
              id="date"
              name="date"
            />
          </div>

          <div className="info">
            <label htmlFor="description">Descrição</label>
            <input
              required
              onChange={handleChange}
              type="text"
              value={currentTransaction.description || ""}
              id="description"
              name="description"
            />
          </div>

          <button type="submit">Confirmar</button>
        </form>
      </div>
    </div>
  )
}

export default ModalEdit;