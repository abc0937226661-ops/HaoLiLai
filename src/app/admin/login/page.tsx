"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white mb-4">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        管理員登入
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        請輸入您的管理權限帳號與密碼
                    </p>
                </div>

                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">帳號</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm"
                                placeholder="帳號"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">密碼</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:text-sm"
                                placeholder="密碼"
                            />
                        </div>
                    </div>

                    <div className="text-sm text-red-500 min-h-[20px]">
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>

                    <LoginButton />
                </form>
            </div>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full bg-amber-500 text-black hover:bg-amber-600 font-bold"
            aria-disabled={pending}
            disabled={pending}
        >
            {pending ? "登入中..." : "登入系統"}
        </Button>
    );
}
