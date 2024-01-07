export interface User {
    Id?: string;
    Name: string;
    Email: string;
    Password: string;
    Permissions: string[];
    CreatedAt: Date;
    UpdatedAt: Date;
}