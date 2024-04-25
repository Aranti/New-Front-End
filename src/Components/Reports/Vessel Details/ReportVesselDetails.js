import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { Table } from 'react-bootstrap';
import ReportsHeader from './ReportsHeader';
import ReportsTable from './ReportsTable';

const styles = StyleSheet.create({
    // tableHeader: {
    //     color: 'white',
    //     backgroundColor: 'darkgray'
    // },
    // tableBody: {
    //     color: 'white',
    //     backgroundColor: 'darkblue'
    // },
    // tablecss: {
    //     marginLeft: 'auto',
    //     marginRight: 'auto',
    //     textAlign: 'center',
    //     tableLayout: 'fixed',
    //     wordWrap: 'break-word'
    // },
    // headerView: {
    //     marginLeft: 'auto',
    //     marginRight: 'auto',
    //     display: 'flex',
    //     flexDirection: 'row',
    //     borderBottomColor: '#bff0fd',
    //     backgroundColor: '#bff0fd',
    //     borderBottomWidth: 1,
    //     alignItems: 'center',
    //     height: 2,
    //     height: "10px",
    //     textAlign: 'center',
    //     fontStyle: 'bold',
    //     flexGrow: 1
    // },
    // table: {
    //     display: 'none'
    // },
    // column: {
    //     flexDirection: 'column',
    //     marginBottom: '1px',
    //     width: '100%',
    //     padding: "1px",
    //     border: '1px solid black'
    // },
    // row: {
    //     border: '1px black solid',
    //     height: '10px',
    //     margin: 'auto',
    //     width: '100%',
    //     display: 'flex',
    //     maxWidth: '100%'
    // }
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#3778C2',
    },
});

const ReportVesselDetails = ({details}) => {
    return (
        <>
            {/* <View>
                <Text>
                    <Table bordered hover style={styles.tablecss}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th>{"Vessel Details"}</th>
                            </tr>
                        </thead>
                        <tbody style={styles.tableBody}>
                            {
                                Object.keys(details).map(key => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{key}</td>
                                                <td>{details[key]}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Text>
            </View> */}
            <View style={styles.tableContainer}>
                <ReportsHeader />
                <ReportsTable details={details} />
            </View>
        </>
    )
}

export default ReportVesselDetails;