import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MoreVertical, Ban, Shield, Users } from "lucide-react";
import { apiRequest } from "@/lib/apiRequest";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const UserRow = ({ user }: { user: any }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const mutationOptions = {
        onSuccess: () => {
            toast({ title: "User Updated", description: "The user's status has been changed." });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        },
        onError: (error: Error) => toast({ title: "Update Failed", description: error.message, variant: "destructive" })
    }

    const suspendMutation = useMutation<void, Error, void>({
        mutationFn: () => apiRequest("PATCH", `/api/admin/users/${user.id}/suspend`),
        ...mutationOptions
    });
    const makeAdminMutation = useMutation<void, Error, void>({
        mutationFn: () => apiRequest("PATCH", `/api/admin/users/${user.id}/make-admin`),
        ...mutationOptions
    });

    return (
        <TableRow>
            <TableCell><div className="font-medium">{user.name}</div><div className="text-sm text-muted-foreground">{user.email}</div></TableCell>
            <TableCell><Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge></TableCell>
            <TableCell><Badge variant="outline">{user.subscriptionStatus || "free"}</Badge></TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => makeAdminMutation.mutate()} disabled={makeAdminMutation.isPending}><Shield className="h-4 w-4 mr-2" />Make Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => suspendMutation.mutate()} disabled={suspendMutation.isPending} className="text-destructive"><Ban className="h-4 w-4 mr-2" />Suspend User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

const UsersSkeleton = () => Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
        <TableCell><Skeleton className="h-5 w-24"/><Skeleton className="h-4 w-32 mt-1"/></TableCell>
        <TableCell><Skeleton className="h-6 w-16"/></TableCell>
        <TableCell><Skeleton className="h-6 w-16"/></TableCell>
        <TableCell><Skeleton className="h-5 w-20"/></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto"/></TableCell>
    </TableRow>
));

export default function AdminUsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: users, isLoading } = useQuery<any[]>({
        queryKey: ['adminUsers'],
        queryFn: () => apiRequest('GET', '/api/admin/users')
    });

    const filteredUsers = users?.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">View and manage all registered users.</p>
            </div>
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name or email..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Subscription</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {isLoading ? <UsersSkeleton /> : (filteredUsers && filteredUsers.length > 0) ? (
                                filteredUsers.map(user => <UserRow key={user.id} user={user} />)
                            ) : (
                                <TableRow><TableCell colSpan={5} className="text-center h-24">No users found.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
