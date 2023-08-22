import { useEnsName } from "wagmi";
import { Container } from "../components/Container"
import { USE_MAINNET } from "../providers/GameProvider"
import { GetServerSideProps } from "next";

interface Leader {
    id: `0x${string}`;
    score: number;
}

export default function Leaderboard({ leaders }) {
    console.log({ leaders })
    return (
        <Container>
            {leaders.map((leader, idx) => (
                <LeaderLine leader={leader} idx={idx} />
            ))}
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps<{
    leaders: Leader[]
}> = async () => {
    const query = `{
        players(first:10, orderBy:score, orderDirection:desc) {
          id
          score
        }
      }`
    const leaders = await fetch('https://api.goldsky.com/api/public/project_clhk16b61ay9t49vm6ntn4mkz/subgraphs/first-lol/1.0.1/gn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        }),
    }).then(res => res.json()).then(res => res.data.players)
    return { props: { leaders } }
}

function LeaderLine({ leader, idx }: { leader: Leader, idx: number }) {
    const { data: ensName } = useEnsName({ address: leader.id, chainId: 1 })

    let formattedClaimer = leader.id as string;
    if (ensName) {
        formattedClaimer = ensName;
    } else {
        formattedClaimer = formattedClaimer.slice(0, 6) + "..." + formattedClaimer.slice(-4);
    }

    return <p>
        <a href={`https://${USE_MAINNET ? '' : 'testnet.'}explorer.zora.energy/address/${leader.id}`} target="_blank" rel="noreferrer noopener"><b>{idx + 1}. {formattedClaimer}: </b> {leader.score} points</a>
    </p>
}
