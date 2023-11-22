export interface BlogItem {
    blogId: string;
    userId: string;
    title: string;
    content: string;
    created_at?: string;
    modified_at?: string;
    attachmentUrl?: string;
}