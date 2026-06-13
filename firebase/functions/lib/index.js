"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyInterestPayout = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
exports.dailyInterestPayout = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const accountsSnapshot = await db.collection('accounts').get();
    const batch = db.batch();
    accountsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const balance = data.balance || 0;
        const apy = data.interestRate || 0;
        // Daily interest calculation: (balance * apy/100) / 365
        const dailyRate = (apy / 100) / 365;
        const interestCents = Math.floor(balance * dailyRate);
        if (interestCents > 0) {
            batch.update(doc.ref, {
                balance: admin.firestore.FieldValue.increment(interestCents),
                ytdInterest: admin.firestore.FieldValue.increment(interestCents),
                lastInterestCalculation: admin.firestore.FieldValue.serverTimestamp()
            });
            const txRef = db.collection('transactions').doc();
            batch.set(txRef, {
                accountId: doc.id,
                amount: interestCents,
                type: 'INTEREST',
                date: admin.firestore.FieldValue.serverTimestamp(),
                description: 'Daily Interest'
            });
        }
    });
    await batch.commit();
    console.log('Daily interest payout completed');
});
//# sourceMappingURL=index.js.map