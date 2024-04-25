import React from 'react';
import axios from 'axios';
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective } from '@syncfusion/ej2-react-spreadsheet';
import { RangeDirective, ColumnsDirective, ColumnDirective, RowsDirective, RowDirective, CellsDirective, CellDirective } from '@syncfusion/ej2-react-spreadsheet';
import { Button } from 'reactstrap';
import {baseUrl} from '../../shared/baseUrl';
import { connect } from 'react-redux';
import moment from 'moment';
import { setTemplateError, setTemplateLoading, setTemplateResponse, setSendBackendError, 
    setSendBackendLoading, setSendBackendResponse, setSpreadsheetData, setSpreadsheetError, 
    setSpreadsheetLoading, setSpreadsheetMetadata, setSpreadsheetNames } from '../../redux/ActionCreators';
import { Loading } from '../LoadingComponent';
import { Col, Row } from 'react-bootstrap';

const urls = baseUrl + process.env.REACT_APP_SEND_BACKEND;
const excelputurl = baseUrl + process.env.REACT_APP_PUT_SPREADSHEET;
const excelurl = baseUrl + process.env.REACT_APP_GET_SPREADSHEET;

let cancelToken = axios.CancelToken.source();

const mapStateToProps = state => {
    return {
        currentShip: state.currentShip,
        dailyInput: state.dailyInput,
        trends: state.trends
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTemplateError: (input) => { dispatch(setTemplateError(input))},
    setTemplateLoading: (input) => { dispatch(setTemplateLoading(input))},
    setTemplateResponse: (input) => { dispatch(setTemplateResponse(input))},
    setSendBackendError: (input) => { dispatch(setSendBackendError(input))},
    setSendBackendLoading: (input) => { dispatch(setSendBackendLoading(input))},
    setSendBackendResponse: (input) => { dispatch(setSendBackendResponse(input))},
    setSpreadsheetData: (input) => { dispatch(setSpreadsheetData(input)) },
    setSpreadsheetMetadata: (input) => { dispatch(setSpreadsheetMetadata(input)) },
    setSpreadsheetNames: (input) => { dispatch(setSpreadsheetNames(input)) },
    setSpreadsheetLoading: (input) => { dispatch(setSpreadsheetLoading(input)) },
    setSpreadsheetError: (input) => { dispatch(setSpreadsheetError(input)) },
});

class SpreadsheetComponentCreator extends React.Component {
    constructor(props) {
        super(props);

        // this.cancelToken;

        this.putSpreadsheet = this.putSpreadsheet.bind(this);
        this.onNoonFuelUpload = this.onNoonFuelUpload.bind(this);
        this.getSpreadsheet = this.getSpreadsheet.bind(this);
        this.allDataThisYear = this.allDataThisYear.bind(this);
        this.allDataLastYear = this.allDataLastYear.bind(this);
        this.dataBoundProtectSpreadsheet = this.dataBoundProtectSpreadsheet.bind(this);
        this.dataBoundUnprotectSheet = this.dataBoundUnprotectSheet.bind(this);

    }

    componentDidMount() {
        // console.log("METADATA!!!!", this.props.metadata);
        this.spreadsheet1.height = window.innerHeight > 750 ? "900" : "100%"
        // this.spreadsheet1.lockCells('A1:ZZ1', true);
        // this.spreadsheet1.cellFormat({isLocked: false}, "A2:ZZ100")
    }

    // componentWillUnmount() {
    //     if(cancelToken) {
    //         cancelToken.cancel("");
    //     }
    // }

    componentDidUpdate(prevProps, prevState) {
        // if(prevProps.dailyInput.spreadsheetData !== this.props.dailyInput.spreadsheetData) {
        //     // this.spreadsheet1.lockCells('A1:Z1', true);
        //     console.log("COMPONENT DID UPDATE!!!");
        //     this.dataBoundUnprotectSheet();
        //     this.dataBoundProtectSpreadsheet();
        // }
        // if(prevProps.dailyInput.spreadsheetMetadata !== this.props.dailyInput.spreadsheetMetadata) {
        //     console.log("COMPONENT DID UPDATE!!!");
        //     this.dataBoundUnprotectSheet();
        //     this.dataBoundProtectSpreadsheet();
        // }
        if(prevProps.dailyInput.responseForSendBackend !== this.props.dailyInput.responseForSendBackend) {
            window.location.reload()
        }
    }

