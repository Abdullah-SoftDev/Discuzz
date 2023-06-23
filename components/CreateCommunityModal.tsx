import { Dialog, Transition, Listbox } from '@headlessui/react';
import React, { Fragment, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const people = [
    {
        id: 1,
        type: 'Public',
        avatar:
            'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 2,
        type: 'Private',
        avatar:
            'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        id: 3,
        type: 'Restricted',
        avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
interface CreateCommunityModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CreateCommunityModal({ open, setOpen }: CreateCommunityModalProps) {
    const [selected, setSelected] = useState(people[0])
    return (
        <Transition.Root appear show={open} as={Fragment}>
            <Dialog as="form" className="relative z-10" onClose={setOpen}>
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
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-md h-max sm:h-96 bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex flex-col space-y-3">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Create a Community</h2>
                                    <label htmlFor="communityName" className="flex flex-col">
                                        <span className="font-medium text-slate-700 mb-3">Community Name</span>
                                        <input
  type="email"
  name="email"
  id="email"
  className="shadow-sm focus:ring-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 outline-none"
  placeholder="you@example.com"
/>

                                    </label>

                                    <Listbox value={selected} onChange={setSelected}>
                                        {({ open }) => (
                                            <>
                                                <Listbox.Label className="font-medium text-slate-700 pt-2">Select community type</Listbox.Label>
                                                <div className="relative">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                                        <span className="flex items-center">
                                                            <img src={selected?.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                            <span className="ml-3 block truncate">{selected?.type}</span>
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            {people.map((person) => (
                                                                <Listbox.Option
                                                                    key={person.id}
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
                                                                                <img src={person?.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                                                                <span
                                                                                    className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                                >
                                                                                    {person.type}
                                                                                </span>
                                                                            </div>

                                                                            {selected ? (
                                                                                <span
                                                                                    className={classNames(
                                                                                        active ? 'text-white' : 'text-indigo-600',
                                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                    )}
                                                                                >
                                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                </span>
                                                                            ) : null}
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

                                    <div className="pt-8 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                            onClick={() => setOpen(false)}
                                        >
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
    )
}
