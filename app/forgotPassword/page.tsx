'use client'
import { auth } from "@/firebase/firebaseConfig";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";

export default function page() {
    const [email, setEmail] = useState("")
    const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);
    const handlePasswordReset = async (e: FormEvent) => {
        e.preventDefault();
        const success = await sendPasswordResetEmail(email);
        if (success) {
            alert('Check your email.');
        }
        setEmail("")
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2
                        className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Forgot your password
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {sending ? "Sending..." : "Forgot Password"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Back to sign In?{' '}
                        <Link
                            href="/signIn"
                            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
