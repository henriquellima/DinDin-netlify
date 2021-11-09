import InputMask from "react-input-mask";
import { useState } from "react";
import close from "../../../assets/close-modal.svg";
import "../style.css";
import IntlCurrencyInput from "react-intl-currency-input";

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

function ModalPost({ getTransactions, closeModal }) {
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [transactionOption, setTransactionOption] = useState("debit");

  function changeOption({ target }) {
    if (transactionOption === target.name) return;
    setTransactionOption(target.name);
  }

  function handleChange({ target }) {
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
      category:
        currentTransaction.category[0].toUpperCase() +
        currentTransaction.category.substr(1).toLowerCase(),
      value: Number(currentTransaction.value)*100,
      date: formatedDate,
      week_day: getWeek_day,
      type: transactionOption === "debit" ? "debit" : "credit",
    };

    await fetch("http://localhost:3333/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify(data),
    });

    setCurrentTransaction({});
    getTransactions();
    closeModal();
  }

  return (
    <div className="backdrop">
      <div className="modal-container">
        <div className="modal-title">
          <h2>Adicionar Registro</h2>
          <img src={close} alt="" className="close-icon" onClick={closeModal} />
        </div>

        <div className="debit-credit-btns">
          <button
            className={`credit-button ${
              transactionOption === "credit" ? "" : "inactive"
            }`}
            name="credit"
            onClick={changeOption}
          >
            Entrada
          </button>

          <button
            className={`debit-button ${
              transactionOption === "debit" ? "" : "inactive"
            }`}
            name="debit"
            onClick={changeOption}
          >
            Saída
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="info">
            <label htmlFor="value">Valor</label>
            <IntlCurrencyInput
              currency="BRL"
              config={currencyConfig}
              onChange={(event, value, maskedValue) =>
                handleValueChange(event, value, maskedValue)
              }
              id="value"
              value={currentTransaction.value}
            />
          </div>

          <div className="info">
            <label htmlFor="category">Categoria</label>
            <input
              required
              onChange={handleChange}
              type="text"
              id="category"
              name="category"
              value={currentTransaction.category || ""}
            />
          </div>

          <div className="info">
            <label htmlFor="date">Data</label>
            <InputMask
              required
              mask="99/99/9999"
              onChange={handleChange}
              type="text"
              id="date"
              name="date"
              value={currentTransaction.date || ""}
            />
          </div>

          <div className="info">
            <label htmlFor="description">Descrição</label>
            <input
              required
              onChange={handleChange}
              type="text"
              id="description"
              name="description"
              value={currentTransaction.description || ""}
            />
          </div>

          <button type="submit">Confirmar</button>
        </form>
      </div>
    </div>
  );
}

export default ModalPost;
