import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line, Annotation } from 'react-simple-maps';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

class Map extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ComposableMap>
                <ZoomableGroup center={[100, 10]} zoom={6}>
                    <Geographies geography={geoUrl}>
                        {
                            ({ geographies } ) => {
                                return (
                                    geographies.map((geo) => {
                                        return (
                                            <Geography key={geo.rsmKey} geography={geo} />
                                        )
                                    })
                                )
                            }
                        }
                    </Geographies>
                    <Marker coordinates={[108.661282, 19.111967]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Marker coordinates={[109.220123, 13.758658]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Marker coordinates={[109.196429, 8.903310]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Marker coordinates={[108.373542, 3.927219]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Marker coordinates={[109.509317, -1.125664]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Marker coordinates={[111.872296, -3.419807]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Marker coordinates={[114.714766, -4.144171]}>
                        <circle r={1} fill="#F53" />
                    </Marker>
                    <Line
                        from={[108.661282, 19.111967]}
                        to={[109.220123, 13.758658]}
                        stroke="#FF5533"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                    <Line
                        from={[109.220123, 13.758658]}
                        to={[109.196429, 8.903310]}
                        stroke="#FF5533"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                    <Line
                        from={[109.196429, 8.903310]}
                        to={[108.373542, 3.927219]}
                        stroke="#FF5533"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                    <Line
                        from={[108.373542, 3.927219]}
                        to={[109.509317, -1.125664]}
                        stroke="#FF5533"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                    <Line
                        from={[109.509317, -1.125664]}
                        to={[111.872296, -3.419807]}
                        stroke="#FF5533"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                    <Line
                        from={[111.872296, -3.419807]}
                        to={[114.714766, -4.144171]}
                        stroke="#FF5533"
                        strokeWidth={1}
                        strokeLinecap="round"
                    />
                    <Annotation
                        subject={[108.661282, 19.111967]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-7" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"China"}</text>
                    </Annotation>
                    <Annotation
                        subject={[109.220123, 13.758658]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-6" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"Vietnam"}</text>
                    </Annotation>
                    <Annotation
                        subject={[109.196429, 8.903310]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-5" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"South China Sea"}</text>
                    </Annotation>
                    <Annotation
                        subject={[108.373542, 3.927219]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-4" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"Riau, Indonesia"}</text>
                    </Annotation>
                    <Annotation
                        subject={[109.509317, -1.125664]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-3" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"Pulau Maya, Indonesia"}</text>
                    </Annotation>
                    <Annotation
                        subject={[111.872296, -3.419807]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-2" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"Central Kalimantan"}</text>
                    </Annotation>
                    <Annotation
                        subject={[114.714766, -4.144171]}
                        dx={-10}
                        dy={-10}
                        connectorProps={{
                            stroke: "white",
                            strokeWidth: 1,
                            strokeLinecap: "arrow"
                        }}
                    >
                        <text x="-1" textAnchor="end" alignmentBaseline="middle" fill="white" fontSize={5}>{"Tanah Laut"}</text>
                    </Annotation>
                </ZoomableGroup>
            </ComposableMap>
        )
    }
}

export default Map;