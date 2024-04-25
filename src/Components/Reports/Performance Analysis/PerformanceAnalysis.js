import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import PerformanceTitle from './PerformanceTitle';
import PerformanceHeader from './PerformanceHeader';
import PerformanceTable from './PerformanceTable';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#3778C2',
    }
})

const PerformanceAnalysis = (data) => {
    return (
        <>
            <View style={styles.tableContainer}>
                <PerformanceTitle title={'Data Points For Performance Analysis'} />
                <PerformanceHeader data={data} />
                <PerformanceTable data={data} />
            </View>
        </>
    )
}

export default PerformanceAnalysis;