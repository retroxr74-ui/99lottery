const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(__dirname));

// Database
const users = {}; 
const deposits = [];
const withdrawals = [];

// Send OTP
app.post('/api/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ success: false, message: '10 digit ka valid phone number dalein' });
    }
    if (users[phone]) {
        return res.status(400).json({ success: false, message: 'Yeh number pehle se registered hai! Login karein.' });
    }
    res.json({ success: true, otp: "123456" });
});

// Register User
app.post('/api/register', (req, res) => {
    const { phone, otp, password } = req.body;
    if (users[phone]) {
        return res.status(400).json({ success: false, message: 'Yeh number pehle se registered hai!' });
    }
    if (otp !== "123456") {
        return res.status(400).json({ success: false, message: 'Galat OTP' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password kam se kam 6 digits ka hona chahiye' });
    }

    const uid = Math.floor(100000 + Math.random() * 900000).toString();
    users[phone] = {
        phone,
        password,
        uid,
        balance: 28.00,
        bankDetails: null
    };

    res.json({ success: true, user: users[phone] });
});

// Login User
app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;
    if (!users[phone]) {
        return res.status(400).json({ success: false, message: 'Account nahi mila. Pehle Register karein.' });
    }
    if (users[phone].password !== password) {
        return res.status(400).json({ success: false, message: 'Galat Password' });
    }
    res.json({ success: true, user: users[phone] });
});

// Save Bank Details Permanently
app.post('/api/save-bank', (req, res) => {
    const { phone, upiId, accountNo, ifsc } = req.body;
    if (!users[phone]) return res.status(400).json({ success: false, message: 'User nahi mila' });
    
    if (users[phone].bankDetails) {
        return res.status(400).json({ success: false, message: 'Bank/UPI details pehle se saved hain!' });
    }

    users[phone].bankDetails = { upiId, accountNo, ifsc };
    res.json({ success: true, message: 'Bank details save ho gayi hain!', bankDetails: users[phone].bankDetails });
});

// Deposit Request (Min ₹100)
app.post('/api/submit-deposit', (req, res) => {
    const { phone, amount, utr } = req.body;
    const depAmt = parseFloat(amount);

    if (!users[phone]) return res.status(400).json({ success: false, message: 'User nahi mila' });
    if (isNaN(depAmt) || depAmt < 100) {
        return res.status(400).json({ success: false, message: 'Minimum deposit ₹100 hai' });
    }
    if (!utr || utr.length < 12) {
        return res.status(400).json({ success: false, message: '12-digit UTR/Ref No. daalein' });
    }

    deposits.push({ id: Date.now(), phone, amount: depAmt, utr, status: 'Pending', date: new Date().toLocaleString() });
    res.json({ success: true, message: 'Deposit request admin ko bhej di gayi hai!' });
});

// Withdraw Request (Min ₹110)
app.post('/api/request-withdraw', (req, res) => {
    const { phone, amount } = req.body;
    const wdAmt = parseFloat(amount);

    const user = users[phone];
    if (!user) return res.status(400).json({ success: false, message: 'User nahi mila' });
    if (!user.bankDetails) {
        return res.status(400).json({ success: false, message: 'Pehle apni Bank/UPI details save karein!' });
    }
    if (isNaN(wdAmt) || wdAmt < 110) {
        return res.status(400).json({ success: false, message: 'Minimum withdrawal ₹110 hai' });
    }
    if (user.balance < wdAmt) {
        return res.status(400).json({ success: false, message: 'Balance kam hai' });
    }

    user.balance -= wdAmt;
    withdrawals.push({ id: Date.now(), phone, amount: wdAmt, details: user.bankDetails, status: 'Pending', date: new Date().toLocaleString() });

    res.json({ success: true, message: 'Withdrawal request submit ho gayi hai!', newBalance: user.balance });
});

// Place Bet (Min ₹1)
app.post('/api/place-bet', (req, res) => {
    const { phone, amount, selection } = req.body;
    const betAmt = parseFloat(amount);

    const user = users[phone];
    if (!user) return res.status(400).json({ success: false, message: 'User nahi mila' });
    if (isNaN(betAmt) || betAmt < 1) {
        return res.status(400).json({ success: false, message: 'Minimum bet ₹1 hai' });
    }
    if (user.balance < betAmt) {
        return res.status(400).json({ success: false, message: 'Balance kam hai' });
    }

    user.balance -= betAmt;
    res.json({ success: true, message: `${selection} par ₹${betAmt} ki bet lag gayi!`, newBalance: user.balance });
});

// ADMIN API ENDPOINTS
app.get('/api/admin/data', (req, res) => {
    res.json({ success: true, users, deposits, withdrawals });
});

app.post('/api/admin/approve-deposit', (req, res) => {
    const { depId } = req.body;
    const dep = deposits.find(d => d.id === depId);
    if (dep && dep.status === 'Pending') {
        dep.status = 'Approved';
        if (users[dep.phone]) users[dep.phone].balance += dep.amount;
        return res.json({ success: true, message: 'Deposit Approve ho gaya!' });
    }
    res.status(400).json({ success: false, message: 'Request nahi mili ya pehle se processed hai' });
});

app.post('/api/admin/approve-withdraw', (req, res) => {
    const { wdId } = req.body;
    const wd = withdrawals.find(w => w.id === wdId);
    if (wd && wd.status === 'Pending') {
        wd.status = 'Approved';
        return res.json({ success: true, message: 'Withdrawal Approve ho gaya!' });
    }
    res.status(400).json({ success: false, message: 'Request nahi mili' });
});

// Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
                                     
