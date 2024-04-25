import React from 'react';
import { SpreadsheetComponent, SheetsDirective, RangesDirective, RangeDirective,
    SheetDirective, ColumnsDirective, ColumnDirective, RowsDirective, RowDirective,
    CellsDirective, CellDirective
 } from '@syncfusion/ej2-react-spreadsheet';
import data from './loadedCondition.json'
import HeaderComponent from '../HeaderComponent';
import { Button } from 'react-bootstrap';

class SpreadsheetForLoaded extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = () => {
        let inputDict = {};
        let headers = [];
        let values = [];
        this.spreadsheet1.saveAsJson()
        .then(response => {
            let rows = response['jsonObject']['Workbook']['sheets'][0]['rows'];
            
            for(let row=0;row<rows.length;row++) {
                if(row === 0) {
                    for(let cell=0;cell<rows[row]['cells'].length;cell++) {
                        headers.push(rows[row]['cells'][cell]['value']);
                    }
                }
                else {
                    for(let cell=0;cell<rows[row]['cells'].length;cell++) {
                        values.push(rows[row]['cells'][cell]['value']);
                    }
                }
            }

            for(let header=0;header<headers.length;header++) {
                inputDict[headers[header]] = []
            }

            let number_of_times_to_repeat_header_names = values.length / headers.length;
            let new_headers_list=[];
            if(number_of_times_to_repeat_header_names === 1) {
                new_headers_list = headers
            }
            else {
                for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
                    new_headers_list.push(...headers)
                }
            }

            for(let header=0;header<new_headers_list.length;header++) {
                Object.keys(inputDict).map(head => {
                    if(head === new_headers_list[header]) {
                        inputDict[head].push(values[header])
                    }
                })
            }
            console.log(inputDict);

        })
    }

    render() {
        return (
            <>
                <HeaderComponent isOverview={false} />
                <div style={{marginLeft: "20px", marginRight: "20px", marginTop: "10px", overflowY: "initial"}}>
                    <SpreadsheetComponent style={{overflowY: "initial"}} ref={(ssObj) => { this.spreadsheet1 = ssObj; }} openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open' saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'>
                        <SheetsDirective>
                            <SheetDirective name={"Loaded Condition F.O.C"}>
                                <RangesDirective style={{overflowY: "initial"}}>
                                    <RangeDirective dataSource={data}></RangeDirective>
                                </RangesDirective>
                                <ColumnsDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                </ColumnsDirective>
                            </SheetDirective>
                        </SheetsDirective>
                    </SpreadsheetComponent>
                </div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5px"}}>
                    <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                </div>
            </>
        )
    }
}

export default SpreadsheetForLoaded;