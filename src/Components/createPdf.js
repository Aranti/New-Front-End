import { Document, Page, Text, View, StyleSheet,PDFViewer } from "@react-pdf/renderer";
import MakeTable from "./Daily/MakeTable";
import React from 'react';
import { connect } from 'react-redux';

// const styles = StyleSheet.create({
//     page: {
//         backgroundColor: "#d11fb6",
//         color: "white"
//     },
//     section: {
//         margin: 10,
//         padding: 10
//     },
//     viewer: {
//         width: window.innerWidth,
//         height: window.innerHeight
//     }
// });

// const mapStateToProps = state => {
//     return {
//         dailyCollapsible: state.dailyCollapsible,
//         dailyData: state.dailyData
//     }
// }

export const pdfCreator = (categorySelection, dailyData) => {
    return (
        <MakeTable
            dailyData={dailyData}
            categorySelection={categorySelection}
        />
    )
}

// class PdfCreator extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <PDFViewer style={styles.viewer}>
//                 <MakeTable
//                     dailyData={this.props.dailyData}
//                     categorySelection={this.props.dailyCollapsible.collapsibleValue}
//                 />
//             </PDFViewer>
//         )
//     }
// }

// export default connect(mapStateToProps)(PdfCreator);