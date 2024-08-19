'use client';
import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
        </Suspense>
    )
}