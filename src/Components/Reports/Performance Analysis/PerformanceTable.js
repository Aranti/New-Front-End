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
    // name: {
    //     width: '50%',
    //     textAlign: 'left',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     paddingLeft: 8,
    //     color: 'black'
    // },
    value: {
        width: '12.5%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
        color: 'black',
        fontSize: 7
    },
});

const PerformanceTable = (data) => {
    console.log(typeof data)
    // for(let num=0;num<data.length;num++) {
    //     return (
    //         <View style={styles.row} key={num}>
    //             {
    //                 Object.keys(data[num]).map(key => {
    //                     return (
    //                         <Text style={styles.value} key={key}>{data[num][key]}</Text>
    //                     )
    //                 })
    //             }
    //         </View>
    //     )
    // };

    const rows = data && Object.keys(data['data']['data']).map(num=> {
        return (
            <View style={styles.row} key={num}>
                {
                    Object.keys(data['data']['data'][num]).map(key => {
                        return (
                            <Text style={styles.value} key={key}>{data['data']['data'][num][key]}</Text>
                        )
                    })
                }
            </View>
        )
    })

    return (
        <>
            {rows}
        </>
    )
}

export default PerformanceTable;