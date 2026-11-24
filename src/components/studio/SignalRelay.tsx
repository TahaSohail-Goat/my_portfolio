import { useEffect, useReducer, useRef, useState } from "react";
import { ArrowRight, Circle, Diamond, Triangle } from "lucide-react";
import type { KeyboardEvent } from "react";
import "./signal-relay.css";

const shapes = [
  { name: "Circle", Icon: Circle },
  { name: "Diamond", Icon: Diamond },
  { name: "Triangle", Icon: Triangle },
];
const signals = Array.from({ length: 9 }, (_, index) => index);
const practiceGoal = 12;
const runSeconds = 30;
const storageKey = "taha-signal-relay-best";

type Mode = "timed" | "practice";
type Board = { tiles: number[]; target: number };
type Game = Board & {
  phase: "ready" | "playing" | "finished";
  mode: Mode;
  deadline: number;
  seconds: number;
  score: number;
  hits: number;
  streak: number;
  missedTile: number | null;
  feedback: string;
};
type Action =
  | { type: "start"; mode: Mode; now: number; board: Board }
  | { type: "cancel" }
  | { type: "tick"; now: number }
  | { type: "pick"; index: number; now: number; nextBoard: Board };

const initialGame: Game = {
  tiles: signals,
  target: 4,
  phase: "ready",
  mode: "timed",
  deadline: 0,
  seconds: runSeconds,
  score: 0,
  hits: 0,
  streak: 0,
  missedTile: null,
  feedback: "",
};

function createBoard(previousTarget?: number): Board {
  const tiles = [...signals];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  const targets = signals.filter((id) => id !== previousTarget);
  return { tiles, target: targets[Math.floor(Math.random() * targets.length)] };
}

function updateGame(game: Game, action: Action): Game {
  if (action.type === "cancel") return initialGame;
  if (action.type === "start") {
    return {
      ...initialGame,
      ...action.board,
      phase: "playing",
      mode: action.mode,
      deadline: action.now + runSeconds * 1000,
    };
  }
  if (game.phase !== "playing") return game;
  if (game.mode === "timed" && action.now >= game.deadline) {
    return { ...game, phase: "finished", seconds: 0 };
  }
  if (action.type === "tick") {
    const seconds = Math.ceil((game.deadline - action.now) / 1000);
    return seconds === game.seconds ? game : { ...game, seconds };
  }
  if (game.tiles[action.index] !== game.target) {
    return {
      ...game,
      streak: 0,
      missedTile: action.index,
      feedback: "Wrong signal. Match both the shape and the bars.",
    };
  }
  const hits = game.hits + 1;
  const streak = game.streak + 1;
  const points = 100 + 25 * Math.min(streak - 1, 4);
  return {
    ...game,
    ...action.nextBoard,
    phase: game.mode === "practice" && hits === practiceGoal ? "finished" : "playing",
    score: game.score + points,
    hits,
    streak,
    missedTile: null,
    feedback: `+${points} points.`,
  };
}

function signalLabel(signal: number) {
  const bars = (signal % 3) + 1;
  return `${shapes[Math.floor(signal / 3)].name}, ${bars} ${bars === 1 ? "bar" : "bars"}`;
}

function SignalMark({ signal }: { signal: number }) {
  const shape = Math.floor(signal / 3);
  const { Icon } = shapes[shape];
  return (
    <span className="relay-mark" data-shape={shape} aria-hidden="true">
      <Icon strokeWidth={2} />
      <span className="relay-bars">
        {Array.from({ length: (signal % 3) + 1 }, (_, index) => <i key={index} />)}
      </span>
    </span>
  );
}

function readBestScores(): Record<Mode, number> {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    return {
      timed: Number.isFinite(saved?.timed) ? saved.timed : 0,
      practice: Number.isFinite(saved?.practice) ? saved.practice : 0,
    };
  } catch {
    return { timed: 0, practice: 0 };
  }
}

