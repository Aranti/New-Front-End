import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import FuelTitle from './FuelTitle';
import FuelHeader from './FuelHeader';
import FuelTable from './FuelTable';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#3778C2',
    }
})

const FuelConsumption = (data) => {
    return (
        <>
            <View style={styles.tableContainer}>
                <FuelTitle title={'Fuel Oil Consumption'} />
                <FuelHeader data={data} />
                <FuelTable data={data} />
            </View>
        </>
    )
}

export default FuelConsumption;