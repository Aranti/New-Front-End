import * as React from 'react';
import { Table } from 'react-bootstrap';
import { DailyTableProps } from './DailyTableProps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';

export const DailyTable = (props: DailyTableProps) => {
    const { item, getLevelColor, getBlockInfo } = props;

    const splitStr = (test) => {
        let words = test.split("/##/");
        return words.map((word) => {
            return <p>{word}</p>;
        });
    }

    const getIndividualWidth = (Name) => {
        if(Name == "name") {
            return "200px";
        }
        else {
            return "100px";
        }
    }

    if(item.data !== undefined && item.data.length !== 0) {
        return(
            <React.Fragment>
                <h3>{item.name}</h3>
                {item.data.map((sub) => (
                    <React.Fragment>
                        {item.name.toLowerCase() !== sub.name.toLowerCase() && (
                        <strong style={{ color: getLevelColor(sub) }}>{sub.name}</strong>
                        )}
                        <Table
                            bordered
                            style={{
                                width: "100%",
                                // wordBreak: "break-all",
                                overflowX: "auto",
                                marginTop: "10px",
                                wordWrap:"break-word",
                                tableLayout: "fixed",
                            }}
                        >
                            <thead>
                                <tr>
                                {sub.columns.map((column) => (
                                    <th
                                    style={{
                                        // whiteSpace: "nowrap",
                                        backgroundColor: "aliceblue",
                                        fontSize: "12px",
                                        wordWrap: "break-word",
                                        width: getIndividualWidth(column)
                                    }}
                                    >
                                    {column.toUpperCase()}
                                    </th>
                                ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sub.rows.map((row) => {
                                    return (
                                        <tr>
                                        {
                                            Object.keys(row).map(function (key, index) {
                                                if (key=="name"){
                                                    if (row["blocks"] && row["blocks"].length!==0)
                                                    { 
                                                        return (
                                                            <td style={{
                                                                // whiteSpace: "nowrap",
                                                                color: getLevelColor(row),
                                                            }}>
                                                                {row["name"]}    
                                                            
                                                                <FontAwesomeIcon
                                                                icon={faPoll}
                                                                style={{ float:"right" , color: getLevelColor(row)}}
                                                                onClick={()=>getBlockInfo(row["name"],row["blocks"])}
                                                                />
                                                            </td>
                                                        )
                                                    }
                                                    else if (row["blocks"].length===0)
                                                    { 
                                                        return (
                                                            <td style={{
                                                                // whiteSpace: "nowrap",
                                                                color: getLevelColor(row),
                                                            }}> {row["name"]}</td>
                                                        )
                                                    }
                                                
                                                }
                                                if (
                                                    key !== "status" &&
                                                    key !== "affected_attributes" &&
                                                    key !== "identifier" &&
                                                    key !== "units" &&
                                                    key !== "date" &&
                                                    key !=="name"&&
                                                    key !=="blocks"&&
                                                    key !=="reported_norm"&&
                                                    key !=="expected_norm"&&
                                                    key !=="name_short"&&
                                                    row[key] !== null
                                                ) {
                                                
                                                    return (
                                                        <td
                                                            style={{
                                                                // whiteSpace: "nowrap",
                                                                color: getLevelColor(row),
                                                            }}
                                                        >
                                                            {(key == "expected" ||
                                                                key == "reported" ||
                                                                key == "api_data" ||
                                                                key == "constant") &&
                                                            row[key]
                                                                ? `${row[key]} ${row["units"]}`
                                                                : (key == "cause" || key == "probability") &&
                                                                row[key].includes("##")
                                                                ? row[key].split("##").map((word) => {
                                                                    return (
                                                                    <p style={{ marginBottom: "10px" }}>
                                                                        {" "}
                                                                        {word}
                                                                    </p>
                                                                    );
                                                                })
                                                                : row[key]}
                                                        <div
                                                            style={{
                                                            fontWeight: "bold",
                                                            marginTop: "15px",
                                                            float: "right",
                                                            }}
                                                        >
                                                            {row.status == 1 && index === 0
                                                            ? row.affected_attributes !== undefined
                                                                ? row.affected_attributes.name
                                                                : ""
                                                            : ""}
                                                        </div>
                                                        </td>
                                                    );
                                                }
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </React.Fragment>
                ))}
            </React.Fragment>
        )
    }
    else if (item.rows !== undefined && item.rows.length !== 0) {
        return (
          <React.Fragment>
            <h3>{item.name}</h3>
            <Table
              bordered
              style={
                {
                  // tableLayout: "fixed",
                  // wordBreak: "break-all",
                }
              }
            >
              <thead>
                <tr>
                  {item.columns.map((column) => (
                    <th
                      style={{
                        // whiteSpace: "nowrap",
                        backgroundColor: "aliceblue",
                        fontSize: "12px",
                      }}
                      key={item.name}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row) => {
                  return (
                    <tr>
                      <React.Fragment>
                        {Object.keys(row).map(function (key, index) {
                          if (key !== "status") {
                            return (
                              <td
                                style={{
                                  // whiteSpace: "nowrap",
                                  color: getLevelColor(row),
                                  overflow: "hidden",
                                }}
                              >
                                {(key == "expected" ||
                                  key == "reported" ||
                                  key == "api_data" ||
                                  key == "constant") &&
                                row[key]
                                  ? `${row[key]} ${row["units"]}`
                                  : row[key]}
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    marginTop: "15px",
                                    float: "right",
                                  }}
                                >
                                  {row.status == 1
                                    ? row.affected_attributes !== undefined
                                      ? row.affected_attributes.name
                                      : ""
                                    : ""}
                                </div>
                              </td>
                            );
                          }
                        })}
                      </React.Fragment>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </React.Fragment>
        );
    }
    else {
        return (
          <React.Fragment>
            <h3>{item.name}</h3>
            <div style={{ padding: "0 0 10px 5px" }}>No Data Found!!</div>
          </React.Fragment>
        );
    }

}