    dataBoundProtectSpreadsheet = () => {
        // this.spreadsheet1.allowInsert(true);
        // this.spreadsheet1.allowDelete(true);
        this.props.sheetNames && this.props.sheetNames.map(name => {
            let indexOfName = this.props.sheetNames.indexOf(name);
            this.spreadsheet1.protectSheet(name, {selectCells: true, insertLink: true, formatRows: true, formatColumns: true, formatCells: true})
            this.spreadsheet1.lockCells("A1:ZZ1", true);
            this.spreadsheet1.lockCells("A2:ZZ100", false);
            this.spreadsheet1.allowInsert=true
            this.spreadsheet1.allowEditing=true
            this.spreadsheet1.allowChart=true;
            this.spreadsheet1.allowCellFormatting=true;
            this.spreadsheet1.allowDelete=true;
            this.spreadsheet1.allowMerge=true;
            this.spreadsheet1.allowInsert=true;
            this.spreadsheet1.allowFindAndReplace=true;
            this.spreadsheet1.allowSave=true;
        })
    }

    dataBoundUnprotectSheet = () => {
        this.props.sheetNames && this.props.sheetNames.map(name => {
            // this.spreadsheet1.protectSheet(name, {selectCells: true, insertLink: true, formatRows: true, formatColumns: true, formatCells: true})
            // this.spreadsheet1.lockCells("A1:ZZ1", true);
            // this.spreadsheet1.lockCells("A2:ZZ100", false);
            // this.spreadsheet1.allowInsert=true
            this.spreadsheet1.unprotectSheet(name)
        })
    }

