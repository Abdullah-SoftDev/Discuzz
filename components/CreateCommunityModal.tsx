import { Dialog, Transition, Listbox } from '@headlessui/react';
import React, { ChangeEvent, FormEvent, Fragment, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const people = ['Public', 'Private', 'Restricted',]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

interface CreateCommunityModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CreateCommunityModal({ open, setOpen }: CreateCommunityModalProps) {
    const [communityType, setCommunityType] = useState(people[0])
    const [communityName, setCommunityName] = useState("")
    const [charRemaining, setCharRemaining] = useState(19)
    const [error, setError] = useState<String | null>("")
    const [loading, setLoading] = useState(false)
    const [user] = useAuthState(auth);

    const handelChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 19) return;
        setCommunityName(e.target.value)
        setCharRemaining(19 - e.target.value.length);
    }

    const handleCreateCommunity = async (e: FormEvent) => {
        e.preventDefault();
        if (error) setError("");
        // validate the community
        const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(communityName) || communityName.length < 3) {
            setError(
                "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores."
            );
            return;
        }
        // First check name not taken already and then Create the community document in firebase.
        setLoading(true)
        const docRef = doc(db, "communities", communityName);
        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);
            if (docSnap.exists()) {
                setError(`Sorry, ${communityName} is already taken. Try another.`);
                setLoading(false)
                return;
            } else {
                transaction.set((docRef), {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: communityType,
                });
                transaction.set(
                    doc(db, `users/${user?.uid}/communitySection`, communityName),
                    {
                        communityId: communityName,
                        isModerator: true,
                    }
                );
            }
        })
        setLoading(false)
        setOpen(false)
        setCommunityName("")
        setCharRemaining(19)
        setCommunityType(people[0])
    };

    const onCloseModal = () => {
        setOpen(false);
        setCommunityName("")
        setCharRemaining(19)
        setCommunityType(people[0])
    }

    return (
        <>
            {error &&
                <>
                    {toast.error(error)}
                    {setError(null)}
                </>
            }
            <ToastContainer
                position="top-right"
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
            <Transition.Root appear show={open} as={Fragment}>
                <Dialog as="form" onSubmit={handleCreateCommunity} className="relative z-10" onClose={setOpen}>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full justify-center items-center p-4 text-center">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md h-full  bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex flex-col space-y-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-5">Create a Community</h2>

                                        <div className="flex flex-col space-y-2">
                                            <label htmlFor="communityName" className="font-medium text-slate-700">
                                                Community Name
                                            </label>
                                            <input
                                                type="text"
                                                name="text"
                                                value={communityName}
                                                onChange={handelChange}
                                                id="text"
                                                className="shadow-sm focus:ring-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-5 placeholder-gray-400 outline-none"
                                                placeholder="Enter community name"
                                            />

                                            <span className={`text-xs ${charRemaining === 0 ? 'text-red-500' : 'text-blue-400'}`}>
                                                {charRemaining} character{charRemaining !== 1 ? 's' : ''} left.
                                            </span>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <label htmlFor="communityType" className="font-medium text-slate-700">
                                                Select Community Type
                                            </label>
                                            <Listbox value={communityType} onChange={setCommunityType}>
                                                {({ open }) => (
                                                    <>
                                                        <div className="relative">
                                                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                                                <span className="flex items-center">
                                                                    <span className="ml-3 block truncate">{communityType}</span>
                                                                </span>
                                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                                </span>
                                                            </Listbox.Button>

                                                            <Transition
                                                                show={open}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0"
                                                            >
                                                                <Listbox.Options
                                                                    static
                                                                    className="absolute z-50 mt-2 w-full max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                                                    style={{ maxHeight: 'calc(100vh - 16rem)', marginTop: '0.5rem' }}
                                                                >
                                                                    {people.map((person) => (
                                                                        <Listbox.Option
                                                                            key={person}
                                                                            className={({ active }) =>
                                                                                classNames(
                                                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                                                )
                                                                            }
                                                                            value={person}
                                                                        >
                                                                            {({ selected, active }) => (
                                                                                <>
                                                                                    <div className="flex items-center">
                                                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                                                                                            {person}
                                                                                        </span>
                                                                                    </div>

                                                                                    {selected && (
                                                                                        <span className={classNames(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
                                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Listbox.Option>
                                                                    ))}
                                                                </Listbox.Options>
                                                            </Transition>

                                                        </div>
                                                    </>
                                                )}
                                            </Listbox>
                                        </div>

                                        <div className="sm:pt-12 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                            <button
                                                type="submit"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                                                {loading ? "Loading..." : "Create Community"}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                onClick={onCloseModal}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}
