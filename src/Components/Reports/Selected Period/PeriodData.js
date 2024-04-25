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
        textAlign: 'center'
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
        width: '25%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
        color: 'black',
        fontSize: 7
    },
    textColumn: {
        width: '40%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
        color: 'black',
        fontSize: 7
    },
    numColumn: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
        color: 'black',
        fontSize: 7
    },
});

const PeriodTable = ({data, exp, date}) => {
    console.log("DATA GOT!!!!!!", data, exp, date)
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

    let rows;

    // for(let list_key=0;list_key<data['data'].length;list_key++) {
    return (
        Object.keys(data).map(list_key => {
            return (
                Object.keys(data[list_key]).map(key => {
                    if(key === date) {
                        return (
                            Object.keys(data[list_key][key]).map(keys => {
                                console.log("KEYS!!!!!", key, keys)
                                console.log("TYPE!!!!!!", typeof data[list_key][key], data[list_key][key])
                                return (
                                    Object.keys(data[list_key][key][keys]).map(key_again => {
                                        return (
                                            <View style={styles.row} key={list_key}>
                                                <Text style={styles.textColumn} key={key}>{key_again}</Text>
                                                <Text style={styles.numColumn} key={key}>{data[list_key][key][keys][key_again]}</Text>
                                                <Text style={styles.numColumn} key={key}>{exp[list_key][key][keys][key_again][0]}</Text>
                                                <Text style={styles.textColumn} key={key}>{exp[list_key][key][keys][key_again][1]}</Text>
                                            </View>
                                        )
                                    })
                                )
                                
                            })
                        )
                    }
                    
                })
            )
        })
    )

    //     rows = <View style={styles.row} key={list_key}>
    //         {
    //             Object.keys(data['data'][list_key]).map(key => {
    //                 return (
    //                     <Text style={styles.value} key={key}>{key}</Text>
    //                 )
    //             })
    //         }
    //         {
    //             Object.keys(data['data'][list_key]).map(key => {
    //                 return (
    //                     Object.keys(data['data'][list_key][key]).map(keys => {
    //                         return (
    //                             <Text style={styles.value} key={key}>{keys}</Text>
    //                         )
    //                     })
    //                 )
    //             })
    //         }
    //     </View>
    // }

    // const rows = Object.keys(data).map(num=> {
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
    // })

    // return (
    //     <>
    //         {rows}
    //     </>
    // )
}

export default PeriodTable;