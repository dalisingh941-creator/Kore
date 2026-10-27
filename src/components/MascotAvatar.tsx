import React, { useState } from 'react';
import {
  MascotAccessory,
  MascotConfig,
  MascotExpression,
  MascotShape,
  MascotStatus,
} from '../types/agent';

interface MascotAvatarProps {
  config: MascotConfig;
  status?: MascotStatus;
  size?: number;
  interactive?: boolean;
  className?: string;
  seedOffset?: number;
}

function renderShapeBody(shape: MascotShape, color: string) {
  switch (shape) {
    case 'droplet':
      return (
        <path
          d="M 50 10 C 74 10, 90 26, 90 50 C 90 74, 74 90, 50 90 L 24 90 C 15 90, 10 85, 10 76 L 10 50 C 10 26, 26 10, 50 10 Z"
          fill={color}
        />
      );
    case 'squircle':
      return (
        <rect
          x="12"
          y="12"
          width="76"
          height="76"
          rx="22"
          ry="22"
          fill={color}
        />
      );
    case 'star5':
      return (
        <path
          d="M 50 9 C 54 9, 57 18, 62 27 C 67 30, 81 30, 88 35 C 91 39, 82 50, 76 58 C 77 65, 83 78, 79 84 C 75 88, 61 81, 50 77 C 39 81, 25 88, 21 84 C 17 78, 23 65, 24 58 C 18 50, 9 39, 12 35 C 19 30, 33 30, 38 27 C 43 18, 46 9, 50 9 Z"
          fill={color}
          stroke={color}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      );
    case 'triangle':
      return (
        <path
          d="M 50 14 C 56 14, 88 70, 86 80 C 84 88, 16 88, 14 80 C 12 70, 44 14, 50 14 Z"
          fill={color}
          stroke={color}
          strokeWidth="8"
          strokeLinejoin="round"
        />
      );
    case 'ghost':
      return (
        <path
          d="M 50 12 C 72 12, 84 28, 84 52 C 84 64, 90 72, 88 77 C 86 82, 76 80, 68 80 C 62 80, 58 90, 50 90 C 42 90, 38 80, 32 80 C 24 80, 14 82, 12 77 C 10 72, 16 64, 16 52 C 16 28, 28 12, 50 12 Z"
          fill={color}
        />
      );
    case 'burst8':
      return (
        <path
          d="M 50 8 C 56 8, 60 15, 66 17 C 72 19, 80 16, 84 21 C 88 26, 83 34, 85 40 C 87 46, 93 50, 91 56 C 89 62, 82 65, 79 71 C 76 77, 78 85, 72 88 C 66 91, 59 85, 53 86 C 47 87, 41 91, 34 89 C 27 87, 26 78, 22 72 C 18 66, 10 64, 9 57 C 8 50, 14 45, 16 39 C 18 33, 13 25, 18 20 C 23 15, 31 18, 37 16 C 43 14, 45 8, 50 8 Z"
          fill={color}
        />
      );
    case 'hexagon':
      return (
        <path
          d="M 50 10 L 84 28 L 84 72 L 50 90 L 16 72 L 16 28 Z"
          fill={color}
          stroke={color}
          strokeWidth="10"
          strokeLinejoin="round"
        />
      );
    case 'cloud':
      return (
        <path
          d="M 32 78 C 18 78, 10 68, 12 55 C 13 45, 21 38, 30 37 C 35 22, 52 16, 65 24 C 75 24, 86 33, 88 45 C 92 58, 84 78, 68 78 Z"
          fill={color}
        />
      );
    case 'diamond':
      return (
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="16"
          transform="rotate(45 50 50)"
          fill={color}
        />
      );
    case 'capsule':
      return (
        <rect
          x="10"
          y="18"
          width="80"
          height="64"
          rx="32"
          fill={color}
        />
      );
  }
}

