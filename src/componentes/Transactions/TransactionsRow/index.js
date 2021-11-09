import edit from "../../../assets/edit.svg";
import trash from "../../../assets/trash.svg";
import arrow from "../../../assets/arrow.svg";
import { useState } from "react";

import ModalEdit from "../../Modals/ModalEdit";

function DeleteModalCountainer(props) {
  return (
    <div>
      <img className="arrow" src={arrow} alt="" />
      <span className="container-confirm-delete">
        Apagar item?
        <div className="btn-actions-confirm-delete">
          <button
            className="btn-action-confirm"
            onClick={() => props.deleteRow(props.transactionId)}
          >
            Sim
          </button>
          <button className="btn-action-delete" onClick={props.openCloseModal}>
            Não
          </button>
        </div>
      </span>
    </div>
  );
}

function TransactionsLine(props) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  function toBrazilFormat(date) {
    const cutedDate = date.substring(0, 10);
    const arrayDate = cutedDate.split("-");
    const formatedDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;
    return formatedDate;
  }

  function openCloseModalDelete() {
    setDeleteModal(!deleteModal);
  }

  function openCloseModalEdit() {
    setEditModal(!editModal);
  }

  async function deleteRow(transactionID) {
    await fetch(`http://localhost:3333/transactions/${transactionID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    props.getTransactions();
    openCloseModalDelete();
  }

  return (
    <div className="table-line">
      <span className="line-items">{toBrazilFormat(props.date)}</span>
      <span className="line-items">{props.week_day}</span>
      <span className="line-items">{props.description}</span>
      <span className="line-items">{props.category}</span>
      <span className={`line-items ${props.transaction.type}`}>
        {props.transactionType === "credit"
          ? (props.value / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : `-${(props.value / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}`}
      </span>
      <span className="line-items flex-row">
        <img
          className="edit-icon"
          onClick={openCloseModalEdit}
          src={edit}
          alt="edit"
        />

        <div className='div-delete-icon'>
          <img
            className="delete-icon"
            onClick={openCloseModalDelete}
            src={trash}
            alt="trash"
          />
          {deleteModal && (
            <DeleteModalCountainer
              openCloseModal={openCloseModalDelete}
              deleteRow={deleteRow}
              transactionId={props.transactionId}
            />
          )}
        </div>
      </span>
      {editModal && (
        <ModalEdit
          openCloseModal={openCloseModalEdit}
          transactionId={props.transactionId}
          getTransactions={props.getTransactions}
          transaction={props.transaction}
        ></ModalEdit>
      )}
    </div>
  );
}

export default TransactionsLine;
