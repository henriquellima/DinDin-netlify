import { useEffect, useState } from "react";
import filterSRC from "../../assets/filter.svg";
import add from "../../assets/plus.svg";
import remove from "../../assets/close.svg";
import "./style.css";
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

function CategoriesChips({ transaction, filterStatus, setFilterStatus }) {
  function handleChangeCategories() {
    if (!filterStatus.categories.includes(transaction.category)) {
      setFilterStatus({
        ...filterStatus,
        categories: [transaction.category, ...filterStatus.categories],
      });
    } else {
      const arrayFiltred = filterStatus.categories.filter(
        (category) => category !== transaction.category
      );
      setFilterStatus({ ...filterStatus, categories: arrayFiltred });
    }
  }
  return (
    <button
      style={{
        backgroundColor: filterStatus.categories.includes(transaction.category)
          ? "#7B61FF"
          : "#FAFAFA",
      }}
      onClick={handleChangeCategories}
      className="container-chip"
      value={transaction.category}
    >
      {transaction.category}
      <img
        className="icon-filter"
        src={
          filterStatus.categories.includes(transaction.category) ? remove : add
        }
        alt=""
      />
    </button>
  );
}

function WeekDaysChips({ week_day, filterStatus, setFilterStatus }) {
  function handleChangeWeekDays() {
    if (!filterStatus.week_days.includes(week_day)) {
      setFilterStatus({
        ...filterStatus,
        week_days: [week_day, ...filterStatus.week_days],
      });
    } else {
      const arrayFiltred = filterStatus.week_days.filter(
        (day) => day !== week_day
      );
      setFilterStatus({ ...filterStatus, week_days: arrayFiltred });
    }
  }
  return (
    <button
      style={{
        backgroundColor: filterStatus.week_days.includes(week_day)
          ? "#7B61FF"
          : "#FAFAFA",
      }}
      onClick={handleChangeWeekDays}
      className="container-chip"
    >
      {week_day}{" "}
      <img
        className="icon-filter"
        src={filterStatus.week_days.includes(week_day) ? remove : add}
        alt=""
      />
    </button>
  );
}

function Filter({ transactions, putTransactions }) {
  const [showFilter, setShowFilter] = useState(false);
  const [week_days_array] = useState([
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ]);
  const [noFilterTransactions, setNoFilterTransactions] = useState([]);
  const [filterStatus, setFilterStatus] = useState({
    week_days: [],
    max: 0,
    min: 0,
    categories: [],
  });

  const arrayCategories = noFilterTransactions.filter(function (a) {
    return (
      !this[JSON.stringify(a.category)] &&
      (this[JSON.stringify(a.category)] = true)
    );
  }, Object.create(null));

  arrayCategories.sort((a, b) => a.category.localeCompare(b.category));

  function handleChangeMinMax(event, value) {
    setFilterStatus({
      ...filterStatus,
      [event.target.id]: Number(value),
    });
  }

  //----FILTER-----
  async function getNoFilterTransactions() {
    setNoFilterTransactions(
      await (await fetch("https://dindin-app-api.herokuapp.com/transactions")).json()
    );
  }

  useEffect(() => {
    getNoFilterTransactions();
  }, [transactions]);

  function applyFilter() {
    let transactionsFiltred = [...noFilterTransactions];

    if (filterStatus.max)
      transactionsFiltred = transactionsFiltred.filter(
        (transaction) => transaction.value <= filterStatus.max*100
      );
    if (filterStatus.min)
      transactionsFiltred = transactionsFiltred.filter(
        (transaction) => transaction.value >= filterStatus.min*100
      );

    if (filterStatus.categories.length !== 0) {
      transactionsFiltred = transactionsFiltred.filter((transaction) =>
        filterStatus.categories.includes(transaction.category)
      );
    }

    if (filterStatus.week_days.length !== 0) {
      transactionsFiltred = transactionsFiltred.filter((transaction) =>
        filterStatus.week_days.includes(transaction.week_day)
      );
    }

    putTransactions(transactionsFiltred);
  }

  function clearFilter() {
    putTransactions(noFilterTransactions);
    setFilterStatus({
      week_days: [],
      max: 0,
      min: 0,
      categories: [],
    });
  }

  return (
    <div>
      <button
        className="open-filters-button"
        onClick={() => {
          setShowFilter(!showFilter);
        }}
      >
        <img src={filterSRC} alt="filter" /> Filtrar
      </button>

      {showFilter && (
        <div className="container-filters">
          <span className="blocks">
            <h2>Dias da Semana</h2>
            <div className="all-chips">
              {week_days_array.map((day) => {
                return (
                  <WeekDaysChips
                    week_day={day}
                    setFilterStatus={setFilterStatus}
                    filterStatus={filterStatus}
                  />
                );
              })}
            </div>
          </span>
          <span className="blocks">
            <h2>Categoria</h2>
            <div className="all-chips">
              {arrayCategories.map((transaction) => {
                return (
                  <CategoriesChips
                    transaction={transaction}
                    setFilterStatus={setFilterStatus}
                    filterStatus={filterStatus}
                  />
                );
              })}
            </div>
          </span>
          <span className="blocks">
            <h2>Valor</h2>
            <div>
              <label htmlFor="min-value">Min</label>
              <IntlCurrencyInput currency="BRL"
             config={currencyConfig}
             onChange={(event, value, maskedValue) => handleChangeMinMax(event, value)}
             id='min'
             value={filterStatus.min}
              />
            </div>
            <div>
              <label htmlFor="max-value">Max</label>
              <IntlCurrencyInput currency="BRL"
             config={currencyConfig}
             onChange={(event, value, maskedValue) => handleChangeMinMax(event, value)}
             id='max'
             value={filterStatus.max}
              />
            </div>
          </span>

          <span className="btns-clear-apply">
            <button className="btn-clear-filters" onClick={clearFilter}>
              Limpar Filtros
            </button>
            <button className="btn-apply-filters" onClick={applyFilter}>
              Aplicar Filtros
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export default Filter;
