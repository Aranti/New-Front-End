import React from 'react';
import { Page, Document, Image, StyleSheet, View, Text, PDFViewer } from '@react-pdf/renderer';
import loadedJson from './Voyage_Performance_Report_Loaded.json';
import ballastJson from './Voyage_Performance_Report_Ballast.json';
import ReportTitle from './ReportTitle';
import ReportVesselName from './ReportVesselName';
import ReportVesselDetails from './Vessel Details/ReportVesselDetails';
import PerformanceAnalysis from './Performance Analysis/PerformanceAnalysis';
import WeatherData from './Weather Data/WeatherData';
import FuelConsumption from './Fuel Oil Consumption/FuelConsumption';
import PageTitle from './PageTitle';
import ReportsMisc from './ReportsMisc';
import logo from './logo.png';

const stylesForPdf = StyleSheet.create({
    page: {
        backgroundColor: "#d0faff",
        color: "#4974A5"
    },
    section: {
        margin: 10,
        padding: 10
    },
    viewer: {
        width: 1000,
        height: 1000,
        margin: 5
    },
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 5,
        marginBottom: 5
    },
    image: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 5,
        marginHorizontal: 5,
        marginTop: 10,
        marginBottom: 10
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    }
});

class PDFDocument extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PDFViewer style={stylesForPdf.viewer}>
                <Document>
                    <Page size={"A4"} style={stylesForPdf.page}>
                        <Image style={stylesForPdf.logo} src={logo} />
                        <ReportTitle title={this.props.data['Title']} />
                        <ReportVesselName title={this.props.data['Loaded']['Vessel Details']['Name of Vessel']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    <Page size={'A4'} style={stylesForPdf.page}>
                        <PageTitle title={"LADEN DATA"} />
                        <ReportVesselDetails details={this.props.data['Loaded']['Vessel Details']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    {/* {this.props.data['Loaded']['Data Points For Performance Analysis'] !== [] && <Page size={'A4'} style={stylesForPdf.page}> */}
                    {this.props.data['Loaded']['Data Points For Performance Analysis'].length !== 0 && <Page size={'A4'} style={stylesForPdf.page}>
                        <PerformanceAnalysis data={this.props.data['Loaded']['Data Points For Performance Analysis']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>}
                    {/* {this.props.data['Loaded']['Weather Data Along the Sailing Route From OSCAR, NOAA, OSTIA'] !== [] && <Page size={'A4'} style={stylesForPdf.page}> */}
                    {this.props.data['Loaded']['Weather Data Along the Sailing Route From OSCAR, NOAA, OSTIA'].length !== 0 && <Page size={'A4'} style={stylesForPdf.page}>
                        <WeatherData data={this.props.data['Loaded']['Weather Data Along the Sailing Route From OSCAR, NOAA, OSTIA']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>}
                    {/* {this.props.data['Loaded']['Fuel Oil Consumption'] !== [] && <Page size={'A4'} style={stylesForPdf.page}> */}
                    {this.props.data['Loaded']['Fuel Oil Consumption'].length !== 0 && <Page size={'A4'} style={stylesForPdf.page}>
                        <FuelConsumption data={this.props.data['Loaded']['Fuel Oil Consumption']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                        {/* <ReportsMisc name={'Good Weather Days: '} value={loadedJson['Good Weather Days']} />
                        <ReportsMisc name={'Non Sailing Days Before Voyage: '} value={loadedJson['Non Sailing Days Before Voyage']} />
                        <ReportsMisc name={'Sea Water Temperature: '} value={loadedJson['Sea Water Temperature']} /> */}
                    </Page>}

                    <Page size={'A4'} style={stylesForPdf.page}>
                        <Image
                            source={this.props.baseline_actual_loaded}
                            style={stylesForPdf.image}
                        />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    <Page size={'A4'} style={stylesForPdf.page}>
                        <Image
                            source={this.props.percentage_diff_loaded}
                            style={stylesForPdf.image}
                        />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    <Page size={'A4'} style={stylesForPdf.page}>
                        <Image
                            source={this.props.baseline_actual_speed_loaded}
                            style={stylesForPdf.image}
                        />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    

                    <Page size={'A4'} style={stylesForPdf.page}>
                        <PageTitle title={"BALLAST DATA"} />
                        <ReportVesselDetails details={this.props.data['Ballast']['Vessel Details']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    {/* {this.props.data['Ballast']['Data Points For Performance Analysis'] !== [] && <Page size={'A4'} style={stylesForPdf.page}> */}
                    {this.props.data['Ballast']['Data Points For Performance Analysis'].length !== 0 && <Page size={'A4'} style={stylesForPdf.page}>
                        <PerformanceAnalysis data={this.props.data['Ballast']['Data Points For Performance Analysis']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>}
                    {/* {this.props.data['Ballast']['Weather Data Along the Sailing Route From OSCAR, NOAA, OSTIA'] !== [] && <Page size={'A4'} style={stylesForPdf.page}> */}
                    {this.props.data['Ballast']['Weather Data Along the Sailing Route From OSCAR, NOAA, OSTIA'].length !== 0 && <Page size={'A4'} style={stylesForPdf.page}>
                        <WeatherData data={this.props.data['Ballast']['Weather Data Along the Sailing Route From OSCAR, NOAA, OSTIA']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>}
                    {/* {this.props.data['Ballast']['Fuel Oil Consumption'] !== [] && <Page size={'A4'} style={stylesForPdf.page}> */}
                    {this.props.data['Ballast']['Fuel Oil Consumption'].length !== 0 && <Page size={'A4'} style={stylesForPdf.page}>
                        <FuelConsumption data={this.props.data['Ballast']['Fuel Oil Consumption']} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                        {/* <ReportsMisc name={'Good Weather Days: '} value={ballastJson['Good Weather Days']} />
                        <ReportsMisc name={'Non Sailing Days Before Voyage: '} value={ballastJson['Non Sailing Days Before Voyage']} />
                        <ReportsMisc name={'Sea Water Temperature: '} value={ballastJson['Sea Water Temperature']} /> */}
                    </Page>}
                    <Page size={'A4'} style={stylesForPdf.page}>
                        <Image
                            source={this.props.baseline_actual_ballast}
                            style={stylesForPdf.image}
                        />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    <Page size={'A4'} style={stylesForPdf.page}>
                        <Image
                            source={this.props.percentage_diff_ballast}
                            style={stylesForPdf.image}
                        />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    <Page size={'A4'} style={stylesForPdf.page}>
                        <Image
                            source={this.props.baseline_actual_speed_ballast}
                            style={stylesForPdf.image}
                        />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    

                    
                </Document>
            </PDFViewer>
        )
    }
}

export default PDFDocument;