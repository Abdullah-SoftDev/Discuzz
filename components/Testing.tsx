'use client'
import { CommunityData } from "@/app/search/[communityId]/page";
import { useCommunityData } from "@/context/useCommunityData";

interface TestingProps {
    result: CommunityData;
}

const Testing: React.FC<TestingProps> = ({ result }) => {
    const { communityData, setCommunityData, onJoinLeaveCommunity } = useCommunityData();
    const isJoined = !!communityData?.mySnippets?.find(
        (item) => item.communityId === result.id
    );
    return <div>
        <p>testing {result?.privacyType}</p>
        <button onClick={() => onJoinLeaveCommunity(result, isJoined)}>{isJoined ? "Joined" : "Join"}</button>
    </div>;
};

export default Testing;