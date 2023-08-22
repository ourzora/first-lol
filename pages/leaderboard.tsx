import { useEnsName } from "wagmi";
import { Container } from "../components/Container"
import { USE_MAINNET } from "../providers/GameProvider"
import { GetServerSideProps } from "next";

interface Leader {
    id: `0x${string}`;
    score: number;
}

function timeUntil(start, end) {
    const timestampInMilliseconds = end;
    let difference = end - start;

    if (difference <= 0) {
        return "Game Over";
    }

    const days = Math.floor(difference / (24 * 60 * 60));
    difference -= days * (24 * 60 * 60);

    const hours = Math.floor(difference / (60 * 60));
    difference -= hours * (60 * 60);

    const minutes = Math.floor(difference / (60));
    difference -= minutes * (60);

    const seconds = Math.floor(difference);

    let result = "";
    if (days > 0) result += days + " days, ";
    if (hours > 0) result += hours + " hours, ";
    if (minutes > 0) result += minutes + " minutes, ";
    result += "and " + seconds + " seconds";

    return result;
}


export default function Leaderboard({ leaders }) {
    const deadline = 1697920553;
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = deadline - now;
    const blocksLeft = Math.floor(secondsLeft / 2);
    return (
        <Container>
            {leaders.map((leader, idx) => (
                <LeaderLine leader={leader} idx={idx} key={leader.id} />
            ))}
            <br />
            <p>There are <b>~{blocksLeft} blocks</b> left to claim before the deadline</p>
            <p>The game will be over in {timeUntil(now, deadline)}</p>
        </Container>
    )
}

export const getServerSideProps: GetServerSideProps<{
    leaders: Leader[]
}> = async ({ req, res }) => {
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

    res.setHeader(
        'Cache-Control',
        'public, s-maxage=5, stale-while-revalidate=59'
    )

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
