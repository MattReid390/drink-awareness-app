// S23 — Data Import
// Import drink data from CSV file

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { validateCSV, importFromCSV } from '../services/dataExportImport';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const DataImportScreen: React.FC = () => {
  const [csvContent, setCsvContent] = useState('');
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validation, setValidation] = useState<any>(null);

  const handleValidate = async () => {
    if (!csvContent.trim()) {
      Alert.alert('Error', 'Please paste CSV content');
      return;
    }

    try {
      setValidating(true);
      const result = await validateCSV(csvContent);
      if (result) {
        setValidation(result);
        if (!result.isValid && result.issues) {
          Alert.alert('Validation Issues', result.issues.slice(0, 5).join('\n'));
        }
      }
    } catch (error) {
      console.error('Validation error:', error);
      Alert.alert('Error', 'Failed to validate CSV');
    } finally {
      setValidating(false);
    }
  };

  const handleImport = async () => {
    if (!csvContent.trim()) {
      Alert.alert('Error', 'Please paste CSV content');
      return;
    }

    try {
      setImporting(true);
      const result = await importFromCSV(csvContent);
      if (result) {
        Alert.alert(
          'Import Complete',
          `✓ ${result.successCount} imported\n✗ ${result.errorCount} failed\nTotal: ${result.totalRows}`
        );
        if (result.successCount > 0) {
          setCsvContent('');
          setValidation(null);
        }
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Import Data</Text>
          <Text style={styles.subtitle}>Paste CSV data to import drinks</Text>
        </View>

        {/* CSV Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CSV Content</Text>
          <TextInput
            style={styles.csvInput}
            placeholder={
              'name,units,price,venue\nGuinness,2.3,4.50,The Anchor\nStella,2.3,4.50,The Crown'
            }
            placeholderTextColor={Colors.textMuted}
            value={csvContent}
            onChangeText={setCsvContent}
            multiline
            editable={!validating && !importing}
          />
        </View>

        {/* Validation Results */}
        {validation && (
          <View style={[styles.section, validation.isValid ? styles.successBox : styles.errorBox]}>
            <Text style={styles.validationTitle}>
              {validation.isValid ? '✓ Valid CSV' : '✗ Invalid CSV'}
            </Text>
            <Text style={styles.validationText}>
              Valid rows: {validation.validRows} / {validation.totalRows}
            </Text>
            {validation.issues && validation.issues.length > 0 && (
              <>
                <Text style={[styles.validationText, { marginTop: Spacing.sm }]}>Issues:</Text>
                {validation.issues.slice(0, 3).map((issue, idx) => (
                  <Text key={idx} style={styles.issueText}>
                    • {issue}
                  </Text>
                ))}
              </>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.button, styles.validateButton, validating && styles.loadingButton]}
            onPress={handleValidate}
            disabled={validating || importing}
          >
            {validating ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Validate CSV</Text>
            )}
          </Pressable>

          <Pressable
            style={[
              styles.button,
              styles.importButton,
              (importing || !validation?.isValid) && styles.disabledButton,
            ]}
            onPress={handleImport}
            disabled={importing || !validation?.isValid}
          >
            {importing ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Import Drinks</Text>
            )}
          </Pressable>
        </View>

        {/* Format Guide */}
        <View style={styles.guideBox}>
          <Text style={styles.guideTitle}>📋 CSV Format Guide</Text>
          <Text style={styles.guideText}>Required columns: name, units</Text>
          <Text style={styles.guideText}>Optional columns: price, venue, date_logged</Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleCode}>name,units,price,venue</Text>
            <Text style={styles.exampleCode}>Guinness Pint,2.3,4.50,The Anchor</Text>
            <Text style={styles.exampleCode}>Stella Pint,2.3,4.50,The Crown</Text>
          </View>
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  csvInput: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    minHeight: 150,
    textAlignVertical: 'top',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: Colors.green,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
  },
  validationTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  validationText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
  },
  issueText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  buttonGroup: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateButton: {
    backgroundColor: Colors.blue,
  },
  importButton: {
    backgroundColor: Colors.green,
  },
  loadingButton: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  guideBox: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
    padding: Spacing.md,
  },
  guideTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.md,
  },
  guideText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  exampleBox: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: Spacing.sm,
    marginTop: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.blue,
  },
  exampleCode: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.textPrimary,
    lineHeight: 16,
  },
});
