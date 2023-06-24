'use client'
import { FIREBASE_ERRORS } from "@/firebase/error";
import { auth, db } from "@/firebase/firebaseConfig";
import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function page() {
    const router = useRouter()
    const [createUserWithEmailAndPassword, user, loading, error,] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [displayedError, setDisplayedError] = useState<string | null>(null);
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginForm({ ...loginForm, [name]: value });
    };
    const handleSubmitForm = async (e: FormEvent) => {
        e.preventDefault();
        if (loginForm.password !== loginForm.confirmPassword) {
            setDisplayedError("Passwords do not match.");
            return;
        }
        await createUserWithEmailAndPassword(loginForm.email, loginForm.password);
        await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };
    useEffect(() => {
        if (error) {
            setDisplayedError((error as Error)?.message);
        }
    }, [error]);
    if (user) {
        router.push('/');
    }

    const createUserDocumentOnEmailauth = async (user: User) => {
        const docRef = collection(db, "users")
        await addDoc(docRef, JSON.parse(JSON.stringify(user)));
      }
    
      useEffect(() => {
        if (user) {
          createUserDocumentOnEmailauth(user.user)
        }
      }, [user])

    return (
        <>
            {displayedError && (
                <>
                    {toast.error(FIREBASE_ERRORS[displayedError])}
                    {setDisplayedError(null)}
                </>
            )}
            <ToastContainer
                position="bottom-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2
                        className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmitForm} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    value={loginForm.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="confirmPassword"
                                    value={loginForm.confirmPassword}
                                    onChange={handleInputChange}
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                               {loading? "Loading...":"Sign Up"}
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
