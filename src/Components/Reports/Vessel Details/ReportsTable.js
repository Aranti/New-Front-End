import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#3778C2';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#3778C2',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    name: {
        width: '50%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
        color: 'black'
    },
    value: {
        width: '50%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
        color: 'black'
    },
});

const ReportsTable = ({details}) => {
    // console.log(details);
    const rows = Object.keys(details).map(key => {
        return (
            <View style={styles.row} key={key}>
                <Text style={styles.name}>{key}</Text>
                <Text style={styles.value}>{details[key]}</Text>
            </View>
        )
    });

    // console.log(rows)

    return (
        <>
            {rows}
        </>
    )
}

export default ReportsTable;