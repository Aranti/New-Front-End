import React from 'react';
import { DataManager, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import { RangeDirective, ColumnsDirective, ColumnDirective, RowsDirective, RowDirective, CellsDirective, CellDirective } from '@syncfusion/ej2-react-spreadsheet';
import axios from 'axios';
import { connect } from 'react-redux';
import { setDailyInput, setDailyInputType, setSpreadsheetData, setSpreadsheetMetadata, setSpreadsheetNames, setSpreadsheetLoading, setSpreadsheetError } from '../../redux/ActionCreators';
import {baseUrl} from '../../shared/baseUrl';
import { Button } from 'reactstrap';
import { Row, Col } from 'react-bootstrap';
import '../../../public/CommonCss/style.css';
import SpreadsheetComponentCreator from './createSpreadsheetComponent';
import { Loading } from '../LoadingComponent';
import Header from '../HeaderComponent';

// let cancelToken = axios.CancelToken.source()

const urls = baseUrl + process.env.REACT_APP_SEND_BACKEND;
const excelurl = baseUrl + process.env.REACT_APP_GET_SPREADSHEET;
const excelputurl = baseUrl + process.env.REACT_APP_PUT_SPREADSHEET;

const mapStateToProps = state => {
    return {
        currentShip: state.currentShip,
        dailyInput: state.dailyInput,
        trends: state.trends,
        options: state.options
    }
}

const mapDispatchToProps = (dispatch) => ({
    setDailyInput: (input) => { dispatch(setDailyInput(input)) },
    setDailyInputType: (input) => { dispatch(setDailyInputType(input)) },
    setSpreadsheetData: (input) => { dispatch(setSpreadsheetData(input)) },
    setSpreadsheetMetadata: (input) => { dispatch(setSpreadsheetMetadata(input)) },
    setSpreadsheetNames: (input) => { dispatch(setSpreadsheetNames(input)) },
    setSpreadsheetLoading: (input) => { dispatch(setSpreadsheetLoading(input)) },
    setSpreadsheetError: (input) => { dispatch(setSpreadsheetError(input)) },
});

let cancelToken;

class Spreadsheet extends React.Component {
    constructor(props) {
        super(props);

        // this.cancelToken;

        // this.data = new DataManager({
            
        //     url: excelurl,
        //     crossDomain: true,
            
        //     adaptor: new WebApiAdaptor,
        //     // headers: [{
        //     //     "Authorization": {

        //     //     }
        //     // }]
        // })
        // console.log(this.data)
        this.state = {
            type: 'fuel',
            subtype: 'noon',
            noonRowCount: 0,
            data: null,
            metadata: null,
            sheetNames: null
        }

        this.onRadioChange = this.onRadioChange.bind(this);
        this.onNoonFuelUpload = this.onNoonFuelUpload.bind(this);
        this.onNoonEngineUpload = this.onNoonEngineUpload.bind(this);
        this.onLogsUpload = this.onLogsUpload.bind(this);
        this.getSpreadsheet = this.getSpreadsheet.bind(this);
        this.putSpreadsheet = this.putSpreadsheet.bind(this);
        this.showSpreadsheet = this.showSpreadsheet.bind(this);
        this.runGetSpreadsheet = this.runGetSpreadsheet.bind(this);
        // this.onCreated = this.onCreated.bind(this);
    }

    async componentDidMount() {
        cancelToken = axios.CancelToken.source();
        const daily_input_type = sessionStorage.getItem("daily_input_type");
        if(typeof daily_input_type !== typeof null) {
            this.props.setDailyInputType(daily_input_type)
        }
        // if(this.props.currentShip.currentShip !== null) {
        //     this.getSpreadsheet();
        // }
        // else {
        //     this.props.setSpreadsheetLoading(true);
        // }
        // this.setState({
        //     noonRowCount: this.spreadsheet1.getRowData(1)
        // })
        // console.log("NOON ROW COUNT!!!!",this.state.noonRowCount)
    }

    componentWillUnmount() {
        // if(this.cancelToken) {
            cancelToken.cancel('');
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props !== nextProps || this.state !== nextState) {
            return true;
        }
        else {
            return false;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dailyInput.daily_input_type !== this.props.dailyInput.daily_input_type) {
            // this.setState({
            //     type: this.props.dailyInput.dailyInput
            // });
            this.props.setSpreadsheetLoading(true);
            this.getSpreadsheet();
        }
        if(prevProps.dailyInput.daily_input !== this.props.dailyInput.daily_input) {
            this.props.setSpreadsheetLoading(true);
            this.getSpreadsheet();
        }
        if(prevProps.currentShip.currentShip !== this.props.currentShip.currentShip) {
            if(this.props.currentShip.currentShip['value'] === 9592301 || this.props.currentShip.currentShip['value'] === '9592301') {
                this.props.setDailyInput('logs')
            }
            else {
                this.props.setDailyInput('noon')
            }
            this.props.setSpreadsheetLoading(true);
            this.getSpreadsheet();
        }
        // if(prevProps.trends.ship_imo !== this.props.trends.ship_imo) {
        //     this.props.setSpreadsheetLoading(true);
        //     this.getSpreadsheet();
        // }
        // if(prevState.noonRowCount !== this.spreadsheet1.sheets[0].rows.length) {
        //     this.setState({
        //         noonRowCount: this.spreadsheet1.sheets[0].rows.length
        //     });
        //     console.log(this.state.noonRowCount);
        // }
        // if(prevState.data !== this.state.data) {
        //     this.onCreated();
        //     console.log(this.spreadsheet1.sheets[0].usedRange)
        // }
    }

    // onCreated() {
    //     console.log("ON CREATED!!!");
    //     // console.log(this.spreadsheet1.sheets[0].usedRange.colIndex)
    //     // console.log(this.state.data[0].length)
    //     // this.spreadsheet1.hideRow(0,0,true);
    // }

    getSpreadsheet = (how_many_days='7') => {
        this.setState({
            data: null,
            metadata: null,
            sheetNames: null
        });
        let resData;
        let metadata;
        let sheetNames;

        if(typeof cancelToken !== typeof undefined) {
            this.props.setSpreadsheetLoading(true);
        }

        // this.cancelToken = axios.CancelToken.source();

        let daily_input = sessionStorage.getItem('daily_input')
        let daily_input_type = sessionStorage.getItem('daily_input_type')
        const currentshipvalue = sessionStorage.getItem('currentshipvalue');
        const currentshiplabel = sessionStorage.getItem('currentshiplabel');
        console.log("DAILY INPUT", daily_input, "DAILY INPUT TYPE", daily_input_type)

        try{
            axios({
                method: 'get',
                url: excelurl,
                params: {
                  ship_imo: this.props.currentShip.currentShip['value'] && this.props.currentShip.currentShip['value'],
                  ship_name: this.props.currentShip.currentShip['label'] && this.props.currentShip.currentShip['label'],
                  type: this.props.dailyInput.daily_input_type && this.props.dailyInput.daily_input_type,
                  subtype: this.props.dailyInput.daily_input && this.props.dailyInput.daily_input,
                  how_many_days: how_many_days
                },
                // cancelToken: cancelToken.token
              })
              .then(response => {
                  // let json_response = JSON.parse(response.data)
                  // const res = json_response.filter(element => {
                  // if (Object.keys(element).length !== 0) {
                  //     return true;
                  // }
                  
                  // return false;
                  // });
                  // console.log("STATE DATA", this.state.data);
                  resData = response.data['Result'];
                  metadata = response.data['Metadata'];
                  sheetNames = response.data['Names'];
                  // console.log("DATA!!!!!!!!!", resData, metadata);
                  this.setState({
                      data: resData,
                      metadata: metadata,
                      sheetNames: sheetNames
                  });
                  this.props.setSpreadsheetNames(sheetNames);
                  this.props.setSpreadsheetData(resData);
                  this.props.setSpreadsheetMetadata(metadata);
                //   console.log("STATE DATA2", this.state.data);
              })
              .catch(error => {
                  console.log(error);
                  this.props.setSpreadsheetError(error);
              });
        }
        catch(error) {
            this.props.setSpreadsheetError(error);
        }
        

        // this.setState({
        //     data: resData,
        //     metadata: metadata
        // });
        // console.log("STATE DATA", this.state.data);
    }
    
    runGetSpreadsheet = () => {
        this.props.setSpreadsheetLoading(true);
        this.getSpreadsheet('365')
    }

    putSpreadsheet = () => {

        this.spreadsheet.saveAsJson()
        .then(Json => {
            axios({
                method: "post",
                url: excelputurl,
                data: JSON.stringify(Json['jsonObject']['Workbook']),
                params: {
                    type: this.props.dailyInput.daily_input_type,
                    subtype: this.props.dailyInput.daily_input,
                    ship_imo: this.props.currentShip.currentShip['value'],
                    ship_name: this.props.currentShip.currentShip['label'],
                }
            })
        })
        
        // if(this.props.dailyInput.daily_input === 'noon' && this.props.dailyInput.daily_input_type === 'fuel') {
        //     this.spreadsheet1.saveAsJson()
        //     .then(Json => {
        //         // let sheets = Json['jsonObject']['Workbook']['sheets']
        //         // let excelObject={};
        //         // let headers=[];
        //         // let values=[];
                
        //         // for(let sheet=0;sheet<sheets.length;sheet++) {
        //         //     Object.keys(sheets[sheet]).map(item => {
        //         //         if('rows' === item) {
        //         //             for(let row=0;row<3;row++) {
        //         //                 if(row === 0) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //                 else if(row > 0) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //             }
        //         //         }
        //         //     })
        //         // }
        //         // for(let header=0;header<headers.length;header++) {
        //         //     excelObject[headers[header]] = []
        //         // }

        //         // let number_of_times_to_repeat_header_names = values.length / headers.length;
        //         // let new_headers_list=[];
        //         // if(number_of_times_to_repeat_header_names === 1) {
        //         //     new_headers_list = headers
        //         // }
        //         // else {
        //         //     for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
        //         //         new_headers_list.push(...headers)
        //         //     }
        //         // }

        //         // for(let header=0;header<new_headers_list.length;header++) {
        //         //     Object.keys(excelObject).map(head => {
        //         //         if(head === new_headers_list[header]) {
        //         //             excelObject[head].push(values[header])
        //         //         }
        //         //     })
        //         // }
        //         // for(let key in excelObject) {
        //         //     if(key.includes("Unnamed") || key.includes('undefined')) {
        //         //         delete excelObject[key]
        //         //     }
        //         // }
        //         // console.log(headers, values, excelObject);
        //         // axios.post(excelputurl, excelObject, {
        //         //     params: {
        //         //         type: this.props.dailyInput.daily_input_type,
        //         //         subtype: this.props.dailyInput.daily_input,
        //         //         ship_imo: this.props.currentShip.currentShip['value'],
        //         //         ship_name: this.props.currentShip.currentShip['label'],
        //         //     }
        //         // })
        //         // .then(response => {
        //         //     console.log(response);
        //         // })
        //         axios({
        //             method: "post",
        //             url: excelputurl,
        //             data: JSON.stringify(Json['jsonObject']['Workbook']),
        //             params: {
        //                 type: this.props.dailyInput.daily_input_type,
        //                 subtype: this.props.dailyInput.daily_input,
        //                 ship_imo: this.props.currentShip.currentShip['value'],
        //                 ship_name: this.props.currentShip.currentShip['label'],
        //             }
        //         })
        //     })
        // }
        // else if(this.props.dailyInput.daily_input === 'noon' && this.props.dailyInput.daily_input_type === 'engine') {
        //     this.spreadsheet2.saveAsJson()
        //     .then(Json => {
        //         // let sheets = Json['jsonObject']['Workbook']['sheets']
        //         // let excelObject={};
        //         // let headers=[];
        //         // let values=[];
                
        //         // for(let sheet=0;sheet<sheets.length;sheet++) {
        //         //     Object.keys(sheets[sheet]).map(item => {
        //         //         if('rows' === item) {
        //         //             for(let row=0;row<3;row++) {
        //         //                 if(row === 0) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //                 else if(row > 0) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //             }
        //         //         }
        //         //     })
        //         // }
        //         // for(let header=0;header<headers.length;header++) {
        //         //     excelObject[headers[header]] = []
        //         // }

        //         // let number_of_times_to_repeat_header_names = values.length / headers.length;
        //         // let new_headers_list=[];
        //         // if(number_of_times_to_repeat_header_names === 1) {
        //         //     new_headers_list = headers
        //         // }
        //         // else {
        //         //     for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
        //         //         new_headers_list.push(...headers)
        //         //     }
        //         // }

        //         // for(let header=0;header<new_headers_list.length;header++) {
        //         //     Object.keys(excelObject).map(head => {
        //         //         if(head === new_headers_list[header]) {
        //         //             excelObject[head].push(values[header])
        //         //         }
        //         //     })
        //         // }
        //         // console.log(headers, values, excelObject);
        //         // axios.post(excelputurl, excelObject, {
        //         //     params: {
        //         //         type: this.props.dailyInput.daily_input_type,
        //         //         subtype: this.props.dailyInput.daily_input,
        //         //         ship_imo: this.props.currentShip.currentShip['value'],
        //         //         ship_name: this.props.currentShip.currentShip['label'],
        //         //     }
        //         // })
        //         // .then(response => {
        //         //     console.log(response);
        //         // })

        //         axios({
        //             method: "post",
        //             url: excelputurl,
        //             data: JSON.stringify(Json['jsonObject']['Workbook']),
        //             params: {
        //                 type: this.props.dailyInput.daily_input_type,
        //                 subtype: this.props.dailyInput.daily_input,
        //                 ship_imo: this.props.currentShip.currentShip['value'],
        //                 ship_name: this.props.currentShip.currentShip['label'],
        //             }
        //         })
        //     })
        // }
        // else if(this.props.dailyInput.daily_input === 'logs' && this.props.dailyInput.daily_input_type === 'fuel') {
        //     this.spreadsheet3.saveAsJson()
        //     .then(Json => {
        //         // let sheets = Json['jsonObject']['Workbook']['sheets']
        //         // let excelObject={};
        //         // let headers=[];
        //         // let values=[];
                
        //         // for(let sheet=0;sheet<sheets.length;sheet++) {
        //         //     Object.keys(sheets[sheet]).map(item => {
        //         //         if('rows' === item) {
        //         //             for(let row=0;row<2;row++) {
        //         //                 if(row === 0) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //                 else if(row === 1) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //             }
        //         //         }
        //         //     })
        //         // }
        //         // for(let header=0;header<headers.length;header++) {
        //         //     excelObject[headers[header]] = []
        //         // }

        //         // let number_of_times_to_repeat_header_names = values.length / headers.length;
        //         // let new_headers_list=[];
        //         // if(number_of_times_to_repeat_header_names === 1) {
        //         //     new_headers_list = headers
        //         // }
        //         // else {
        //         //     for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
        //         //         new_headers_list.push(...headers)
        //         //     }
        //         // }

        //         // for(let header=0;header<new_headers_list.length;header++) {
        //         //     Object.keys(excelObject).map(head => {
        //         //         if(head === new_headers_list[header]) {
        //         //             excelObject[head].push(values[header])
        //         //         }
        //         //     })
        //         // }
        //         // console.log(headers, values, excelObject);
        //         axios({
        //             method: "post",
        //             url: excelputurl,
        //             data: JSON.stringify(Json['jsonObject']['Workbook']),
        //             params: {
        //                 type: this.props.dailyInput.daily_input_type,
        //                 subtype: this.props.dailyInput.daily_input,
        //                 ship_imo: this.props.currentShip.currentShip['value'],
        //                 ship_name: this.props.currentShip.currentShip['label'],
        //             }
        //         })
        //         // axios.post(excelputurl, excelObject, {
        //         //     params: {
        //         //         type: this.props.dailyInput.daily_input_type,
        //         //         subtype: this.props.dailyInput.daily_input,
        //         //         ship_imo: this.props.currentShip.currentShip['value'],
        //         //         ship_name: this.props.currentShip.currentShip['label'],
        //         //     }
        //         // })
        //         // .then(response => {
        //         //     console.log(response);
        //         // })
        //     })
        // }
        // else if(this.props.dailyInput.daily_input === 'logs' && this.props.dailyInput.daily_input_type === 'engine') {
        //     this.spreadsheet4.saveAsJson()
        //     .then(Json => {
        //         // let sheets = Json['jsonObject']['Workbook']['sheets']
        //         // let excelObject={};
        //         // let headers=[];
        //         // let values=[];
                
        //         // for(let sheet=0;sheet<sheets.length;sheet++) {
        //         //     Object.keys(sheets[sheet]).map(item => {
        //         //         if('rows' === item) {
        //         //             for(let row=0;row<2;row++) {
        //         //                 if(row === 0) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //                 else if(row === 1) {
        //         //                     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
        //         //                         values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
        //         //                     }
        //         //                 }
        //         //             }
        //         //         }
        //         //     })
        //         // }
        //         // for(let header=0;header<headers.length;header++) {
        //         //     excelObject[headers[header]] = []
        //         // }

        //         // let number_of_times_to_repeat_header_names = values.length / headers.length;
        //         // let new_headers_list=[];
        //         // if(number_of_times_to_repeat_header_names === 1) {
        //         //     new_headers_list = headers
        //         // }
        //         // else {
        //         //     for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
        //         //         new_headers_list.push(...headers)
        //         //     }
        //         // }

        //         // for(let header=0;header<new_headers_list.length;header++) {
        //         //     Object.keys(excelObject).map(head => {
        //         //         if(head === new_headers_list[header]) {
        //         //             excelObject[head].push(values[header])
        //         //         }
        //         //     })
        //         // }
        //         // console.log(headers, values, excelObject);
        //         // axios.post(excelputurl, excelObject, {
        //         //     params: {
        //         //         type: this.props.dailyInput.daily_input_type,
        //         //         subtype: this.props.dailyInput.daily_input,
        //         //         ship_imo: this.props.currentShip.currentShip['value'],
        //         //         ship_name: this.props.currentShip.currentShip['label'],
        //         //     }
        //         // })
        //         // .then(response => {
        //         //     console.log(response);
        //         // })

        //         axios({
        //             method: "post",
        //             url: excelputurl,
        //             data: JSON.stringify(Json['jsonObject']['Workbook']),
        //             params: {
        //                 type: this.props.dailyInput.daily_input_type,
        //                 subtype: this.props.dailyInput.daily_input,
        //                 ship_imo: this.props.currentShip.currentShip['value'],
        //                 ship_name: this.props.currentShip.currentShip['label'],
        //             }
        //         })
        //     })
        // }

        // await axios({
        //   method: 'post',
        //   url: excelurl,
        //   params: {
        //       ship_imo: this.props.currentShip.currentShip['value'],
        //       ship_name: this.props.currentShip.currentShip['label'],
        //       type: this.props.dailyInput.daily_input_type,
        //       subtype: this.props.dailyInput.daily_input
        //   }
        // })
        // .then(response => {
        //   const res = response.data.filter(element => {
        //     if (Object.keys(element).length !== 0) {
        //       return true;
        //     }
          
        //     return false;
        //   });
        //   this.setState({
        //     data: res
        //   });
        // });
    }

    onNoonFuelUpload = () => {
        console.log(this.props.dailyInput.daily_input_type);
        this.spreadsheet1.saveAsJson()
            .then(Json => {
                let sheets = Json['jsonObject']['Workbook']['sheets']
                let excelObject={};
                let headers=[];
                let values=[];
                
                for(let sheet=0;sheet<sheets.length;sheet++) {
                    Object.keys(sheets[sheet]).map(item => {
                        if('rows' === item) {
                            for(let row=2;row<sheets[sheet]['rows'].length;row++) {
                                if(row === 2) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                                else if(row === sheets[sheet]['rows'].length - 1) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                            }
                        }
                    })
                }
                for(let header=0;header<headers.length;header++) {
                    excelObject[headers[header]] = []
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
                    Object.keys(excelObject).map(head => {
                        if(head === new_headers_list[header]) {
                            excelObject[head].push(values[header])
                        }
                    })
                }
                console.log(headers, values, excelObject);
                axios.post(urls, excelObject, {
                    params: {
                        type: this.props.dailyInput.daily_input_type,
                        subtype: this.props.dailyInput.daily_input,
                        ship_imo: this.props.trends.ship_imo
                    }
                })
                .then(response => {
                    console.log(response);
                })
            })
    }

    onNoonEngineUpload = () => {
        this.spreadsheet2.saveAsJson()
            .then(Json => {
                let sheets = Json['jsonObject']['Workbook']['sheets']
                let excelObject={};
                let headers=[];
                let values=[];
                
                for(let sheet=0;sheet<sheets.length;sheet++) {
                    Object.keys(sheets[sheet]).map(item => {
                        if('rows' === item) {
                            for(let row=2;row<sheets[sheet]['rows'].length;row++) {
                                if(row === 2) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                                else if(row === sheets[sheet]['rows'].length - 1) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                            }
                        }
                    })
                }
                for(let header=0;header<headers.length;header++) {
                    excelObject[headers[header]] = []
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
                    Object.keys(excelObject).map(head => {
                        if(head === new_headers_list[header]) {
                            excelObject[head].push(values[header])
                        }
                    })
                }
                console.log(headers, values, excelObject);
                axios.post(urls, excelObject, {
                    params: {
                        type: this.props.dailyInput.daily_input_type,
                        subtype: this.props.dailyInput.daily_input,
                        ship_imo: this.props.trends.ship_imo
                    }
                })
            })
    }

    onLogsUpload = () => {
        this.spreadsheet2.saveAsJson()
            .then(Json => {
                let sheets = Json['jsonObject']['Workbook']['sheets']
                let excelObject={};
                let headers=[];
                let values=[];
                
                for(let sheet=0;sheet<sheets.length;sheet++) {
                    Object.keys(sheets[sheet]).map(item => {
                        if('rows' === item) {
                            for(let row=0;row<sheets[sheet]['rows'].length;row++) {
                                if(row === 0) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                                else if(row === sheets[sheet]['rows'].length - 1) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                            }
                        }
                    })
                }
                for(let header=0;header<headers.length;header++) {
                    excelObject[headers[header]] = []
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
                    Object.keys(excelObject).map(head => {
                        if(head === new_headers_list[header]) {
                            excelObject[head].push(values[header])
                        }
                    })
                }
                console.log(headers, values, excelObject);
                axios.post(urls, excelObject, {
                    params: {
                        type: this.props.dailyInput.daily_input_type
                    }
                })
            })
    }

    onRadioChange = (e) => {
        

        // let noonfuel = document.getElementById("noonfuel");
        // let noonengine = document.getElementById("noonengine");
        // let logsfuel = document.getElementById("logsfuel");
        // let logsengine = document.getElementById("logsengine");
        if(e.target.value === "fuel" && this.props.dailyInput.daily_input === "noon") {
            this.props.setDailyInputType(e.target.value);
            this.setState({
                type: e.target.value
            });
            sessionStorage.setItem('daily_input_type', e.target.value)
            // noonfuel.style.visibility = "visible";
            // noonfuel.style.display = "contents";
            // noonengine.style.visibility = "hidden";
            // noonengine.style.display = "none";
            // logsfuel.style.visibility = "hidden";
            // logsfuel.style.display = "none";
            // logsengine.style.visibility = "hidden";
            // logsengine.style.display = "none";
        }
        else if(e.target.value === "engine" && this.props.dailyInput.daily_input === "noon") {
            this.props.setDailyInputType(e.target.value);
            this.setState({
                type: e.target.value
            });
            sessionStorage.setItem('daily_input_type', e.target.value)
            // noonfuel.style.visibility = "hidden";
            // noonfuel.style.display = "none";
            // noonengine.style.visibility = "visible";
            // noonengine.style.display = "contents";
            // logsfuel.style.visibility = "hidden";
            // logsfuel.style.display = "none";
            // logsengine.style.visibility = "hidden";
            // logsengine.style.display = "none";
        }
        else if(e.target.value === "fuel" && this.props.dailyInput.daily_input === "logs") {
            this.props.setDailyInputType(e.target.value);
            this.setState({
                type: e.target.value
            });
            sessionStorage.setItem('daily_input_type', e.target.value)
            // noonfuel.style.visibility = "hidden";
            // noonfuel.style.display = "none";
            // noonengine.style.visibility = "hidden";
            // noonengine.style.display = "none";
            // logsfuel.style.visibility = "visible";
            // logsfuel.style.display = "contents";
            // logsengine.style.visibility = "hidden";
            // logsengine.style.display = "none";
        }
        else if(e.target.value === "engine" && this.props.dailyInput.daily_input === "logs") {
            this.props.setDailyInputType(e.target.value);
            this.setState({
                type: e.target.value
            });
            sessionStorage.setItem('daily_input_type', e.target.value)
            // noonfuel.style.visibility = "hidden";
            // noonfuel.style.display = "none";
            // noonengine.style.visibility = "hidden";
            // noonengine.style.display = "none";
            // logsfuel.style.visibility = "hidden";
            // logsfuel.style.display = "none";
            // logsengine.style.visibility = "visible";
            // logsengine.style.display = "contents";
        }
        else if(e.target.value === "noon" && this.props.dailyInput.daily_input_type === "fuel") {
            this.props.setDailyInput(e.target.value);
            this.setState({
                subtype: e.target.value
            });
            sessionStorage.setItem('daily_input', e.target.value)
            // noonfuel.style.visibility = "visible";
            // noonfuel.style.display = "contents";
            // noonengine.style.visibility = "hidden";
            // noonengine.style.display = "none";
            // logsfuel.style.visibility = "hidden";
            // logsfuel.style.display = "none";
            // logsengine.style.visibility = "hidden";
            // logsengine.style.display = "none";
        }
        else if(e.target.value === "noon" && this.props.dailyInput.daily_input_type === "engine") {
            this.props.setDailyInput(e.target.value);
            this.setState({
                subtype: e.target.value
            });
            sessionStorage.setItem('daily_input', e.target.value)
            // noonfuel.style.visibility = "hidden";
            // noonfuel.style.display = "none";
            // noonengine.style.visibility = "visible";
            // noonengine.style.display = "contents";
            // logsfuel.style.visibility = "hidden";
            // logsfuel.style.display = "none";
            // logsengine.style.visibility = "hidden";
            // logsengine.style.display = "none";
        }
        else if(e.target.value === "logs" && this.props.dailyInput.daily_input_type === "fuel") {
            this.props.setDailyInput(e.target.value);
            this.setState({
                subtype: e.target.value
            });
            sessionStorage.setItem('daily_input', e.target.value)
            // noonfuel.style.visibility = "hidden";
            // noonfuel.style.display = "none";
            // noonengine.style.visibility = "hidden";
            // noonengine.style.display = "none";
            // logsfuel.style.visibility = "visible";
            // logsfuel.style.display = "contents";
            // logsengine.style.visibility = "hidden";
            // logsengine.style.display = "none";
        }
        else if(e.target.value === "logs" && this.props.dailyInput.daily_input_type === "engine") {
            this.props.setDailyInput(e.target.value);
            this.setState({
                subtype: e.target.value
            });sessionStorage.setItem('daily_input', e.target.value)
            // noonfuel.style.visibility = "hidden";
            // noonfuel.style.display = "none";
            // noonengine.style.visibility = "hidden";
            // noonengine.style.display = "none";
            // logsfuel.style.visibility = "hidden";
            // logsfuel.style.display = "none";
            // logsengine.style.visibility = "visible";
            // logsengine.style.display = "contents";
        }
    }

    showSpreadsheet = () => {
        // let noonOrLogs;
        // if(this.props.dailyInput.daily_input_type === 'fuel' && this.props.dailyInput.daily_input === 'noon') {
        //     noonOrLogs = 'Noon Reports - Fuel'
        // }
        // else if(this.props.dailyInput.daily_input_type === 'fuel' && this.props.dailyInput.daily_input === 'logs') {
        //     noonOrLogs = 'Logs - Fuel'
        // }
        // else if(this.props.dailyInput.daily_input_type === 'engine' && this.props.dailyInput.daily_input === 'noon') {
        //     noonOrLogs = 'Noon Reports - Engine'
        // }
        // else if(this.props.dailyInput.daily_input_type === 'engine' && this.props.dailyInput.daily_input === 'logs') {
        //     noonOrLogs = 'Logs - Engine'
        // }

        if(this.props.dailyInput.loading === true) {
            return(
                <Loading />
            )
        }
        else if(this.props.dailyInput.errMess !== null) {
            return(
                <div>{this.props.dailyInput.errMess.message}</div>
                // <SpreadsheetComponentCreator
                //     data={this.props.dailyInput.spreadsheetData}
                //     metadata={this.props.dailyInput.spreadsheetMetadata}
                //     sheetName={noonOrLogs}
                // />
            )
        }
        else {
            return (
                <SpreadsheetComponentCreator
                    data={this.props.dailyInput.spreadsheetData}
                    metadata={this.props.dailyInput.spreadsheetMetadata}
                    sheetNames={this.props.dailyInput.spreadsheetNames}
                />
            )
        }

        
    }

    render() {
        const daily_input = sessionStorage.getItem('daily_input')
        const daily_input_type = sessionStorage.getItem('daily_input_type')
        return (
            <>
                <Header isOverview={false} />
                <div style={{marginLeft: "20px", marginRight: "20px", marginTop: "10px", overflowY: "initial", height: "100%"}}>
                    <h3>Type of Daily Input: {this.props.dailyInput.daily_input_type === 'fuel' ? 'Nav' + " - " + this.props.dailyInput.daily_input : this.props.dailyInput.daily_input_type + " - " + this.props.dailyInput.daily_input}</h3>
                    <Row className="align-items-center">
                        <Col md={6}>
                            {
                                typeof daily_input_type !== typeof null && daily_input_type === 'fuel' ?
                                <>
                                <label htmlFor="radio1"><input type="radio" id="radio1" name="radio" value="fuel" onChange={this.onRadioChange} defaultChecked/> Nav</label>&nbsp;&nbsp;
                                <label htmlFor="radio2"><input type="radio" id="radio2" name="radio" value="engine" onChange={this.onRadioChange} /> Engine</label>&nbsp;&nbsp;
                                </>
                                :
                                typeof daily_input_type !== typeof null && daily_input_type === 'engine' ?
                                <>
                                <label htmlFor="radio1"><input type="radio" id="radio1" name="radio" value="fuel" onChange={this.onRadioChange} /> Nav</label>&nbsp;&nbsp;
                                <label htmlFor="radio2"><input type="radio" id="radio2" name="radio" value="engine" onChange={this.onRadioChange} defaultChecked /> Engine</label>&nbsp;&nbsp;
                                </>
                                :
                                <>
                                <label htmlFor="radio1"><input type="radio" id="radio1" name="radio" value="fuel" onChange={this.onRadioChange} defaultChecked/> Nav</label>&nbsp;&nbsp;
                                <label htmlFor="radio2"><input type="radio" id="radio2" name="radio" value="engine" onChange={this.onRadioChange} /> Engine</label>&nbsp;&nbsp;
                                </>
                            }
                            {/* <label htmlFor="radio1"><input type="radio" id="radio1" name="radio" value="fuel" onChange={this.onRadioChange} defaultChecked/> Nav</label>&nbsp;&nbsp;
                            <label htmlFor="radio2"><input type="radio" id="radio2" name="radio" value="engine" onChange={this.onRadioChange} /> Engine</label>&nbsp;&nbsp; */}
                        </Col>
                        {/* <Col md={4} style={{alignContent: "center", alignItems: "center"}}>
                            <Button size="xs" outline color="success" style={{display: "inline-block"}} onClick={this.runGetSpreadsheet}>Show Last Year</Button>
                        </Col> */}
                        <Col md={6} style={{alignContent: "center", alignItems: "center"}}>
                            <div style={{float: "right"}}>
                                {
                                    this.props.currentShip.currentShip['value'] === 9592301 || this.props.currentShip.currentShip['value'] === '9592301' ? 
                                        <>
                                        <label htmlFor="radio3"><input type="radio" id="radio3" name="radio1" value="noon" onChange={this.onRadioChange} /> Noon Reports</label>&nbsp;&nbsp;
                                        <label htmlFor="radio4"><input type="radio" id="radio4" name="radio1" value="logs" onChange={this.onRadioChange} defaultChecked /> Logs</label>
                                        </>
                                    :
                                    typeof daily_input !== typeof null && daily_input === 'noon' ?
                                        <>
                                        <label htmlFor="radio3"><input type="radio" id="radio3" name="radio1" value="noon" onChange={this.onRadioChange} defaultChecked /> Noon Reports</label>&nbsp;&nbsp;
                                        <label htmlFor="radio4"><input type="radio" id="radio4" name="radio1" value="logs" onChange={this.onRadioChange} /> Logs</label>
                                        </>
                                    :
                                    typeof daily_input !== typeof null && daily_input === 'logs' ?
                                        <>
                                        <label htmlFor="radio3"><input type="radio" id="radio3" name="radio1" value="noon" onChange={this.onRadioChange} /> Noon Reports</label>&nbsp;&nbsp;
                                        <label htmlFor="radio4"><input type="radio" id="radio4" name="radio1" value="logs" onChange={this.onRadioChange} defaultChecked /> Logs</label>
                                        </>
                                    :
                                        <>
                                        <label htmlFor="radio3"><input type="radio" id="radio3" name="radio1" value="noon" onChange={this.onRadioChange} defaultChecked /> Noon Reports</label>&nbsp;&nbsp;
                                        <label htmlFor="radio4"><input type="radio" id="radio4" name="radio1" value="logs" onChange={this.onRadioChange} /> Logs</label>
                                        </>
                                }
                                {/* <label htmlFor="radio3"><input type="radio" id="radio3" name="radio1" value="noon" onChange={this.onRadioChange} defaultChecked /> Noon Reports</label>&nbsp;&nbsp;
                                <label htmlFor="radio4"><input type="radio" id="radio4" name="radio1" value="logs" onChange={this.onRadioChange} /> Logs</label> */}
                            </div>
                        </Col>
                    </Row>
                    <div>{this.showSpreadsheet()}</div>
                    {/* {
                        this.state.data !== null ? 
                            (<SpreadsheetComponentCreator
                                data={this.state.data}
                                metadata={this.state.metadata}
                                sheetName={"Sheet1"}
                            />) : <Loading />
                    } */}
                    {/* <div id="noonfuel" style={{visibility: "visible", display: "contents"}}>
                        <SpreadsheetComponent ref={(ssObj) => { this.spreadsheet1 = ssObj; }} openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open' saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'>
                            <SheetsDirective>
                                <SheetDirective name='Noon Report - Fuel'>
                                    <RangesDirective>
                                        <RangeDirective dataSource={this.state.data} showFieldAsHeader={false}></RangeDirective>
                                    </RangesDirective>
                                    <RowsDirective>
                                        {
                                            this.state.metadata && Object.keys(this.state.metadata).map(row => {
                                                return (
                                                    <RowDirective>
                                                        <CellsDirective>
                                                            {
                                                                this.state.metadata[row] && Object.keys(this.state.metadata[row]).map(cell => {
                                                                    return (
                                                                        <CellDirective
                                                                            index={cell}
                                                                            colSpan={this.state.metadata[row][cell][0]}
                                                                            rowSpan={this.state.metadata[row][cell][1]}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </CellsDirective>
                                                    </RowDirective>
                                                )
                                            })
                                        }
                                    </RowsDirective>
                                    <ColumnsDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                    </ColumnsDirective>
                                </SheetDirective>
                            </SheetsDirective>
                        </SpreadsheetComponent><br />                  
                        <Button size="lg" outline color="success" onClick={this.onNoonFuelUpload} style={{marginLeft: "45%"}}>Send To Server</Button>
                    </div>
                    <div id="noonengine" style={{visibility: "hidden", display: "none"}}>
                        <SpreadsheetComponent ref={(ssObj) => { this.spreadsheet2 = ssObj; }} openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open' saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'>
                            <SheetsDirective>
                                <SheetDirective name='Noon Report - Engine'>
                                    <RangesDirective>
                                        <RangeDirective dataSource={this.state.data} showFieldAsHeader={false}></RangeDirective>
                                    </RangesDirective>
                                    <RowsDirective>
                                        {
                                            this.state.metadata && Object.keys(this.state.metadata).map(row => {
                                                return (
                                                    <RowDirective>
                                                        <CellsDirective>
                                                            {
                                                                this.state.metadata[row] && Object.keys(this.state.metadata[row]).map(cell => {
                                                                    return (
                                                                        <CellDirective
                                                                            index={cell}
                                                                            colSpan={this.state.metadata[row][cell][0]}
                                                                            rowSpan={this.state.metadata[row][cell][1]}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </CellsDirective>
                                                    </RowDirective>
                                                )
                                            })
                                        }
                                    </RowsDirective>
                                    <ColumnsDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                    </ColumnsDirective>
                                </SheetDirective>
                            </SheetsDirective>
                        </SpreadsheetComponent><br />
                        <Button size="lg" outline color="success" onClick={this.onNoonEngineUpload} style={{marginLeft: "45%"}}>Send To Server</Button>
                    </div>
                    <div id="logsfuel" style={{visibility: "hidden", display: "none"}}>
                        <SpreadsheetComponent ref={(ssObj) => { this.spreadsheet3 = ssObj; }} openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open' saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'>
                            <SheetsDirective>
                                <SheetDirective name='Logs - Fuel'>
                                    <RangesDirective>
                                        <RangeDirective dataSource={this.state.data} showFieldAsHeader={false}></RangeDirective>
                                    </RangesDirective>
                                    <RowsDirective>
                                        {
                                            this.state.metadata && Object.keys(this.state.metadata).map(row => {
                                                return (
                                                    <RowDirective>
                                                        <CellsDirective>
                                                            {
                                                                this.state.metadata[row] && Object.keys(this.state.metadata[row]).map(cell => {
                                                                    return (
                                                                        <CellDirective
                                                                            index={cell}
                                                                            colSpan={this.state.metadata[row][cell][0]}
                                                                            rowSpan={this.state.metadata[row][cell][1]}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </CellsDirective>
                                                    </RowDirective>
                                                )
                                            })
                                        }
                                    </RowsDirective>
                                    <ColumnsDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                    </ColumnsDirective>
                                </SheetDirective>
                            </SheetsDirective>
                        </SpreadsheetComponent><br />
                        <Button size="lg" outline color="success" onClick={this.onLogsUpload} style={{marginLeft: "45%"}}>Send To Server</Button>
                    </div>
                    <div id="logsengine" style={{visibility: "hidden", display: "none"}}>
                        <SpreadsheetComponent ref={(ssObj) => { this.spreadsheet4 = ssObj; }} openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open' saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'>
                            <SheetsDirective>
                                <SheetDirective name='Logs - Engine'>
                                    <RangesDirective>
                                        <RangeDirective dataSource={this.state.data} showFieldAsHeader={false}></RangeDirective>
                                    </RangesDirective>
                                    <RowsDirective>
                                        {
                                            this.state.metadata && Object.keys(this.state.metadata).map(row => {
                                                return (
                                                    <RowDirective>
                                                        <CellsDirective>
                                                            {
                                                                this.state.metadata[row] && Object.keys(this.state.metadata[row]).map(cell => {
                                                                    return (
                                                                        <CellDirective
                                                                            index={cell}
                                                                            colSpan={this.state.metadata[row][cell][0]}
                                                                            rowSpan={this.state.metadata[row][cell][1]}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </CellsDirective>
                                                    </RowDirective>
                                                )
                                            })
                                        }
                                    </RowsDirective>
                                    <ColumnsDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                        <ColumnDirective></ColumnDirective>
                                    </ColumnsDirective>
                                </SheetDirective>
                            </SheetsDirective>
                        </SpreadsheetComponent><br />
                        <Button size="lg" outline color="success" onClick={this.onLogsUpload} style={{marginLeft: "45%"}}>Send To Server</Button>
                    </div><br /> */}
                    {/* {console.log(this.spreadsheet1.sheets[0].rows.length)} */}
                    {/* <label htmlFor='template'>Made changes to the top two rows?</label>
                    <Button size='sm' outline color="primary" onClick={this.putSpreadsheet}>Save Changes</Button> */}
                </div>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Spreadsheet);