const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Root Folder se index.html serve karega (Koi public folder ki zaroorat nahi)
app.use(express.static(__dirname));

const users = {};
const deposits = [];
const withdrawals = [];
const bets = [];

app.post('/api/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    res.json({ success: true, otp: "123456" });
});

app.post('/api/register', (req, res) => {
    const { phone, otp, password } = req.body;
    if (users[phone]) {
        return res.status(400).json({ success: false, message: 'Phone number already registered!' });
    }
    if (otp !== "123456") {
        return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }
    const uid = Math.floor(100000 + Math.random() * 900000).toString();
    users[phone] = { phone, password, uid, balance: 28.00, upiDetails: null };
    res.json({ success: true, user: users[phone] });
});

app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;
    if (!users[phone] || users[phone].password !== password) {
        return res.status(400).json({ success: false, message: 'Invalid Credentials' });
    }
    res.json({ success: true, user: users[phone] });
});

app.post('/api/save-upi', (req, res) => {
    const { phone, upiDetails } = req.body;
    if (!users[phone]) return res.status(400).json({ success: false, message: 'User not found' });
    users[phone].upiDetails = upiDetails;
    res.json({ success: true, message: 'UPI saved' });
});

app.post('/api/submit-deposit', (req, res) => {
    const { phone, amount, utr } = req.body;
    if (!users[phone]) return res.status(400).json({ success: false, message: 'User not found' });
    users[phone].balance += parseFloat(amount);
    res.json({ success: true });
});

app.post('/api/request-withdraw', (req, res) => {
    const { phone, amount } = req.body;
    const user = users[phone];
    if (!user || user.balance < parseFloat(amount)) return res.status(400).json({ success: false, message: 'Insufficient Balance' });
    user.balance -= parseFloat(amount);
    res.json({ success: true, newBalance: user.balance });
});

app.post('/api/place-bet', (req, res) => {
    const { phone, amount } = req.body;
    const user = users[phone];
    if (!user || user.balance < parseFloat(amount)) return res.status(400).json({ success: false, message: 'Insufficient Balance' });
    user.balance -= parseFloat(amount);
    res.json({ success: true, newBalance: user.balance });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
