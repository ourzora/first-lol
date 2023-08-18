import containerStyles from "../styles/container.module.css"
import { Button } from "./Button"
import { Input } from "./Input"

export function Container({ children }) {
    return (
        <div className={containerStyles.gutter}>
            <div className={containerStyles.header}>
                FIRST <span style={{ fontSize: '12' }}>(LOL)</span>
            </div>
            <div className={containerStyles.container}>
                <div className={containerStyles.containerHeader}>
                    <div>High Score: 1080 Blocks</div>
                    <div>Your Score: 50 Blocks</div>
                </div>
                <div className={containerStyles.containerContent}>
                    {children}
                </div>
                <div className={containerStyles.containerFooter}>
                    <div><Input placeholder="ENTER GAS PRICE..." /></div>
                    <div><Button>CLAIM BLOCK</Button></div>
                </div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>CLAIM A BLOCK FIRST, SCORE A POINT. CLAIM THE MOST BLOCKS, WIN ETH.</div>
            <div className={containerStyles.sponsorHeader}>POWERED BY</div>
            <div className={containerStyles.sponsorRow}>
                <div><img src="/img/paradigm.svg" alt="Paradigm Logo" /></div>
                <div><img src="/img/zora.svg" alt="Zora Logo" /></div>
                <div><img src="/img/conduit.svg" alt="Conduit Logo" /></div>
            </div>
        </div >
    )
}
