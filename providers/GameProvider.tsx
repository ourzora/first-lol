import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAccount, useBlockNumber, useContractEvent, useContractRead } from "wagmi";
import { fetchTransaction, readContract } from '@wagmi/core'
import abi from "../utils/abi"
import { formatUnits } from "viem";


export interface ClaimableBlock {
    claimerAddress?: `0x${string}`;
    gasPriceGwei?: string;
    claimed: boolean;
    id: number;
}

export interface GameState {
    blocks: { [id: string]: ClaimableBlock };
    highScore: bigint;
    userScore: bigint;
    claimBlock: () => Promise<void>;
}

const initialState = { blocks: {}, userScore: BigInt(0), highScore: BigInt(0), claimBlock: async () => { } };
export const GameContext = createContext<GameState>(initialState);

const USE_MAINNET = process.env.NEXT_PUBLIC_USE_MAINNET === 'true';
const CONTRACT_ADDRESS = USE_MAINNET ? '0x' : '0x583816E2F6DA673E97c248d8667F558C1c90Ea88';

export const GameProvider = ({ children }) => {
    const [blocks, setBlocks] = useState<{ [id: string]: ClaimableBlock }>({});
    const { address } = useAccount();
    const [lastClaimedBlock, setLastClaimedBlock] = useState<ClaimableBlock>({ claimed: false, id: 0 });
    const { data: blockNumber } = useBlockNumber({
        watch: true,
    })
    const { data: initialHighScore } = useContractRead({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'highScore'
    });
    const { data: initialUserScore } = useContractRead({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: 'claims',
        args: [address]
    });
    const [highScore, setHighScore] = useState(initialHighScore || BigInt(0));
    const [userScore, setUserScore] = useState(initialUserScore || BigInt(0));

    // Append new blocks to the blocks array
    useEffect(() => {
        if (!blockNumber) return;

        // If the block number is already in the blocks array, ignore
        if (!!blocks[blockNumber.toString()]) return;

        // If the block number is not in the blocks array, add it
        setBlocks({ ...blocks, [blockNumber.toString()]: { claimed: false, id: parseInt(blockNumber.toString()) } });
    }, [blockNumber])

    // If a block is claimed, upsert the block in the blocks array with the claim data
    useContractEvent({
        address: CONTRACT_ADDRESS,
        abi,
        eventName: 'Claimed',
        async listener(logs) {
            await Promise.all(logs.map(async (log) => {
                const { blockNumber, args, transactionHash } = log;

                const { gasPrice } = await fetchTransaction({ hash: transactionHash });
                const gasPriceGwei = formatUnits(gasPrice, 9);

                // Since we know the score has changed, let's refresh the highscore and user score.
                const fetchedHighScore = await readContract({
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'highScore'
                });
                setHighScore(fetchedHighScore);
                const fetchedUserScore = await readContract({
                    address: CONTRACT_ADDRESS,
                    abi,
                    functionName: 'claims',
                    args: [address]
                })
                setUserScore(fetchedUserScore);

                // Set the last claimed block to exit out of this async code and back into context-aware block territory
                setLastClaimedBlock({ claimed: true, id: parseInt(blockNumber.toString()), claimerAddress: args.claimer, gasPriceGwei });
            }))
        }
    });

    useEffect(() => {
        if (lastClaimedBlock.id == 0 || blocks[lastClaimedBlock.id.toString()]?.claimed) {
            return;
        }

        setBlocks({ ...blocks, [lastClaimedBlock.id.toString()]: lastClaimedBlock });

    }, [blocks, lastClaimedBlock]);


    const claimBlock = useCallback(async () => {
    }, [])

    return (
        <GameContext.Provider value={{ blocks, claimBlock, highScore, userScore }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGameState = () => useContext(GameContext);