function renderFaceExpression(
  expression: MascotExpression,
  status: MascotStatus,
  pupilOffset: { x: number; y: number }
) {
  const pupilClass =
    status === 'working'
      ? 'animate-pupil-scan'
      : status === 'thinking'
      ? 'animate-pupil-think'
      : '';

  const mouthClass = status === 'speaking' ? 'animate-mouth-speak' : '';
  const px = pupilOffset.x;
  const py = pupilOffset.y;

  switch (expression) {
    case 'cheerful':
      return (
        <g className="animate-eye-blink">
          <ellipse cx="38" cy="46" rx="10.5" ry="13.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="46" rx="10.5" ry="13.5" fill="#FFFFFF" />
          <g className={pupilClass}>
            <ellipse cx={39 + px} cy={47 + py} rx="6" ry="8" fill="#1C1C1E" />
            <ellipse cx={61 + px} cy={47 + py} rx="6" ry="8" fill="#1C1C1E" />
          </g>
          <g className={mouthClass}>
            <path d="M 43 65 C 43 73, 57 73, 57 65 Z" fill="#1C1C1E" />
            <path
              d="M 45 65.5 L 55 65.5"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        </g>
      );

    case 'skeptical':
      return (
        <g>
          <ellipse cx="35" cy="48" rx="10.5" ry="13" fill="#FFFFFF" className="animate-eye-blink" />
          <g className={pupilClass}>
            <ellipse cx={36 + px} cy={48 + py} rx="5.5" ry="7.5" fill="#1C1C1E" />
          </g>
          <rect x="52" y="45" width="18" height="5.5" rx="2.75" fill="#1C1C1E" />
          <rect
            x="45"
            y="60"
            width="12"
            height="5"
            rx="2.5"
            fill="#1C1C1E"
            className={mouthClass}
          />
        </g>
      );

    case 'wink':
      return (
        <g>
          <ellipse cx="36" cy="50" rx="10.5" ry="13.5" fill="#FFFFFF" className="animate-eye-blink" />
          <g className={pupilClass}>
            <ellipse cx={37 + px} cy={50 + py} rx="6" ry="8" fill="#1C1C1E" />
          </g>
          <path
            d="M 66 43 L 54 50 L 66 57"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );

    case 'curious':
      return (
        <g className="animate-eye-blink">
          <ellipse cx="41" cy="52" rx="9" ry="13" transform="rotate(8 41 52)" fill="#FFFFFF" />
          <ellipse cx="59" cy="52" rx="9" ry="13" transform="rotate(-8 59 52)" fill="#FFFFFF" />
          <g className={pupilClass}>
            <ellipse cx={42 + px} cy={53 + py} rx="5" ry="7.5" fill="#1C1C1E" />
            <ellipse cx={58 + px} cy={53 + py} rx="5" ry="7.5" fill="#1C1C1E" />
          </g>
          <path
            d="M 46 69 Q 50 74 54 69"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth="3.5"
            strokeLinecap="round"
            className={mouthClass}
          />
        </g>
      );

    case 'determined':
      return (
        <g className="animate-eye-blink">
          <ellipse cx="38" cy="53" rx="9.5" ry="12" fill="#FFFFFF" />
          <ellipse cx="62" cy="53" rx="9.5" ry="12" fill="#FFFFFF" />
          <g className={pupilClass}>
            <ellipse cx={39 + px} cy={54 + py} rx="5.5" ry="7" fill="#1C1C1E" />
            <ellipse cx={61 + px} cy={54 + py} rx="5.5" ry="7" fill="#1C1C1E" />
          </g>
          <rect x="27" y="34" width="18" height="5" rx="2.5" fill="#1C1C1E" />
          <rect x="55" y="34" width="18" height="5" rx="2.5" fill="#1C1C1E" />
        </g>
      );

    case 'calm':
      return (
        <g className="animate-eye-blink">
          <ellipse cx="38" cy="48" rx="9.5" ry="13" fill="#FFFFFF" />
          <ellipse cx="62" cy="48" rx="9.5" ry="13" fill="#FFFFFF" />
          <g className={pupilClass}>
            <ellipse cx={38 + px} cy={49 + py} rx="5.5" ry="8" fill="#1C1C1E" />
            <ellipse cx={62 + px} cy={49 + py} rx="5.5" ry="8" fill="#1C1C1E" />
          </g>
          <path
            d="M 44 66 C 44 72, 56 72, 56 66 Z"
            fill="#1C1C1E"
            className={mouthClass}
          />
        </g>
      );

    case 'focused':
      return (
        <g className="animate-eye-blink">
          <ellipse cx="38" cy="50" rx="9.5" ry="12.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="50" rx="9.5" ry="12.5" fill="#FFFFFF" />
          <g className={pupilClass}>
            <ellipse cx={39 + px} cy={50 + py} rx="5.5" ry="7.5" fill="#1C1C1E" />
            <ellipse cx={61 + px} cy={50 + py} rx="5.5" ry="7.5" fill="#1C1C1E" />
          </g>
          {status === 'speaking' && (
            <ellipse cx="50" cy="68" rx="5" ry="3.5" fill="#1C1C1E" className={mouthClass} />
          )}
        </g>
      );

    case 'analytical':
      return (
        <g className="animate-eye-blink">
          <ellipse cx="37" cy="49" rx="10" ry="12" fill="#FFFFFF" />
          <ellipse cx="63" cy="49" rx="10" ry="10" fill="#FFFFFF" />
          <g className={pupilClass}>
            <circle cx={38 + px} cy={49 + py} r="5.5" fill="#1C1C1E" />
            <circle cx={62 + px} cy={49 + py} r="5" fill="#1C1C1E" />
          </g>
          <path
            d="M 43 67 L 57 65"
            stroke="#1C1C1E"
            strokeWidth="4"
            strokeLinecap="round"
            className={mouthClass}
          />
        </g>
      );
  }
}

