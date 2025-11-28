export type UpgradeRequest = {
    id: number
    bidder_id: number
    status: "approved" | "pending" | "rejected",
    created_at: Date;
    updated_at: Date | null;
}