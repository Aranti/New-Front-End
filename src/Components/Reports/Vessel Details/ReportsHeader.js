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
    header: {
        width: '100%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    }
});

const ReportsHeader = () => {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Vessel Details</Text>
            </View>
        </>
    )
}

export default ReportsHeader;