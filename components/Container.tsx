import { Field, Formik } from "formik"
import * as Yup from 'yup';
import containerStyles from "../styles/container.module.css"
import { Button } from "./Button"
import { Input } from "./Input"
import { useCallback } from "react"
import { CONTRACT_ADDRESS, CHAIN_ID, useGameState } from "../providers/GameProvider";
import { useAccount, useContractWrite } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import abi from "../utils/abi";

const FormSchema = Yup.object().shape({
    gasPrice: Yup.number().moreThan(0)
})


export function Container({ children }) {
    const { highScore, userScore } = useGameState();
    const { openConnectModal } = useConnectModal();
    const { address } = useAccount();
    const { write } = useContractWrite({
        // @ts-ignore
        address: CONTRACT_ADDRESS,
        // @ts-ignore
        abi,
        // @ts-ignore
        functionName: 'claimBlock',
        // @ts-ignore
        chainId: CHAIN_ID,
    })

    const handleSubmit = useCallback(async (values, { setSubmitting }) => {
        // @ts-ignore
        await write({
            gasPrice: values.gasPrice ? values.gasPrice * 1e9 : undefined
        })
        setSubmitting(false)
    }, [])

    return (
        <div className={containerStyles.gutter}>
            <div className={containerStyles.header}>
                FIRST <span style={{ fontSize: '12' }}>(LOL)</span>
            </div>
            <div className={containerStyles.container}>
                <div className={containerStyles.containerHeader}>
                    <div>High Score: {highScore.toString()} Blocks</div>
                    <div>Your Score: {userScore.toString()} Blocks</div>
                </div>
                <div className={containerStyles.containerContent}>
                    {children}
                </div>
                <Formik
                    initialValues={{ gasPrice: undefined }}
                    validationSchema={FormSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        errors,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form className={containerStyles.containerFooter} onSubmit={handleSubmit}>
                            <div><Field type="input" name="gasPrice" placeholder="ENTER GAS PRICE..." component={Input} /></div>
                            <div>
                                {address ? (
                                    <Button disabled={errors.gasPrice || isSubmitting} onClick={handleSubmit}>CLAIM BLOCK</Button>
                                ) : (
                                    <Button disabled={false} onClick={openConnectModal}>CONNECT</Button>
                                )}
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
            <div style={{ marginTop: '1rem' }}>CLAIM A BLOCK FIRST, SCORE A POINT. CLAIM THE MOST BLOCKS, WIN ETH.</div>
            <div className={containerStyles.sponsorHeader}>POWERED BY</div>
            <div className={containerStyles.sponsorRow}>
                <div><img src="/img/paradigm.svg" alt="Paradigm Logo" /></div>
                <div><img src="/img/zora.svg" alt="Zora Logo" /></div>
                <div><img src="/img/conduit.svg" alt="Conduit Logo" /></div>
            </div>
        </div >
    )
}
