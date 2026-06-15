import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import UserForm from "@/components/admin/user-form";

interface EditUserPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
    const { id } = await params;
    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
    });

    if (!user) {
        notFound();
    }

    return (
        <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
            <UserForm initialData={user} />
        </div>
    );
}
