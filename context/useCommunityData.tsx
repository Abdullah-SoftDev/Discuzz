import { CollectionReference, DocumentData, QuerySnapshot, WriteBatch } from 'firebase/firestore';
import { ReactNode, createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { CommunityData } from '@/app/search/[communityId]/page';
import { auth, db } from '@/firebase/firebaseConfig';
import { collection, doc, getDocs, increment, query, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

interface Snippet {
    communityId?: string;
    [key: string]: any; // Allow additional properties if needed
}

interface CommunityDataContextValue {
    communityData: {
        mySnippets: Snippet[];
    } | null; // Allow null value
    setCommunityData: Dispatch<SetStateAction<{ mySnippets: Snippet[]; } | null>>;
    onJoinLeaveCommunity: (community: CommunityData, isJoined?: boolean) => void;
}

const CommunityDataContext = createContext<CommunityDataContextValue>({
    communityData: null, // Set initial value to null
    setCommunityData: () => { },
    onJoinLeaveCommunity: () => { },
});

interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageUrl?: string;
}

export function UseCommunityDataProvider({ children }: { children: ReactNode }) {
    const [communityData, setCommunityData] = useState<{ mySnippets: Snippet[]; } | null>(null); // Set initial value to null
    const [user] = useAuthState(auth);
    const router = useRouter()

    const getSnippets = async (userId: string) => {
        try {
            const snippetQuery: CollectionReference<DocumentData> = collection(db, `users/${userId}/communitySection`);
            const snippetDocs: QuerySnapshot<DocumentData> = await getDocs(snippetQuery);
            const snippets: Snippet[] = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
            setCommunityData((prev) => ({
                ...prev,
                mySnippets: snippets,
            }));
        } catch (error: any) {
            console.log("Error getting user snippets", error);
        }
    };

    useEffect(() => {
        if (!user) return;
        getSnippets(user.uid);
    }, [user]);

    const onJoinLeaveCommunity = (community: CommunityData, isJoined?: boolean): void => {
        if (!user) {
            alert("Please SignIn first!");
            router.push('/signIn')
            return;
        }
        if (isJoined) {
            leaveCommunity(community.id);
            return;
        }
        joinCommunity(community);
    };

    const joinCommunity = async (community: CommunityData): Promise<void> => {
        try {
            const batch: WriteBatch = writeBatch(db);

            const newSnippet: CommunitySnippet = {
                communityId: community.id,
                imageUrl: community.imageUrl || "",
            };
            batch.set(
                doc(
                    db,
                    `users/${user?.uid}/communitySection`,
                    community.id
                ),
                newSnippet
            );

            batch.update(doc(db, "communities", community.id), {
                numberOfMembers: increment(1),
            });

            await batch.commit();

            setCommunityData((prev) => ({
                ...prev!,
                mySnippets: [...prev!.mySnippets, newSnippet],
            }));
        } catch (error) {
            console.log("joinCommunity error", error);
        }
    };

    const leaveCommunity = async (communityId: string): Promise<void> => {
        try {
            const batch: WriteBatch = writeBatch(db);
            batch.delete(
                doc(db, `users/${user?.uid}/communitySection/${communityId}`)
            );

            batch.update(doc(db, "communities", communityId), {
                numberOfMembers: increment(-1),
            });

            await batch.commit();

            setCommunityData((prev) => ({
                ...prev!,
                mySnippets: prev!.mySnippets.filter(
                    (item: any) => item.communityId !== communityId
                ),
            }));
        } catch (error) {
            console.log("leaveCommunity error", error);
        }
    };

    return (
        <CommunityDataContext.Provider value={{ communityData, setCommunityData, onJoinLeaveCommunity }}>
            {children}
        </CommunityDataContext.Provider>
    );
}

export const useCommunityData = (): CommunityDataContextValue => useContext(CommunityDataContext);