    getSpreadsheet = async (how_many_days='7') => {
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

        const currentship = sessionStorage.getItem("currentship");
        // this.cancelToken = axios.CancelToken.source();

        try{
            await axios({
                method: 'get',
                url: excelurl,
                params: {
                  ship_imo: this.props.currentShip.currentShip['value'],
                  ship_name: this.props.currentShip.currentShip['label'],
                  type: this.props.dailyInput.daily_input_type,
                  subtype: this.props.dailyInput.daily_input,
                  how_many_days: how_many_days
                },
                cancelToken: cancelToken.token
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

    allDataThisYear = () => {
        this.props.setSpreadsheetLoading(true);
        this.getSpreadsheet('365')
    }

    allDataLastYear = () => {
        this.props.setSpreadsheetLoading(true);
        this.getSpreadsheet('lastyear')
    }

    putSpreadsheet = () => {
        this.props.setTemplateLoading(true);
        this.spreadsheet1.saveAsJson()
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
            .then(res => {
                console.log(res);
                this.props.setTemplateResponse(res);
            })
            .catch(err => {
                console.log(err);
                this.props.setTemplateError(err);
            })
        })
    }

    onNoonFuelUpload = () => {

        this.dataBoundUnprotectSheet();

        this.props.setSendBackendLoading(true);
        if(this.props.dailyInput.daily_input === 'noon') {
            this.spreadsheet1.saveAsJson()
            .then(Json => {
                let sheets = Json['jsonObject']['Workbook']['sheets']
                let excelObject={};
                let headers=[];
                let values=[];
                let todays_date = moment().format("DD-MM-YYYY")
                let todays_date_split = moment().format("DD-MM-YYYY").split('-')
                // let todays_date = '12-07-2022'
                
                for(let sheet=0;sheet<sheets.length;sheet++) {
                    Object.keys(sheets[sheet]).map(item => {
                        if('rows' === item) {
                            for(let row=0;row<sheets[sheet]['rows'].length;row++) {
                                if(row === 0) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                }
                                // else if(row === sheets[sheet]['rows'].length - 1) {
                                //     // console.log("LAST ROW!!!!!!!!!", row);
                                //     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                //         // console.log("LAST ROW VALUES!!!!!!!!!");
                                //         if('value' in sheets[sheet]['rows'][row]['cells'][cell]) {
                                //             values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                //         }
                                //     }
                                // }
                            }
                            for(let row=sheets[sheet]['rows'].length-1;row>-1;row--) {
                                for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                    try {
                                        try {
                                            let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD/MM/YYYY HH:mm:ss').format('DD-MM-YYYY');
                                            let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('/')
                                            if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                            }
                                        }
                                        catch(error) {
                                            try {
                                                let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YY HH:mm:ss').format('DD-MM-YYYY');
                                                let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('-')
                                                if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                    values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                }
                                            }
                                            catch(error) {
                                                try {
                                                    let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD/MM/YY HH:mm:ss').format('DD-MM-YYYY');
                                                    let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('/')
                                                    if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                        values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                    }
                                                }
                                                catch(error) {
                                                    try {
                                                        let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY');
                                                        let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('-')
                                                        if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                            values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                        }
                                                    }
                                                    catch(error) {
                                                        try {
                                                            let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY').format('DD-MM-YYYY');
                                                            let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('-')
                                                            if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                                values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                            }
                                                        }
                                                        catch(error) {
                                                            let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD/MM/YYYY').format('DD-MM-YYYY');
                                                            let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('/')
                                                            if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                                values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        // let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY');
                                        // if(stringDate === todays_date) {
                                        //     values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                        // }
                                    }
                                    catch(error) {
                                        continue
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
                console.log(excelObject);

                this.dataBoundProtectSpreadsheet();

                axios.post(urls, excelObject, {
                    params: {
                        type: this.props.dailyInput.daily_input_type,
                        subtype: this.props.dailyInput.daily_input,
                        ship_imo: this.props.trends.ship_imo
                    }
                })
                .then(response => {
                    console.log(response);
                    this.props.setSendBackendResponse(response);
                })
                .catch(error => {
                    console.log(error);
                    this.props.setSendBackendError(error);
                })
            })
        }
        else if(this.props.dailyInput.daily_input === 'logs') {
            this.spreadsheet1.saveAsJson()
            .then(Json => {
                let sheets = Json['jsonObject']['Workbook']['sheets']
                let excelObject={};
                let headersDict={};
                let valuesDict={};
                let new_headers_list_dict={};
                let todays_date = moment().format("DD-MM-YYYY")
                let todays_date_split = moment().format("DD-MM-YYYY").split('-')
                // let headers=[];
                // let values=[];
                
                for(let sheet=0;sheet<sheets.length;sheet++) {
                    let headers=[];
                    let values=[];
                    Object.keys(sheets[sheet]).map(item => {
                        if('rows' === item) {
                            for(let row=0;row<sheets[sheet]['rows'].length;row++) {
                                if(row === 0) {
                                    for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                        headers.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                    }
                                    headersDict[sheet] = headers;
                                }
                                // else if(row === sheets[sheet]['rows'].length - 1) {
                                //     for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                //         values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                //     }
                                //     valuesDict[sheet] = values;
                                // }
                            }
                            for(let row=sheets[sheet]['rows'].length-1;row>-1;row--) {
                                for(let cell=0;cell<sheets[sheet]['rows'][row]['cells'].length;cell++) {
                                    try {
                                        try {
                                            let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD/MM/YYYY HH:mm:ss').format('DD-MM-YYYY');
                                            let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('/')
                                            if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                            }
                                        }
                                        catch(error) {
                                            try {
                                                let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YY HH:mm:ss').format('DD-MM-YYYY');
                                                let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('-')
                                                if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                    values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                }
                                            }
                                            catch(error) {
                                                try {
                                                    let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD/MM/YY HH:mm:ss').format('DD-MM-YYYY');
                                                    let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('/')
                                                    if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                        values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                    }
                                                }
                                                catch(error) {
                                                    try {
                                                        let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY');
                                                        let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('-')
                                                        if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                            values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                        }
                                                    }
                                                    catch(error) {
                                                        try {
                                                            let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY').format('DD-MM-YYYY');
                                                            let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('-')
                                                            if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                                values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                            }
                                                        }
                                                        catch(error) {
                                                            let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD/MM/YYYY').format('DD-MM-YYYY');
                                                            let stringDateSplit = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY').split('/')
                                                            if(stringDate === todays_date || parseInt(todays_date_split[0]) - parseInt(stringDateSplit[0]) === 1) {
                                                                values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        // let stringDate = moment(sheets[sheet]['rows'][row]['cells'][0]['value'], 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY');
                                        // if(stringDate === todays_date) {
                                        //     values.push(sheets[sheet]['rows'][row]['cells'][cell]['value'])
                                        // }
                                    }
                                    catch(error) {
                                        continue
                                    }
                                }
                            }
                            valuesDict[sheet] = values
                        }
                    })
                }
                Object.keys(headersDict).map(sheetNumber => {
                    let headersEmptyListDict={}
                    for(let header=0;header<headersDict[sheetNumber].length;header++) {
                        // excelObject[headersDict[sheetNumber][header]] = []
                        headersEmptyListDict[headersDict[sheetNumber][header]] = []
                    }
                    excelObject[sheetNumber] = headersEmptyListDict;

                    let number_of_times_to_repeat_header_names = valuesDict[sheetNumber].length / headersDict[sheetNumber].length;
                    
                    if(number_of_times_to_repeat_header_names === 1) {
                        new_headers_list_dict[sheetNumber] = headersDict[sheetNumber]
                    }
                    else {
                        let new_headers_list = [];
                        for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
                            new_headers_list.push(...headersDict[sheetNumber])
                        }
                        new_headers_list_dict[sheetNumber] = new_headers_list
                    }
                })
                // for(let header=0;header<headers.length;header++) {
                //     excelObject[headers[header]] = []
                // }

                // let number_of_times_to_repeat_header_names = values.length / headers.length;
                // let new_headers_list=[];
                // if(number_of_times_to_repeat_header_names === 1) {
                //     new_headers_list = headers
                // }
                // else {
                //     for(let i=0;i<number_of_times_to_repeat_header_names;i++) {
                //         new_headers_list.push(...headers)
                //     }
                // }
                // console.log("EXCEL OBJ", excelObject);
                // console.log("NEW LIST HEADER OBJ", new_headers_list_dict);
                // for(let header=0;header<new_headers_list.length;header++) {
                Object.keys(new_headers_list_dict).map(sheetNumber => {
                    // console.log("LIS NEW HEADERS!!!", new_headers_list_dict[sheetNumber])
                    Object.keys(excelObject).map(sheet => {
                        // console.log("LIST EXCEL OBJ!!!", excelObject[sheet])
                        if(sheet === sheetNumber) {
                            // console.log("INSIDE IF!!!!!");
                            // Object.keys(headersDict).map(header => {
                            //     excelObject[sheetNumber][header].push(valuesDict[sheetNumber])
                            // })
                            for(let header=0;header<new_headers_list_dict[sheetNumber].length;header++) {
                                // console.log(excelObject[sheetNumber][new_headers_list_dict[sheetNumber][header]]);
                                excelObject[sheetNumber][new_headers_list_dict[sheetNumber][header]].push(valuesDict[sheetNumber][header])
                            }
                            // excelObject[head].push(values[header])
                        }
                    })
                })
                    // Object.keys(excelObject).map(head => {
                    //     if(head === new_headers_list[header]) {
                    //         excelObject[head].push(values[header])
                    //     }
                    // })
                // }
                console.log(headersDict, valuesDict, excelObject);

                axios.post(urls, excelObject, {
                    params: {
                        type: this.props.dailyInput.daily_input_type,
                        subtype: this.props.dailyInput.daily_input,
                        ship_imo: this.props.trends.ship_imo
                    }
                })
                .then(response => {
                    console.log(response);
                    this.props.setSendBackendResponse(response);
                })
                .catch(error => {
                    console.log(error);
                    this.props.setSendBackendError(error);
                })
            })
        }
        
    }

    render() {
        return (
            <>
                <SpreadsheetComponent style={{overflowY: "initial"}} openComplete={this.dataBoundProtectSpreadsheet} dataBound={this.dataBoundProtectSpreadsheet} created={this.dataBoundProtectSpreadsheet} ref={(ssObj) => { this.spreadsheet1 = ssObj; }} openUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open' saveUrl='https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save'>
                    <SheetsDirective>
                        {
                            this.props.sheetNames && this.props.sheetNames.map(name => {
                                return (
                                    <SheetDirective name={name}>
                                        <RangesDirective style={{overflowY: "initial"}}>
                                            {this.props.data &&  <RangeDirective dataSource={this.props.data[name]} showFieldAsHeader={false}></RangeDirective>}
                                        </RangesDirective>
                                        <RowsDirective>
                                            {
                                                this.props.metadata && name in this.props.metadata && Object.keys(this.props.metadata[name]).map(row => {
                                                    if(row === 0 || row === '0') {
                                                        console.log("IN ROW 1!!!!!!!");
                                                        return (
                                                            <RowDirective>
                                                                <CellsDirective>
                                                                    {
                                                                        this.props.metadata[name][row] && Object.keys(this.props.metadata[name][row]).map(cell => {
                                                                            // console.log(this.props.metadata[row][cell]);
                                                                            return (
                                                                                <CellDirective
                                                                                    index={cell}
                                                                                    colSpan={this.props.metadata[name][row][cell][0] === '' ? 0 : this.props.metadata[name][row][cell][0]}
                                                                                    rowSpan={this.props.metadata[name][row][cell][1] === '' ? 0 : this.props.metadata[name][row][cell][1]}
                                                                                    // style={this.props.metadata[name][row][cell][2] === {} ? {} : this.props.metadata[name][row][cell][2]}
                                                                                    style={Object.keys(this.props.metadata[name][row][cell][2]).length === 0 ? {} : this.props.metadata[name][row][cell][2]}
                                                                                    wrap={row < 3 ? true:false}
                                                                                    // isLocked={true}
                                                                                />
                                                                            )
                                                                        })
                                                                    }
                                                                </CellsDirective>
                                                            </RowDirective>
                                                        )
                                                    }
                                                    else {
                                                        return (
                                                            <RowDirective>
                                                                <CellsDirective>
                                                                    {
                                                                        this.props.metadata[name][row] && Object.keys(this.props.metadata[name][row]).map(cell => {
                                                                            // console.log(this.props.metadata[row][cell]);
                                                                            return (
                                                                                <CellDirective
                                                                                    index={cell}
                                                                                    colSpan={this.props.metadata[name][row][cell][0] === '' ? 0 : this.props.metadata[name][row][cell][0]}
                                                                                    rowSpan={this.props.metadata[name][row][cell][1] === '' ? 0 : this.props.metadata[name][row][cell][1]}
                                                                                    // style={this.props.metadata[name][row][cell][2] === {} ? {} : this.props.metadata[name][row][cell][2]}
                                                                                    style={Object.keys(this.props.metadata[name][row][cell][2]).length === 0 ? {} : this.props.metadata[name][row][cell][2]}
                                                                                    wrap={row < 3 ? true:false}
                                                                                    // isLocked={false}
                                                                                />
                                                                            )
                                                                        })
                                                                    }
                                                                </CellsDirective>
                                                            </RowDirective>
                                                        )
                                                    }
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
                                )
                            })
                            
                        }
                    </SheetsDirective>
                </SpreadsheetComponent><br />
                <Row>
                    <Col md={4} lg={4}>
                        {/* <Row> */}
                            {/* <Col> */}
                        <label htmlFor='input'>Made changes to the Data Inputs?&nbsp;&nbsp;</label>
                            {/* </Col> */}
                            {/* <Col>
                                {
                                    this.props.dailyInput.loadingForSendBackend === true ? <Button size="sm" disabled={true} outline color="success" onClick={this.onNoonFuelUpload}>Send To Server</Button>
                                    : <Button size="sm" outline color="success" onClick={this.onNoonFuelUpload}>Send To Server</Button>
                                }
                            </Col>
                            <Col>
                                <div style={{
                                    visibility: this.props.dailyInput.loadingForSendBackend === true ? "visible" :
                                    this.props.dailyInput.errMessForSendBackend !== null ? "visible" :
                                    this.props.dailyInput.responseForSendBackend !== null ? "visible" : "hidden",
                                    display: this.props.dailyInput.loadingForSendBackend === true ? "contents" :
                                    this.props.dailyInput.errMessForSendBackend !== null ? "contents" :
                                    this.props.dailyInput.responseForSendBackend !== null ? "contents" : "none"
                                }}>
                                    {
                                        this.props.dailyInput.loadingForSendBackend === true ? <Loading /> :
                                        this.props.dailyInput.errMessForSendBackend !== null ? <div style={{color: 'red', marginLeft: "30%"}}>{this.props.dailyInput.errMessForSendBackend.message}</div> :
                                        <div style={{color: "green", marginLeft: "30%"}}>
                                            {this.props.dailyInput.responseForSendBackend !== null ? this.props.dailyInput.responseForSendBackend.data : ""}
                                        </div>
                                    }
                                </div>
                            </Col> */}
                        {/* </Row> */}
                    </Col>
                    <Col md={2} lg={2}>
                        {
                            this.props.dailyInput.loadingForSendBackend === true ? <Button size="sm" disabled={true} outline color="success" onClick={this.onNoonFuelUpload}>Send To Server</Button>
                            : <Button size="sm" outline color="success" onClick={this.onNoonFuelUpload}>Send To Server</Button>
                        }
                    </Col>
                    <Col md={4} lg={4}>
                        <div style={{
                            visibility: this.props.dailyInput.loadingForSendBackend === true ? "visible" :
                            this.props.dailyInput.errMessForSendBackend !== null ? "visible" :
                            this.props.dailyInput.responseForSendBackend !== null ? "visible" : "hidden",
                            display: this.props.dailyInput.loadingForSendBackend === true ? "contents" :
                            this.props.dailyInput.errMessForSendBackend !== null ? "contents" :
                            this.props.dailyInput.responseForSendBackend !== null ? "contents" : "none"
                        }}>
                            {
                                this.props.dailyInput.loadingForSendBackend === true ? <Loading /> :
                                this.props.dailyInput.errMessForSendBackend !== null ? <div style={{color: 'red', marginLeft: "30%"}}>{this.props.dailyInput.errMessForSendBackend.message}</div> :
                                <div style={{color: "green", marginLeft: "30%"}}>
                                    {this.props.dailyInput.responseForSendBackend !== null ? this.props.dailyInput.responseForSendBackend.data : ""}
                                </div>
                            }
                        </div>
                    </Col>
                    <Col md={2} lg={2}>
                        <Button size="sm" outline color="success" style={{display: "inline-block", float: "right"}} onClick={this.allDataThisYear}>Show All Data This Year</Button><br />
                    </Col>
                </Row>
                <Row>
                    <Col md={4} lg={4}>
                        {/* <Row> */}
                            {/* <Col> */}
                        <label htmlFor='template'>Made changes to the headers in 2nd/3rd/4th row?&nbsp;&nbsp;</label>
                            {/* </Col> */}
                            {/* <Col>
                                {this.props.dailyInput.responseForTemplate !== null ? <Button size='sm' outline color="primary" disabled={true} onClick={this.putSpreadsheet}>Save&nbsp; Changes</Button> : <Button size='sm' outline color="primary" onClick={this.putSpreadsheet}>Save&nbsp; Changes</Button>}
                            </Col>
                            <Col>
                                <div style={{
                                    visibility: this.props.dailyInput.loadingForTemplate === true ? "visible" :
                                    this.props.dailyInput.errMessForTemplate !== null ? "visible" :
                                    this.props.dailyInput.responseForTemplate !== null ? "visible" : "hidden",
                                    display: this.props.dailyInput.loadingForTemplate === true ? "contents" :
                                    this.props.dailyInput.errMessForTemplate !== null ? "contents" :
                                    this.props.dailyInput.responseForTemplate !== null ? "contents" : "none"
                                }}>
                                    {
                                        this.props.dailyInput.loadingForTemplate === true ? <Loading /> :
                                        this.props.dailyInput.errMessForTemplate !== null ? <div style={{color: 'red'}}>{this.props.dailyInput.errMessForTemplate.message}</div> :
                                        <div style={{color: "green"}}>
                                            {this.props.dailyInput.responseForTemplate !== null ? this.props.dailyInput.responseForTemplate.data : ""}
                                        </div>
                                    }
                                </div>
                            </Col> */}
                        {/* </Row> */}
                    </Col>
                    <Col md={2} lg={2}>
                        {this.props.dailyInput.responseForTemplate !== null ? <Button size='sm' outline color="primary" disabled={true} onClick={this.putSpreadsheet}>Save&nbsp; Changes</Button> : <Button size='sm' outline color="primary" onClick={this.putSpreadsheet}>Save&nbsp; Changes</Button>}
                    </Col>
                    <Col md={4} lg={4}>
                        <div style={{
                            visibility: this.props.dailyInput.loadingForTemplate === true ? "visible" :
                            this.props.dailyInput.errMessForTemplate !== null ? "visible" :
                            this.props.dailyInput.responseForTemplate !== null ? "visible" : "hidden",
                            display: this.props.dailyInput.loadingForTemplate === true ? "contents" :
                            this.props.dailyInput.errMessForTemplate !== null ? "contents" :
                            this.props.dailyInput.responseForTemplate !== null ? "contents" : "none"
                        }}>
                            {
                                this.props.dailyInput.loadingForTemplate === true ? <Loading /> :
                                this.props.dailyInput.errMessForTemplate !== null ? <div style={{color: 'red'}}>{this.props.dailyInput.errMessForTemplate.message}</div> :
                                <div style={{color: "green"}}>
                                    {this.props.dailyInput.responseForTemplate !== null ? this.props.dailyInput.responseForTemplate.data : ""}
                                </div>
                            }
                        </div>
                    </Col>
                    <Col md={2} lg={2}>
                        <Button size="sm" outline color="success" style={{display: "inline-block", float: "right"}} onClick={this.allDataLastYear}>Show All Data Last Year</Button><br />
                    </Col>
                </Row>
            </>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpreadsheetComponentCreator);