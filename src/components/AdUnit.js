"use client"

import { useEffect } from 'react';

export default function AdUnit({ slot, style = {} }) {
    const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

    useEffect(() => {
        if (ADSENSE_ID) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('AdSense Error:', err);
            }
        }
    }, [ADSENSE_ID]);

    if (!ADSENSE_ID) {
        // Show a subtle placeholder in development
        return (
            <div className="ad-placeholder" style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                padding: '2rem',
                textAlign: 'center',
                margin: '2rem 0',
                borderRadius: '16px',
                color: '#64748b',
                fontSize: '0.9rem',
                ...style
            }}>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700 }}>Advertisement Space</span>
                <p style={{ margin: 0 }}>This space will display ads once Google AdSense is approved and active.</p>
            </div>
        );
    }

    return (
        <div style={{ margin: '2rem 0', overflow: 'hidden', ...style }}>
            <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ADSENSE_ID}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
        </div>
    );
}
