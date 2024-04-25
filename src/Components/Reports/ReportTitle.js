import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        marginTop: 24
    },
    reportTitle: {
        color: "#4974A5",
        letterSpacing: 2,
        fontSize: 25,
        textAlign: "center",
        textTransform: "uppercase",
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

const ReportTitle = ({ title }) => {
    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.reportTitle}>{title}</Text>
            </View>
        </>
    )
    
}

export default ReportTitle;