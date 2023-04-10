import { useEffect, useRef, useState } from "preact/hooks";

import type { Universe } from "../static/lib/game_of_life.generated.js";
import { instantiate } from "../static/lib/game_of_life.generated.js";

export default function GameOfLife() {
    const [loaded, setLoaded] = useState(false)

    const universe = useRef<Universe | null>(null);

    useEffect(() => {
        (async () => {
            const { Universe } = await instantiate({ url: new URL("/lib/game_of_life_bg.wasm", import.meta.url) })
            universe.current = Universe.new()
            setLoaded(true)
        })()
    }, [])

    return <div className="flex gap-2 w-full">
        {loaded ? <GameOfLifeLazy universe={universe.current!} /> : <div>loading...</div>}
    </div>
}

function GameOfLifeLazy({ universe }: { universe: Universe }) {
    const [data, setData] = useState({ canvas: "", count: 0 })

    useEffect(() => {
        const id = setInterval(() => {
            universe.tick()
            setData((old) => ({ canvas: universe.render(), count: ++old.count }))
        }, 100)

        return () => {
            clearInterval(id)
        }
    }, [universe])

    return (
        <>
            <p className="flex-grow-1 font-bold text-xl">{data.count}</p>
            <pre >
                {data.canvas}
            </pre>
        </>
    );
}