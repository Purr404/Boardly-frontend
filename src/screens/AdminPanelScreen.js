import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPanelScreen() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDocuments();
      fetchReports();
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/admin/documents/pending');
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (docId) => {
    try {
      await api.put(`/admin/documents/${docId}/approve`);
      Alert.alert('Success', 'Document approved');
      fetchDocuments();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve');
    }
  };

  const handleReject = async (docId) => {
    try {
      await api.put(`/admin/documents/${docId}/reject`, { adminNote: 'Rejected by admin' });
      Alert.alert('Success', 'Document rejected');
      fetchDocuments();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject');
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await api.put(`/admin/reports/${reportId}/resolve`, { action });
      Alert.alert('Success', 'Report resolved');
      fetchReports();
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve');
    }
  };

  if (user?.role !== 'admin') {
    return <View><Text>Admin access only</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Documents</Text>
      <FlatList
        data={documents}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>User: {item.user.name} ({item.user.email})</Text>
            <Text>Type: {item.type}</Text>
            <Text>Status: {item.status}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.title}>Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Room: {item.room.title}</Text>
            <Text>Reason: {item.reason}</Text>
            <Text>Status: {item.status}</Text>
            {item.status === 'pending' && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.resolveButton} onPress={() => handleResolveReport(item.id, 'delete_room')}>
                  <Text style={styles.buttonText}>Delete Room</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resolveButton} onPress={() => handleResolveReport(item.id, 'ignore')}>
                  <Text style={styles.buttonText}>Ignore</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  approveButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 4, flex: 0.48, alignItems: 'center' },
  rejectButton: { backgroundColor: '#f44336', padding: 8, borderRadius: 4, flex: 0.48, alignItems: 'center' },
  resolveButton: { backgroundColor: '#2196F3', padding: 8, borderRadius: 4, flex: 0.48, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});