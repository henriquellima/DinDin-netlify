import { useEffect, useState } from "react";
import filterSRC from "../../assets/filter.svg";
import add from "../../assets/plus.svg";
import remove from "../../assets/close.svg";
import "./style.css";

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

  function handleChangeValues({ target }) {
    setFilterStatus({
      ...filterStatus,
      [target.name]: Number(target.value),
    });
  }

  //----FILTER-----
  async function getNoFilterTransactions() {
    setNoFilterTransactions(
      await (await fetch("http://localhost:3333/transactions")).json()
    );
  }

  useEffect(() => {
    getNoFilterTransactions();
  }, [transactions]);

  function applyFilter() {
    console.log(noFilterTransactions);
    let transactionsFiltred = [...noFilterTransactions];

    if (filterStatus.max)
      transactionsFiltred = transactionsFiltred.filter(
        (transaction) => transaction.value <= filterStatus.max
      );
    if (filterStatus.min)
      transactionsFiltred = transactionsFiltred.filter(
        (transaction) => transaction.value >= filterStatus.min
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
              <input
                id="min-value"
                onChange={handleChangeValues}
                name="min"
                value={filterStatus.min || ""}
                type="number"
              ></input>
            </div>
            <div>
              <label htmlFor="max-value">Max</label>
              <input
                id="max-value"
                onChange={handleChangeValues}
                name="max"
                value={filterStatus.max || ""}
                type="number"
              ></input>
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
