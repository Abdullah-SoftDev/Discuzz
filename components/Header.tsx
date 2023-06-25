"use client";
import { Menu, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import CreateCommunityModal from "./CreateCommunityModal";
import { useCommunityData } from "@/context/useCommunityData";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const { communityData, setCommunityData, onJoinLeaveCommunity } = useCommunityData();
  return (
    <>
      <header className="bg-zinc-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between lg:gap-8">
            {/* Logo image and name. */}
            <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static justify-start">
              <Link href={"/"} className="flex-shrink-0 flex items-center">
                <img
                  className=" h-8 w-auto"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                  alt="Workflow"
                />
                <span className="hidden md:inline-block text-gray-800 text-xl font-semibold ml-2 ">
                  Disczz
                </span>
              </Link>
            </div>

            {/* Searchbar */}
            <div className="flex-1 md:pl-28 lg:px-0">
              <div className="flex items-center p-4 justify-center  max-w-2xl mx-auto">
                <div className="w-full justify-center">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile and signin button */}
            <div className="flex items-center justify-end">
              {user ? (
                <>
                  <PlusCircleIcon onClick={() => setOpen(true)} className="w-9 h-9 text-gray-500 hover:animate-pulse cursor-pointer mr-2" />
                  <Menu as="div" className="flex-shrink-0 relative sm:ml-5">
                    <div>
                      <Menu.Button className="rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        {user && user?.photoURL && <img
                          className="h-10 w-10 rounded-full"
                          src={user?.photoURL ?? ''}
                          alt=""
                        />}
                        {user && user?.email && !user?.photoURL && <p>{user?.email}</p>}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                        <Menu.Item>
                          <button
                            type="button"
                            onClick={async () => { await signOut(auth); setCommunityData(null); }}
                            className="block py-2 px-4 text-sm text-gray-700">
                            Sign Out
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <Link
                  href="/signIn"
                  className="sm:ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-600 focus:outline-none"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <CreateCommunityModal open={open} setOpen={setOpen} />
    </>
  );
}
