import React from 'react';
import { SpreadsheetComponent, SheetsDirective, RangesDirective, RangeDirective,
    SheetDirective, ColumnsDirective, ColumnDirective, RowsDirective, RowDirective,
    CellsDirective, CellDirective
 } from '@syncfusion/ej2-react-spreadsheet';
import loadeddata from './loadedCondition.json';
import ballastdata from './ballastCondition.json';
import fueldata from './fuelCons.json';
import HeaderComponent from '../HeaderComponent';
import { Button } from 'react-bootstrap';

class SpreadsheetForBallast extends React.Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = () => {
        let inputDict = {};
        let headers1 = [];
        let values1 = [];
        let headers2 = [];
        let values2 = [];
        let headers3 = [];
        let values3= [];
        this.spreadsheet1.saveAsJson()
        .then(response => {
            let sheets = response['jsonObject']['Workbook']['sheets'];
            
            // for(let sheet=0;sheet<sheets.length;sheet++) {
                Object.keys(sheets[0]).map(item => {
                    if('rows' === item) {
                        for(let row=0;row<sheets[0]['rows'].length;row++) {
                            if(row === 0) {
                                for(let cell=0;cell<sheets[0]['rows'][row]['cells'].length;cell++) {
                                    headers1.push(sheets[0]['rows'][row]['cells'][cell]['value']);
                                }
                            }
                            else {
                                for(let cell=0;cell<sheets[0]['rows'][row]['cells'].length;cell++) {
                                    values1.push(sheets[0]['rows'][row]['cells'][cell]['value']);
                                }
                            }
                        }
                    }
                    
                })

                Object.keys(sheets[1]).map(item => {
                    if('rows' === item) {
                        for(let row=0;row<sheets[1]['rows'].length;row++) {
                            if(row === 0) {
                                for(let cell=0;cell<sheets[1]['rows'][row]['cells'].length;cell++) {
                                    headers2.push(sheets[1]['rows'][row]['cells'][cell]['value']);
                                }
                            }
                            else {
                                for(let cell=0;cell<sheets[1]['rows'][row]['cells'].length;cell++) {
                                    values2.push(sheets[1]['rows'][row]['cells'][cell]['value']);
                                }
                            }
                        }
                    }
                    
                })

                Object.keys(sheets[2]).map(item => {
                    if('rows' === item) {
                        for(let row=0;row<sheets[2]['rows'].length;row++) {
                            if(row === 0) {
                                for(let cell=0;cell<sheets[2]['rows'][row]['cells'].length;cell++) {
                                    headers3.push(sheets[2]['rows'][row]['cells'][cell]['value']);
                                }
                            }
                            else {
                                for(let cell=0;cell<sheets[2]['rows'][row]['cells'].length;cell++) {
                                    values3.push(sheets[2]['rows'][row]['cells'][cell]['value']);
                                }
                            }
                        }
                    }
                    
                })
                
            // }
            

            for(let header=0;header<headers1.length;header++) {
                inputDict[headers1[header]] = []
            }
            for(let header=0;header<headers2.length;header++) {
                inputDict[headers2[header]] = []
            }
            for(let header=0;header<headers3.length;header++) {
                inputDict[headers3[header]] = []
            }

            let number_of_times_to_repeat_header_names1 = values1.length / headers1.length;
            let number_of_times_to_repeat_header_names2 = values2.length / headers2.length;
            let number_of_times_to_repeat_header_names3 = values3.length / headers3.length;

            let new_headers_list1=[];
            if(number_of_times_to_repeat_header_names1 === 1) {
                new_headers_list1 = headers1
            }
            else {
                for(let i=0;i<number_of_times_to_repeat_header_names1;i++) {
                    new_headers_list1.push(...headers1)
                }
            }
            let new_headers_list2=[];
            if(number_of_times_to_repeat_header_names2 === 1) {
                new_headers_list2 = headers2
            }
            else {
                for(let i=0;i<number_of_times_to_repeat_header_names2;i++) {
                    new_headers_list2.push(...headers2)
                }
            }
            let new_headers_list3=[];
            if(number_of_times_to_repeat_header_names3 === 1) {
                new_headers_list3 = headers3
            }
            else {
                for(let i=0;i<number_of_times_to_repeat_header_names3;i++) {
                    new_headers_list3.push(...headers3)
                }
            }

            for(let header=0;header<new_headers_list1.length;header++) {
                Object.keys(inputDict).map(head => {
                    if(head === new_headers_list1[header]) {
                        inputDict[head].push(values1[header])
                    }
                })
            }
            for(let header=0;header<new_headers_list2.length;header++) {
                Object.keys(inputDict).map(head => {
                    if(head === new_headers_list2[header]) {
                        inputDict[head].push(values2[header])
                    }
                })
            }
            for(let header=0;header<new_headers_list3.length;header++) {
                Object.keys(inputDict).map(head => {
                    if(head === new_headers_list3[header]) {
                        inputDict[head].push(values3[header])
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
                            <SheetDirective name={"Ballast Condition F.O.C"}>
                                <RangesDirective style={{overflowY: "initial"}}>
                                    <RangeDirective dataSource={ballastdata}></RangeDirective>
                                </RangesDirective>
                                <ColumnsDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                </ColumnsDirective>
                            </SheetDirective>
                            <SheetDirective name={"Loaded Condition F.O.C"}>
                                <RangesDirective style={{overflowY: "initial"}}>
                                    <RangeDirective dataSource={loadeddata}></RangeDirective>
                                </RangesDirective>
                                <ColumnsDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={100}></ColumnDirective>
                                </ColumnsDirective>
                            </SheetDirective>
                            <SheetDirective name={"Fuel Oil Consumption"}>
                                <RangesDirective style={{overflowY: "initial"}}>
                                    <RangeDirective dataSource={fueldata}></RangeDirective>
                                </RangesDirective>
                                <ColumnsDirective>
                                <ColumnDirective width={100}></ColumnDirective>
                                    <ColumnDirective width={130}></ColumnDirective>
                                    <ColumnDirective width={170}></ColumnDirective>
                                    <ColumnDirective width={120}></ColumnDirective>
                                    <ColumnDirective width={120}></ColumnDirective>
                                    <ColumnDirective width={120}></ColumnDirective>
                                    <ColumnDirective width={120}></ColumnDirective>
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

export default SpreadsheetForBallast;