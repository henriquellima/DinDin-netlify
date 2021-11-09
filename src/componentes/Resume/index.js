import "./style.css";

function Resume({ transactions, modal }) {
  const arrayInputs = transactions.filter((transaction) => transaction.type === "credit");
  const arrayOutputs = transactions.filter((transaction) => transaction.type === "debit");

  let totalInputs = 0;
  let totalOutputs = 0;

  if (arrayInputs.length > 0) {
    arrayInputs.length > 1
      ? arrayInputs.forEach((x) => (totalInputs += x.value))
      : (totalInputs = arrayInputs[0].value);
  }
  if (arrayOutputs.length > 0) {
    arrayOutputs.length > 1
      ? arrayOutputs.forEach((x) => (totalOutputs += x.value))
      : (totalOutputs = arrayOutputs[0].value);
  }

  return (
    <div className="resume">
      <div className="container-resume">
        <h3>Resumo</h3>
        <div className="container-resume-items">
          <span>Entradas</span>
          <strong className="in">
            {(totalInputs / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>
        <div className="container-resume-items">
          <span>Saídas</span>
          <strong className="out">
            {(totalOutputs / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>
        <div className="horizontal-line"></div>
        <div className="container-resume-items">
          <strong>Saldo</strong>
          <strong className="balance">
            {((totalInputs - totalOutputs) / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </div>
      </div>
      <button className="btn-add" onClick={modal}>
        Adicionar Registro
      </button>
    </div>
  );
}

export default Resume;