/**
 * A component that creates a glowing effect around its container based on mouse movement.
 * Inspired by Aceternity UI's glowing effect component.
 *
 * @component
 * @param {Object} props - The component props
 * @param {number} [props.blur=0] - The amount of blur applied to the glow effect (in pixels)
 * @param {number} [props.inactiveZone=0.7] - The size of the inactive zone where glow is minimal (0-1)
 * @param {number} [props.proximity=0] - The distance at which the glow effect starts to appear
 * @param {number} [props.spread=20] - How far the glow effect spreads (in degrees)
 * @param {'default'|'white'} [props.variant='default'] - The color variant of the glow
 * @param {boolean} [props.glow=false] - Whether the glow effect is enabled
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {boolean} [props.disabled=true] - Whether the effect is disabled
 * @param {number} [props.movementDuration=2] - Duration of the glow movement animation in seconds
 * @param {number} [props.borderWidth=1] - Width of the glowing border in pixels
 *
 * @example
 * ```jsx
 * <GlowingEffect
 *   blur={10}
 *   spread={30}
 *   variant="default"
 *   glow={true}
 *   disabled={false}
 * >
 *   <div>Content goes here</div>
 * </GlowingEffect>
 * ```
 */

"use client";
import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          const targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          // Simple approach for animation
          element.style.setProperty("--start", String(newAngle));
        });
      },
      [inactiveZone, proximity]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          ref={containerRef}
          style={
            {
              "--blur": `${blur}px`,
              "--spread": spread,
              "--start": "0",
              "--active": "0",
              "--glowingeffect-border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
              "--gradient":
                variant === "white"
                  ? `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--black),
                  var(--black) calc(25% / var(--repeating-conic-gradient-times))
                )`
                  : `radial-gradient(circle, #facc15 10%, #facc1500 20%),
                radial-gradient(circle at 40% 40%, #f59e0b 5%, #f59e0b00 15%),
                radial-gradient(circle at 60% 60%, #fb923c 10%, #fb923c00 20%), 
                radial-gradient(circle at 40% 60%, #ea580c 10%, #ea580c00 20%),
                repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  #facc15 0%,
                  #f59e0b calc(25% / var(--repeating-conic-gradient-times)),
                  #fb923c calc(50% / var(--repeating-conic-gradient-times)), 
                  #ea580c calc(75% / var(--repeating-conic-gradient-times)),
                  #facc15 calc(100% / var(--repeating-conic-gradient-times))
                )`,
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
            glow && "opacity-100",
            blur > 0 && "blur-[var(--blur)] ",
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "glow",
              "rounded-[inherit]",
              'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
              "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
              "after:[background:var(--gradient)] after:[background-attachment:fixed]",
              "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
              "after:[mask-clip:padding-box,border-box]",
              "after:[mask-composite:intersect]",
              "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect }; 