function renderAccessory(accessory?: MascotAccessory) {
  if (!accessory || accessory === 'none') return null;

  switch (accessory) {
    case 'glasses':
      return (
        <g>
          <circle
            cx="37"
            cy="49"
            r="13"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth="3.5"
          />
          <circle
            cx="63"
            cy="49"
            r="13"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth="3.5"
          />
          <line
            x1="50"
            y1="48"
            x2="50"
            y2="48"
            stroke="#1C1C1E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M 48 48 L 52 48" stroke="#1C1C1E" strokeWidth="3.5" />
        </g>
      );
    case 'headset':
      return (
        <g>
          <path
            d="M 14 48 C 14 20, 86 20, 86 48"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect x="8" y="42" width="8" height="16" rx="4" fill="#1C1C1E" />
          <rect x="84" y="42" width="8" height="16" rx="4" fill="#1C1C1E" />
          <path
            d="M 86 55 Q 82 70 64 70"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="63" cy="70" r="3" fill="#1C1C1E" />
        </g>
      );
    case 'antenna':
      return (
        <g>
          <line
            x1="50"
            y1="12"
            x2="50"
            y2="2"
            stroke="#1C1C1E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="2" r="4.5" fill="#1C1C1E" />
          <circle cx="50" cy="2" r="2" fill="#FFFFFF" />
        </g>
      );
    case 'halo':
      return (
        <ellipse
          cx="50"
          cy="4"
          rx="22"
          ry="4.5"
          fill="none"
          stroke="#1C1C1E"
          strokeWidth="3.5"
        />
      );
    case 'crown':
      return (
        <path
          d="M 34 14 L 38 3 L 50 10 L 62 3 L 66 14 Z"
          fill="#1C1C1E"
          stroke="#1C1C1E"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'visor':
      return (
        <rect
          x="22"
          y="39"
          width="56"
          height="14"
          rx="7"
          fill="#1C1C1E"
          fillOpacity="0.88"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      );
    case 'bowtie':
      return (
        <g>
          <path
            d="M 37 82 L 50 87 L 37 92 Z"
            fill="#1C1C1E"
            stroke="#1C1C1E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 63 82 L 50 87 L 63 92 Z"
            fill="#1C1C1E"
            stroke="#1C1C1E"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="87" r="3.5" fill="#FFFFFF" stroke="#1C1C1E" strokeWidth="2" />
        </g>
      );
  }
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  config,
  status = 'idle',
  size = 52,
  interactive = true,
  className = '',
  seedOffset = 0,
}) => {
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [poked, setPoked] = useState(false);

  const statusAnimClass =
    status === 'working'
      ? 'animate-mascot-working'
      : status === 'thinking'
      ? 'animate-mascot-thinking'
      : status === 'speaking'
      ? 'animate-mascot-speaking'
      : 'animate-mascot-idle';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-2.5, Math.min(2.5, ((e.clientX - cx) / rect.width) * 5));
    const dy = Math.max(-2, Math.min(2, ((e.clientY - cy) / rect.height) * 4));
    setPupilOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setPupilOffset({ x: 0, y: 0 });
  };

  const handlePoke = () => {
    if (!interactive) return;
    setPoked(true);
    setTimeout(() => setPoked(false), 320);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={interactive ? handlePoke : undefined}
      style={{
        width: size,
        height: size,
        animationDelay: `${(seedOffset % 5) * 0.25}s`,
      }}
      className={`relative inline-flex items-center justify-center select-none shrink-0 transition-transform duration-150 ${
        poked ? 'scale-90 rotate-6' : 'hover:scale-105'
      } ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full overflow-visible ${statusAnimClass}`}
        style={{ animationDelay: `${(seedOffset % 4) * 0.3}s` }}
        aria-hidden="true"
      >
        {renderShapeBody(config.shape, config.color)}
        {renderFaceExpression(config.expression, status, pupilOffset)}
        {renderAccessory(config.accessory)}
      </svg>
    </div>
  );
};

interface GroupMascotClusterProps {
  mascots: MascotConfig[];
  size?: number;
}

export const GroupMascotCluster: React.FC<GroupMascotClusterProps> = ({
  mascots,
  size = 54,
}) => {
  const four = mascots.slice(0, 4);
  const subSize = Math.floor(size * 0.48);

  return (
    <div
      style={{ width: size, height: size }}
      className="grid grid-cols-2 grid-rows-2 gap-0.5 items-center justify-items-center shrink-0"
    >
      {four.map((m, idx) => (
        <MascotAvatar
          key={idx}
          config={m}
          size={subSize}
          interactive={false}
          seedOffset={idx + 1}
        />
      ))}
    </div>
  );
};
