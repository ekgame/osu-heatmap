import clsx from "clsx";
import { Link, useMatches } from "react-router";

const MAX_WEIGHT = 900;
const MIN_WEIGHT = 100;
const FADING_TEXT = 'beatmap heatmap';
const FADING_LETTERS = [...FADING_TEXT].map((letter, index) => ({
    letter,
    weight: Math.round(MAX_WEIGHT - (MAX_WEIGHT - MIN_WEIGHT) * index / (FADING_TEXT.length - 1)),
}));

export function Header() {
    const isFullWidth = useMatches().some((match) => (match.handle as { fullWidth?: boolean })?.fullWidth);

    return (
        <header className="h-12 shrink-0 border-b border-ink-700 bg-ink-900">
            <div className={clsx('flex h-full items-center px-4', !isFullWidth && 'mx-auto w-full max-w-5xl')}>
                <Link to="/" className="text-lg" aria-label="osu! beatmap heatmap">
                    <span aria-hidden="true">
                        <span style={{ fontWeight: MAX_WEIGHT }}>osu! </span>
                        {FADING_LETTERS.map(({ letter, weight }, index) => (
                            <span key={index} style={{ fontWeight: weight }}>{letter}</span>
                        ))}
                    </span>
                </Link>
            </div>
        </header>
    );
}
