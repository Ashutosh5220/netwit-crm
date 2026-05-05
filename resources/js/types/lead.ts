// resources/js/types/lead.ts

export interface Client {
    id: number;
    name: string;
}

export interface Lead {
    id: number;
    client_id: number;
    title: string;
    value: string | null;
    stage: string;
    status: string;
    sort_order: number;
    source: string | null;
    expected_close_date: string | null;
    description: string | null;
    client?: Client;
    created_at: string;
}

export interface StageColumn {
    key: string;
    label: string;
    leads: Lead[];
    value: number;
    count: number;
}

export interface PipelineStats {
    pipeline_value: string;
    won_value: string;
    active_count: number;
}