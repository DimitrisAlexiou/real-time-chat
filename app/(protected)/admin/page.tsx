'use client';

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin()
            .then(response => {
                if (response.success)
                    toast.success(response.success);

                if (response.error)
                    toast.error(response.error);
            })
    }

    const onApiRouteClick = () => {
        fetch('/api/admin')
            .then(response => {
                if (response.ok)
                    toast.success('Allowed API route.');
                else
                    toast.error('Forbidden API route.');
            })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRoles={UserRole.ADMIN}>
                    <FormSuccess message="You have access to the admin page." />
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admins have access to the admin page.
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">
                        Admins have access to the admin page.
                    </p>
                    <Button onClick={onServerActionClick}>
                        Click
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AdminPage;