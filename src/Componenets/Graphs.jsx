import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const styles = StyleSheet.create({
  page: { flexDirection: 'row', padding: 20 },
  graphContainer: { flex: 1, marginBottom: 15, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  graphView: { border: '1px dashed #000', padding: 15 },
  graphTitle: { fontSize: 16, marginBottom: 5, textAlign: 'center', marginTop: 5 },
});

const Graphs = React.forwardRef(({ isVisible, datasets }, ref) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page} ref={ref}>
        {datasets.map((data, index) => (
          <View key={index} style={styles.graphContainer}>
            <Text style={styles.graphTitle}>{`Graph ${index + 1}`}</Text>
            <View style={styles.graphView}>
              <LineChart width={460} height={250} data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
              </LineChart>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
});

export default Graphs;