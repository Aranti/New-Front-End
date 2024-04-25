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
        width: '12.5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontSize: 7
    }
});

const PerformanceHeader = (data) => {
    // console.log("DATA!!!!!!!!!!!!", data['data']['data'])
    return (
        <>
            <View style={styles.container}>
                {
                    data&&Object.keys(data['data']['data'][0]).map(key => {
                        return (
                            <Text key={key} style={styles.header}>{key}</Text>
                        )
                    })
                }
            </View>
        </>
    )
}

export default PerformanceHeader;