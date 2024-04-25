import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import WeatherTitle from './WeatherTitle';
import WeatherHeader from './WeatherHeader';
import WeatherTable from './WeatherTable';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#3778C2',
    }
})

const WeatherData = (data) => {
    return (
        <>
            <View style={styles.tableContainer}>
                <WeatherTitle title={'Weather Data Along the Sailing Route'} />
                <WeatherHeader data={data} />
                <WeatherTable data={data} />
            </View>
        </>
    )
}

export default WeatherData;