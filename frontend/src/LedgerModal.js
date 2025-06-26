import React, { useEffect, useState } from 'react';
import './LedgerModal.css';

function LedgerModal({ tenant, open, onClose }) {
    const [ledger, setLedger] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open && tenant) {
            setLoading(true);
            setError(null); // Reset error on new open/tenantId
            setLedger([]);  // Optionally reset ledger when switching tenants
            const params = new URLSearchParams({ 'tenant_id': tenant.id });

            fetch(`/api/transactions?${params}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Error fetching ledger: ${res.status} ${res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => setLedger(data))
                .catch(err => setError(err))
                .finally(() => setLoading(false));
        }
    }, [open, tenant]);

    const getBalance = () => {
        return ledger.reduce((acc, entry) => {
            const amt = Math.abs(Number(entry.amount));
            if (entry.type === 'charge') {
                return acc + amt;
            } else if (entry.type === 'payment') {
                return acc - amt;
            }
            return acc;
        }, 0);
    };

    return open ? (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} style={{ float: 'right' }}>X</button>
                <h2>Ledger for: {tenant.name}</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
                {!loading && !error && (
                    ledger.length === 0 ? (
                        <p>No transactions found.</p>
                    ) : (
                        <>
                            <div className="ledger-balance">
                                <h3>Balance: ${getBalance().toFixed(2)}</h3>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ledger.map(entry => (
                                        <tr key={entry.id}>
                                            <td>{entry.date}</td>
                                            <td>{entry.description}</td>
                                            <td>{entry.amount}</td>
                                            <td>{entry.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )
                )}
            </div>
        </div>
    ) : null;
}

export default LedgerModal;
