'use client';

import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';

interface ExportReportButtonProps {
    onExport?: () => Promise<void> | void;
}

export default function ExportReportButton({ onExport }: ExportReportButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            if (onExport) {
                await onExport();
            } else {
                // Default placeholder logic for API call
                console.log('Exporting report...');
                // Example: await fetch('/api/reports/export')...
            }
        } catch (error) {
            console.error('Failed to export report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="primary"
            label={loading ? 'Exporting...' : 'Export Report'}
            isLoading={loading}
            icon={<span className="material-symbols-outlined text-lg">download</span>}
            onClick={handleExport}
        />
    );
}
