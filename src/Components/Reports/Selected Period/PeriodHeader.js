import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';


const borderColor = '#3778C2';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#3778C2',
        backgroundColor: '#3778C2',
        color: '#fff',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    textHeader: {
        width: '40%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontSize: 7
    },
    numHeader: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontSize: 7
    }
});

const PeriodHeader = () => {
    const headers = ['Name', 'Observed', 'Expected', 'Comment']
    // console.log(typeof data['data'][0], data['data'][0])
    return (
        <>
            <View style={styles.container}>
                {/* {
                    headers.map(key => {
                        console.log(key)
                        return (
                            <Text key={key} style={styles.header}>{key}</Text>
                        )
                    })
                } */}
                <Text style={styles.textHeader}>{'Name'}</Text>
                <Text style={styles.numHeader}>{'Observed'}</Text>
                <Text style={styles.numHeader}>{'Expected'}</Text>
                <Text style={styles.textHeader}>{'Comment'}</Text>
            </View>
        </>
    )
}

export default PeriodHeader;