import React from 'react';
import { Page, Document, Image, StyleSheet, View, Text, PDFViewer } from '@react-pdf/renderer';
import ReportTitle from '../ReportTitle';
import ReportVesselName from '../ReportVesselName';
import PeriodHeader from './PeriodHeader';
import PeriodTitle from './PeriodTitle';
import PeriodTable from './PeriodData';
import logo from '../logo.png'

const stylesForPdf = StyleSheet.create({
    page: {
        backgroundColor: "#d0faff",
        color: "#4974A5"
    },
    section: {
        margin: "auto",
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
    },
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#3778C2',
    }
});

class SelectedPeriod extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            outlier_dates: null,
            operational_dates: null,
            spe_dates: null
        }

        this.getDatesFromData = this.getDatesFromData.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // if(prevProps.reports.selected_period_data !== this.props.reports.selected_period_data) {
        //     let outlier_dates = this.getDatesFromData(this.props.reports.selected_period_data['Outliers'])
        //     let operational_dates = this.getDatesFromData(this.props.reports.selected_period_data['Operational'])
        //     let spe_dates = this.getDatesFromData(this.props.reports.selected_period_data['SPE'])

        //     this.setState({
        //         outlier_dates: outlier_dates,
        //         operational_dates: operational_dates,
        //         spe_dates: spe_dates
        //     })
        // }
    }

    getDatesFromData = (data) => {
        console.log("IN FUNCTION!!!!!!", data)
        let dates_list = []
        for(let i=0;i<data.length;i++) {
            Object.keys(data[0]).map(key => {
                dates_list.push(key)
            })
        }
    }

    render() {
        return (
            <PDFViewer style={stylesForPdf.viewer}>
                <Document>
                    <Page size={"A4"} style={stylesForPdf.page}>
                        <Image style={stylesForPdf.logo} src={logo} />
                        <ReportTitle title={"Selected Period Report"} />
                        <ReportVesselName title={this.props.fromDate + " to " + this.props.toDate} />
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    {/* <Page size={"A4"} style={stylesForPdf.page}>
                        <View style={stylesForPdf.tableContainer}>
                            <PeriodTitle title={"Outliers"} />
                            <PeriodHeader data={this.props.data["Outliers"]} />
                            <PeriodTable data={this.props.data['Outliers']} />
                        </View>
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page> */}
                    <Page size={"A4"} style={stylesForPdf.page}>
                        <View style={stylesForPdf.tableContainer}>
                            
                            <View style={stylesForPdf.section}>
                                {
                                    this.props.outlier_dates.map(dates => {
                                        return (
                                            <>
                                                <Text key={dates}>{dates}</Text>
                                                <PeriodTitle title={"Outliers"} />
                                                <PeriodHeader/>
                                                <PeriodTable
                                                    data={this.props.data['Outliers']}
                                                    exp={this.props.data['Outlier Exp']}
                                                    date={dates}
                                                />
                                                <PeriodTitle title={"Operational"} />
                                                <PeriodHeader/>
                                                <PeriodTable
                                                    data={this.props.data['Operational']}
                                                    exp={this.props.data['Operational Exp']}
                                                    date={dates}
                                                />
                                                <PeriodTitle title={"SPE"} />
                                                <PeriodHeader/>
                                                <PeriodTable
                                                    data={this.props.data['SPE']}
                                                    exp={this.props.data['SPE Exp']}
                                                    date={dates}
                                                />
                                            </>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </Page>
                    {/* <Page size={"A4"} style={stylesForPdf.page}>
                        <PeriodTitle title={"Operational"} />
                        <View style={stylesForPdf.tableContainer}>
                            
                            <View style={stylesForPdf.section}>
                                {
                                    this.props.operational_dates.map(dates => {
                                        return (
                                            <>
                                                <Text key={dates}>{dates}</Text>
                                                <PeriodHeader/>
                                                <PeriodTable
                                                    data={this.props.data['Operational']}
                                                    exp={this.props.data['Operational Exp']}
                                                    date={dates}
                                                />
                                            </>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </Page>
                    <Page size={"A4"} style={stylesForPdf.page}>
                        <PeriodTitle title={"SPE"} />
                        <View style={stylesForPdf.tableContainer}>
                            
                            <View style={stylesForPdf.section}>
                                {
                                    this.props.spe_dates.map(dates => {
                                        return (
                                            <>
                                                <Text key={dates}>{dates}</Text>
                                                <PeriodHeader/>
                                                <PeriodTable
                                                    data={this.props.data['SPE']}
                                                    exp={this.props.data['SPE Exp']}
                                                    date={dates}
                                                />
                                            </>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    </Page> */}


                    {/* <Page size={"A4"} style={stylesForPdf.page}>
                        <View style={stylesForPdf.tableContainer}>
                            <PeriodTitle title={"Operational"} />
                            <PeriodHeader data={this.props.data["Operational"]} />
                            <PeriodTable data={this.props.data['Operational']} />
                        </View>
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                    <Page size={"A4"} style={stylesForPdf.page}>
                        <View style={stylesForPdf.tableContainer}>
                            <PeriodTitle title={"SPE"} />
                            <PeriodHeader data={this.props.data["SPE"]} />
                            <PeriodTable data={this.props.data['SPE']} />
                        </View>
                        <Text style={stylesForPdf.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page> */}

                    
                </Document>
            </PDFViewer>
        )
    }
}

export default SelectedPeriod;