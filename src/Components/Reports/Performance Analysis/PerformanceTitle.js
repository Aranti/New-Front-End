import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        marginTop: 24,
        justifyContent: 'center',
        textAlign: 'center'
    },
    performanceTitle: {
        color: "#4974A5",
        letterSpacing: 2,
        fontSize: 20,
        textAlign: "center",
        textTransform: "uppercase",
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

const PerformanceTitle = ({ title }) => {
    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.performanceTitle}>{title}</Text>
            </View>
        </>
    )
    
}

export default PerformanceTitle;