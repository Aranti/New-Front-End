import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
        color: 'black',
        fontSize: 10,
        paddingLeft: 8
    },
    name: {
        width: '25%',
        textAlign: 'left',
        color: 'black',
        paddingLeft: 8,
        // fontSize: 5
    },
    value: {
        width: '75%',
        textAlign: 'left',
        color: 'black',
        paddingLeft: 8,
        // fontSize: 5
    }
})

const ReportsMisc = ({name, value}) => {
    return (
        <>
            <View style={styles.container}>
                <Text styles={styles.name}>{name}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </>
    )
}

export default ReportsMisc;