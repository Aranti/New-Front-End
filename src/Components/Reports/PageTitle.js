import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        marginTop: 24
    },
    pageTitle: {
        color: "#4974A5",
        letterSpacing: 4,
        fontSize: 21,
        textAlign: "center",
        textTransform: "uppercase",
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

const PageTitle = ({ title }) => {
    return (
        <>
            <View style={styles.titleContainer}>
                <Text style={styles.pageTitle}>{title}</Text>
            </View>
        </>
    )
    
}

export default PageTitle;