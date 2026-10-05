// S22 — Data Export
// Export drink data as CSV, JSON, or report

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { exportToCSV, exportToJSON, exportReport } from '../services/dataExportImport';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const DataExportScreen: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'json' | 'report' | null>(null);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setExportType('csv');
      const blob = await exportToCSV();
      if (blob) {
        await Share.share({
          url: `data:text/csv;base64,${blob}`,
          title: 'Drinks Export',
          message: 'Your drink data export (CSV)',
        });
        Alert.alert('Success', 'Data exported as CSV');
      } else {
        Alert.alert('Error', 'Failed to export CSV');
      }
    } catch (error) {
      console.error('Export CSV error:', error);
      Alert.alert('Error', 'Failed to export CSV');
    } finally {
      setExporting(false);
      setExportType(null);
    }
  };

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      setExportType('json');
      const blob = await exportToJSON();
      if (blob) {
        await Share.share({
          url: `data:application/json;base64,${blob}`,
          title: 'Drinks Export',
          message: 'Your drink data export (JSON)',
        });
        Alert.alert('Success', 'Data exported as JSON');
      } else {
        Alert.alert('Error', 'Failed to export JSON');
      }
    } catch (error) {
      console.error('Export JSON error:', error);
      Alert.alert('Error', 'Failed to export JSON');
    } finally {
      setExporting(false);
      setExportType(null);
    }
  };

  const handleExportReport = async () => {
    try {
      setExporting(true);
      setExportType('report');
      const text = await exportReport();
      if (text) {
        await Share.share({
          message: text,
          title: 'Drinks Report',
        });
        Alert.alert('Success', 'Report generated');
      } else {
        Alert.alert('Error', 'Failed to generate report');
      }
    } catch (error) {
      console.error('Export report error:', error);
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setExporting(false);
      setExportType(null);
    }
  };

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Export Data</Text>
          <Text style={styles.subtitle}>Download your drink data in multiple formats</Text>
        </View>

        {/* CSV Export */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CSV Format</Text>
          <Text style={styles.cardDescription}>
            Standard spreadsheet format. Open in Excel, Google Sheets, or any spreadsheet app.
          </Text>
          <Pressable
            style={[
              styles.button,
              styles.primaryButton,
              exporting && exportType === 'csv' && styles.loadingButton,
            ]}
            onPress={handleExportCSV}
            disabled={exporting}
          >
            {exporting && exportType === 'csv' ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Export as CSV</Text>
            )}
          </Pressable>
        </View>

        {/* JSON Export */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>JSON Format</Text>
          <Text style={styles.cardDescription}>
            Structured data format. Best for data integration and archival.
          </Text>
          <Pressable
            style={[
              styles.button,
              styles.primaryButton,
              exporting && exportType === 'json' && styles.loadingButton,
            ]}
            onPress={handleExportJSON}
            disabled={exporting}
          >
            {exporting && exportType === 'json' ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Export as JSON</Text>
            )}
          </Pressable>
        </View>

        {/* Report Export */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Text Report</Text>
          <Text style={styles.cardDescription}>
            Human-readable summary report with statistics and breakdown by venue.
          </Text>
          <Pressable
            style={[
              styles.button,
              styles.primaryButton,
              exporting && exportType === 'report' && styles.loadingButton,
            ]}
            onPress={handleExportReport}
            disabled={exporting}
          >
            {exporting && exportType === 'report' ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Generate Report</Text>
            )}
          </Pressable>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📊 Privacy & Data</Text>
          <Text style={styles.infoText}>
            Your data is only exported from this device. No data is shared with third parties during
            export.
          </Text>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.heading,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.blue,
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  infoTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    lineHeight: 18,
  },
});
