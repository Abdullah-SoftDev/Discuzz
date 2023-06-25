import Testing from "@/components/Testing";
import { db } from "@/firebase/firebaseConfig";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";

export interface CommunityData {
    id: string;
    numberOfMembers: number;
    creatorId: string;
    privacyType: "Public" | "Private" | "Restricted"
    createdAt?: Timestamp
    imageUrl?: string
}
export default async function Page({ params }: { params?: { communityId?: string } }) {
    const docRef = doc(db, `communities/${params?.communityId}`);
    const product = await getDoc(docRef);
    if (!product.exists()) notFound();
    const data = product.data() as CommunityData; // Explicitly cast the data to CommunityData

    const result: CommunityData = {
        id: product.id,
        numberOfMembers: data.numberOfMembers,
        creatorId: data.creatorId,
        privacyType: data.privacyType,
        createdAt: data.createdAt,
        imageUrl: data.imageUrl,
    };
    return (
        <div>
            <p>Slug: {params?.communityId}</p>
            <p>Community name: {result.id}</p>
            <p>Community name: {result.privacyType}</p>
            <Testing result={result} />
        </div>
    );
}  