export function SignalRelay() {
  const [game, dispatch] = useReducer(updateGame, initialGame);
  const [mode, setMode] = useState<Mode>("timed");
  const [best, setBest] = useState(readBestScores);
  const section = useRef<HTMLElement>(null);
  const firstTile = useRef<HTMLButtonElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const restorePlayFocus = useRef(false);
  const playing = game.phase === "playing";
  const finished = game.phase === "finished";
  const displayMode = game.phase === "ready" ? mode : game.mode;

  useEffect(() => {
    if (!playing || game.mode !== "timed") return;
    const tick = () => dispatch({ type: "tick", now: performance.now() });
    const interval = window.setInterval(tick, 100);
    return () => window.clearInterval(interval);
  }, [playing, game.mode, game.deadline]);

  useEffect(() => {
    if (playing) firstTile.current?.focus({ preventScroll: true });
    if (finished && section.current?.contains(document.activeElement)) {
      result.current?.focus({ preventScroll: true });
    }
    if (!playing && restorePlayFocus.current) {
      restorePlayFocus.current = false;
      playButton.current?.focus({ preventScroll: true });
    }
  }, [playing, finished]);

  useEffect(() => {
    if (!finished || game.score <= best[game.mode]) return;
    const next = { ...best, [game.mode]: game.score };
    setBest(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Keep the session score when browser storage is unavailable.
    }
  }, [best, finished, game.mode, game.score]);

  function start() {
    dispatch({ type: "start", mode, now: performance.now(), board: createBoard() });
  }

  function pick(index: number) {
    if (!playing) return;
    dispatch({
      type: "pick",
      index,
      now: performance.now(),
      nextBoard: createBoard(game.target),
    });
  }

  function handleKeys(event: KeyboardEvent<HTMLElement>) {
    if (!playing || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!/^[1-9]$/.test(event.key)) return;
    event.preventDefault();
    pick(Number(event.key) - 1);
  }

  return (
    <section
      ref={section}
      className="signal-relay"
      id="signal-relay"
      aria-labelledby="relay-title"
      onKeyDown={handleKeys}
    >
      <div className="relay-intro">
        <div>
          <h2 id="relay-title">Signal <em>Relay.</em></h2>
          <p>Match the shape and the number of bars. Keep your streak going to earn more points.</p>
        </div>
        <a href="#sculpture-lab">Explore the sculpture <ArrowRight size={16} /></a>
      </div>
      <div className="relay-console">
        <dl className="relay-stats">
          <div><dt>Score</dt><dd>{game.score.toLocaleString()}</dd></div>
          <div><dt>Streak</dt><dd>{game.streak}</dd></div>
          <div>
            <dt>{displayMode === "timed" ? "Time left" : "Matches"}</dt>
            <dd>{displayMode === "timed" ? `${game.seconds}s` : `${game.hits}/${practiceGoal}`}</dd>
          </div>
          <div><dt>Best</dt><dd>{best[mode].toLocaleString()}</dd></div>
        </dl>
        <div className="relay-board-layout">
          <div className="relay-sidebar">
            <div className="relay-target">
              <span>{playing ? "Find this signal" : "Example signal"}</span>
              <SignalMark signal={playing ? game.target : initialGame.target} />
              <strong>{signalLabel(playing ? game.target : initialGame.target)}</strong>
            </div>
            {playing ? (
              <div className="relay-play-tools">
                <p className="relay-key-hint">Tap a tile or press its number key.</p>
                <button
                  type="button"
                  className="relay-cancel"
                  onClick={() => {
                    restorePlayFocus.current = true;
                    dispatch({ type: "cancel" });
                  }}
                >
                  Quit round
                </button>
              </div>
            ) : (
              <div className="relay-start">
                {finished && (
                  <h3 ref={result} tabIndex={-1}>
                    {game.score.toLocaleString()} points · {game.hits} matches
                  </h3>
                )}
                <fieldset className="relay-modes">
                  <legend>Choose a mode</legend>
                  <label>
                    <input type="radio" name="relay-mode" checked={mode === "timed"} onChange={() => setMode("timed")} />
                    <span>30-second run</span>
                  </label>
                  <label>
                    <input type="radio" name="relay-mode" checked={mode === "practice"} onChange={() => setMode("practice")} />
                    <span>Untimed practice</span>
                  </label>
                </fieldset>
                <button ref={playButton} className="relay-play" type="button" onClick={start}>
                  {finished ? "Play again" : "Play Signal Relay"} <ArrowRight size={19} />
                </button>
              </div>
            )}
          </div>
          <div className="relay-board" role="group" aria-label="Signal tiles">
            {(playing ? game.tiles : initialGame.tiles).map((signal, index) => (
              <button
                key={index}
                ref={index === 0 ? firstTile : undefined}
                className="relay-tile"
                type="button"
                aria-disabled={!playing}
                tabIndex={playing ? 0 : -1}
                data-missed={game.missedTile === index && playing}
                aria-label={`Tile ${index + 1}: ${signalLabel(signal)}`}
                onClick={() => pick(index)}
              >
                <span className="relay-tile-key" aria-hidden="true">{index + 1}</span>
                <SignalMark signal={signal} />
              </button>
            ))}
          </div>
        </div>
        <p className="relay-feedback" role="status">
          {playing
            ? `${game.feedback} Find ${signalLabel(game.target).toLowerCase()}.`.trim()
            : finished ? `Round complete. ${game.score.toLocaleString()} points.` : "Practice ends after 12 matches."}
        </p>
      </div>
    </section>
  );
}
