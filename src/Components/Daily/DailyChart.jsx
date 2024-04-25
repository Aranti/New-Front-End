import React from 'react';
import blockConfig from '../../models/blockConfiguration.json';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import allFields from '../../models/allBlockFields.json';
import axios from 'axios';

function am4themes_myTheme(target) {
    if (target instanceof am4core.ColorSet) {
      target.list = [
        am4core.color("#4CB5F5"),
        am4core.color("#B7B8B6"),
        am4core.color("#34675C"),
        am4core.color("#B3C100"),
        am4core.color("#DE7A22"),
        am4core.color("#F4CC70"),
        am4core.color("#8D230F"),
        am4core.color("#9B4F0F"),
        am4core.color("#C99E10"),
        am4core.color("#5D535E"),
        am4core.color("#EC96A4"),
        am4core.color("#011A27"),
        am4core.color("#C05805"),
        am4core.color("#E4EA8C"),
        am4core.color("#4D85BD"),
      ];
    }
  }
  // am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_myTheme);
  
  // type Props = {
  //     field:any;
  //     blockArray:any;
  // };
  
  // type State={
  //     field:any;
  //     selectedFields:any[];
  //     actualData:any[];
  // }
  export default class DailyChart extends React.Component {
      // chart: am4charts.XYChart = null;
      
      state={
          field:"",
          selectedFields:[],
          selected:[],
          blockCount:1,
          responseAPI:{}
      }
  
      async componentDidMount(){
         
        axios.get("https://online-predictions2.ml/daily_data")
        .then(res => {
          const responseAPI = res.data;
          
          console.log(responseAPI);
          return responseAPI;
          // this.setState({ responseAPI });
        })
        .then(responseAPI=> {
          this.dailyDataFormatter(this.props.blockArray);
          console.log(responseAPI);
          this.setState({responseAPI});
        })
        .then((responseAPI)=>{
          const actualData = this.getData1();
          return actualData;
          
        })
        .then(actualData=>{
         
          this.initChart(actualData)
        })
        .catch(err=>console.log(err))
        // console.log("bb",this.props.blockArray)
  
          this.setState({field:this.props.field})
  
          // this.setState({field:this.props.field})
  
          // await this.dailyDataFormatter(this.props.blockArray);
  
          // await this.getData1()
         
          // await this.initChart(this.state.selectedFields)
      }
  
      async componentDidUpdate(prevProps, prevState) {
          if (prevProps.field !== this.props.field) {
  
              await this.dailyDataFormatter(this.props.blockArray);
  
              await this.getData1()
         
              await this.initChart(this.state.selectedFields)
          }
          }
  
        dailyDataFormatter=(blocks)=>{
  
              let demo=[];
             
              blocks.map((oneBlock,index)=>{
                  blockConfig.data.map((entry)=>{
                      if (oneBlock==Object.keys(entry)){
                         demo.push(entry);
                         }
                  })
                  
              if (index==blocks.length-1)
              {
                  this.setState({selected:demo,blockCount:blocks.length});
                 
              }
              })
              
          }
     
      getData1=()=>{
  
          let actualData=[];
  
          this.state.responseAPI.data && this.state.responseAPI.data.map((level,index)=>{
  
              let obj={};
              obj.date = level.date.substr(0,level.date.indexOf(' '));
  
              level.data.map(level1=>{
                  
  
                  level1.included_identifiers.map(element=>{
                     const a = element;
                     if (allFields.data.includes(element)){
                              
                              
                              level1.data.map(it=>{
                                 it.rows.map(one=>{
                                     
                                  if (one.identifier == element ){ 
                                    if (one.reported_norm!=="") 
                                    {
                                       obj[element] = one.reported_norm ;
                                       obj[element+"_actual"] = one.reported;
                                      //  obj[element+"_name"] = one.name_short;
                                       obj[element+"_name"] = one.name;
  
                                    }
                                     else
                                    {
                                       obj[element] = one.reported_norm="0";
                                       obj[element+"_actual"] = one.reported="0";
                                    }
                                           
                                  }
                                 })
                              })
                             
                          
                      }
                  })
              })
          
              actualData.push(obj);
  
              if (index==this.state.responseAPI.data.length-1)
              {
                  this.setState({selectedFields:actualData});
                 
              }
          })
          return actualData;
  }
  
       initChart=(data)=>{
        am4core.disposeAllCharts();
        // document.getElementById
        let container = am4core.create("chartdiv", am4core.Container);
        container.layout = "vertical";
        container.width = am4core.percent(100);
        let target = 700*(this.state.blockCount);
        container.height = target;
        document.getElementById("chartdiv").style.height = `${target}px`;
  
        let chart = container.createChild(am4charts.XYChart);
          chart.colors.step = 2;
  
          chart.data = data;
          
          console.log("h",chart.data)
  
           
  
       
            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 40;
            // Create series
            categoryAxis.renderer.labels.template.dy = -(target-100);
            categoryAxis.layout = "absolute";
            // categoryAxis.renderer.labels.template.dy = -600;
            // categoryAxis.layout = "absolute";
  
          //   this.props.blockArray.map((oneBlock)=>{
          //     blockConfig.data.map((entry)=>{
          //         count=count+1;
          //         if (oneBlock==Object.keys(entry) && count<=1){
          //              console.log(Object.values(entry),"ooooooo");
          //              createSeriesAndAxis(Object.values(entry), `Block ${oneBlock}`, true, true);
          //           }
          //     })
          // })
  
         
  
  
            function createSeriesAndAxis(field, name, topMargin, bottomMargin) {
              var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  
              var seriesArray=[];
  
            for(var i=0;i<field.length;i++){
              var series = chart.series.push(new am4charts.LineSeries());
              
              series.dataFields.valueY = field[i];
              series.dataFields.dateX = "date";
              series.name = field[i];
              // series.tooltipText = "{dateX}: [b] {name} : {valueY}[/]";
              series.strokeWidth = 2;
              series.yAxis = valueAxis;
              
              valueAxis.renderer.labels.template.disabled = true;
  
              
              valueAxis.renderer.line.strokeOpacity = 1;
              valueAxis.renderer.line.stroke = series.stroke;
              valueAxis.renderer.grid.template.stroke = series.stroke;
              valueAxis.renderer.grid.template.strokeOpacity = 0.1;
              valueAxis.renderer.labels.template.fill = series.stroke;
              valueAxis.renderer.minGridDistance = 20;
              valueAxis.align = "right";
              valueAxis.title.text=name;
  
                seriesArray.push(series);
  
  
              if (i==field.length-1){
                  series.adapter.add("tooltipText", function(ev,target) {
                  var text = "[bold]{dateX}[/]\n";
  
                  var data1 = target.tooltipDataItem.dataContext;
                    console.log(seriesArray,"llllllllllllll");
                    console.log(data1,"pp")
                  seriesArray.map(function(item) {
                    var actualValue= data1[item.name+"_actual"];
                    text += "[" + item.stroke.hex + "]●[/] " + data1[item.name+"_name"] + ": [bold]" + actualValue + "\n";
                  });
              return text;
            })}
          }
  
             
              series.tooltip.getFillFromObject = false;
                  series.tooltip.background.fill = am4core.color("#fff");
                  series.tooltip.label.fill = am4core.color("#00");
  
  
  
              if (topMargin && bottomMargin) {
                valueAxis.marginTop = 30;
                valueAxis.marginBottom = 30;
              }
              else {
                if (topMargin) {
                  valueAxis.marginTop = 20;
                }
                if (bottomMargin) {
                  valueAxis.marginBottom = 20;
                }
              }
              
              
            }
  
            var scrollbarX = new am4charts.XYChartScrollbar();
            chart.scrollbarX = scrollbarX;
            chart.scrollbarX.minHeight = 30;
  
  
          
  
            this.state.selected.map(single=>{
  
              console.log(Object.values(single)[0])
                createSeriesAndAxis(Object.values(single)[0],`Block ${Object.keys(single)[0]}`, true, true)
            })
  
            // chart.legend = new am4charts.Legend();
            chart.cursor = new am4charts.XYCursor();
            chart.leftAxesContainer.layout = "vertical";
  
            categoryAxis.renderer.labels.template.paddingBottom = 0;
            categoryAxis.renderer.labels.template.paddingTop = 0;
            categoryAxis.renderer.labels.template.paddingLeft = 0;
            categoryAxis.renderer.labels.template.paddingRight = 0;
            chart.marginBottom=0;
            chart.marginTop=0;
  }
  
      render(){
          return (
              
              <div  class="card">
                
                  <h1
                      style={{
                        textAlign: "center",
                        marginTop: "7px",
                        marginBottom : "-13px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      {this.props.field}
                    </h1>
                    {this.state.responseAPI && (<div className="outerChartDivEngine"><div id='chartdiv' style={{ width: '98%', height: '100%'  }}></div></div>)}
             
              </div>
          )
      }
  }