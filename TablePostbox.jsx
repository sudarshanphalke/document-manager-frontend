import React, { useState, useEffect } from 'react';
import {baseURL} from "./config";
//create fetch api function to get data from api
const fetchTableData = () => {
  return fetch(`${baseURL}/documents`)
    .then((response) => response.json())
};

export default function TablePostbox() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [tabledocs, setTabledocs] = useState([]);

  useEffect(() => {
    fetchTableData().then((data) => {
      setTabledocs(data.documents);
    });
  }, []);

  //create

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(tabledocs.map((row) => row.documentIdentifier));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (event, documentIdentifier) => {
    const selectedIndex = selectedRows.indexOf(documentIdentifier);
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = newSelectedRows.concat(selectedRows, documentIdentifier);
    } else if (selectedIndex === 0) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRows = newSelectedRows.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelectedRows);
  };

  //download file from api on click of download icon in table
  const downloadFile = (documentname) => {
    fetch(`${baseURL}document/download/${documentname}`)
    .then((response) => response.blob())
    .then((blob) => {
      let url = URL.createObjectURL(blob);
      let a  = document.createElement('a');
      a.href = url;
      a.download = documentname;
      a.click();
    });
  };

  const viewPdf = (documentname) => {
    fetch(`${baseURL}document/${documentname}`)
    .then((response) => response.json())
    .then((respJson) => {
      //error handling logic
      viewPdfFromBase64(respJson.pdfEncoded, "application/pdf")
    })
  }

  //wite function downloadPdfFromBase64
  function viewPdfFromBase64(base64String, fileName) {
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }


  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" checked={selectedRows.length === tabledocs.length} onChange={handleSelectAll} />
            <strong>Select All Document</strong>
            <p></p>
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tabledocs.map((row) => (
          <tr key={row.documentIdentifier}>
            <td>
              <div style={{display:"flex"}}>
                <input type="checkbox" checked={selectedRows.indexOf(row.documentIdentifier) !== -1} onChange={(event) => handleSelectRow(event, row.documentIdentifier)} />
                <div>
                  <strong onClick={()=>viewPdf(row.documentName)}>{row.documentTitle}</strong>
                  <p>{row.documentSubtitle}</p>
                </div>
              </div>
            </td>
            <td>{row.documentCreationDate}</td>
            <td className="table-action-col">
              {row.documentStatus ? (<button><i className="fa fa-envelope-open-o"></i></button>) : (<button><i className="fa fa-envelope"></i></button>)}
              <button onClick={()=>downloadFile(row.documentName)}><i className="fa fa-download"></i></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}






