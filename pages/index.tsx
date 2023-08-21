import { useEnsName } from "wagmi";
import { Container } from "../components/Container"
import { ClaimableBlock, useGameState } from "../providers/GameProvider"
import containerStyles from "../styles/container.module.css"

export default function Home() {
    const { blocks } = useGameState();

    const blockData = Object.values(blocks).map((block) => {
        return block;
    })

    return (
        <Container>
            {blockData.map((block) => (
                <BlockLine block={block} key={block.id} />
            ))}
        </Container>
    )
}

function BlockLine({ block }: { block: ClaimableBlock }) {
    const { data: ensName } = useEnsName({ address: block.claimerAddress, chainId: 1 })

    if (!block.claimed) {
        return <p><b>Block {block.id}</b> was unclaimed!</p>
    }
    let formattedClaimer = block.claimerAddress as string;
    if (ensName) {
        formattedClaimer = ensName;
    } else {
        formattedClaimer = formattedClaimer.slice(0, 6) + "..." + formattedClaimer.slice(-4);
    }

    return <p><b>Block {block.id}</b> claimed by <b>{formattedClaimer}</b> with a gas price of <b>{parseFloat(block.gasPriceGwei).toFixed(2)} gwei</b></p>
}
