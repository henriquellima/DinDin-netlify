import { useState, useEffect } from "react";
import Resume from "./componentes/Resume";
import ModalPost from "./componentes/Modals/ModalPost";
import TransactionsFull from "./componentes/Transactions/TransactionsFull/index";
import Filter from "./componentes/Filter/index";
import Header from "./componentes/Header/index";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    getTransactions();
  }, []);

  function openCloseAddModal() {
    setAddModal(!addModal);
  }

  function putTransactions(array) {
    setLoading(true);
    setTransactions(array.sort((a, b) => new Date(a.date) - new Date(b.date)));
    setLoading(false);
  }

  function putTransactionsNoOrder(array) {
    setTransactions(array);
  }

  async function getTransactions() {
    setLoading(true);
    let transactions = await fetch("https://dindin-app-api.herokuapp.com/transactions");

    setTransactions(
      (await transactions.json()).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    );

    setLoading(false);
  }

  return (
    <div className="App">
      <Header />

      {addModal && (
        <ModalPost
          getTransactions={getTransactions}
          closeModal={openCloseAddModal}
        />
      )}

      <main>
        <div className="filterTable">
          <Filter
            transactions={transactions}
            putTransactions={(array) => putTransactions(array)}
            getTransactions={getTransactions}
          />

          {!loading && (
            <TransactionsFull
              transactions={transactions}
              getTransactions={getTransactions}
              putTransactions={(array) => putTransactionsNoOrder(array)}
            />
          )}
        </div>

        {!loading && (
          <Resume
            transactions={transactions}
            modal={openCloseAddModal}
          />
        )}
      </main>
    </div>
  );
}

export default App;
