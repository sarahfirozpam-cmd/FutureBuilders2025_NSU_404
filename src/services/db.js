import Dexie from 'dexie';

export const db = new Dexie('RuralHealthDB');

db.version(1).stores({
  users: '++id, odoterId, name, age, gender, location, createdAt',
  symptoms: '++id, userId, timestamp, symptoms, analysis, severity, synced, createdAt',
  vitals: '++id, userId, timestamp, systolic, diastolic, pulse, temperature, weight, riskLevel, synced, createdAt',
  consultations: '++id, userId, timestamp, status, description, priority, synced, syncedAt',
  healthContent: '++id, category, title, content, language, downloaded, downloadedAt',
  predictions: '++id, timestamp, type, input, output, synced'
});

// Helper methods
db.addSymptomRecord = async function(record) {
  return await this.symptoms.add({
    ...record,
    createdAt: new Date().toISOString()
  });
};

db.addVitalsRecord = async function(record) {
  return await this.vitals.add({
    ...record,
    createdAt: new Date().toISOString()
  });
};

db.getRecentSymptoms = async function(limit = 10) {
  return await this.symptoms
    .orderBy('createdAt')
    .reverse()
    .limit(limit)
    .toArray();
};

db.getRecentVitals = async function(limit = 10) {
  return await this.vitals
    .orderBy('createdAt')
    .reverse()
    .limit(limit)
    .toArray();
};

db.getPendingConsultations = async function() {
  return await this.consultations
    .where('synced')
    .equals(false)
    .toArray();
};

db.getDownloadedContent = async function() {
  return await this.healthContent
    .where('downloaded')
    .equals(true)
    .toArray();
};

export default db;
