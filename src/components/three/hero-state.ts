/**
 * Tiny shared mutable state between the hero DOM (pointer + scroll) and the 3D scene.
 * Avoids React re-renders on every frame.
 */
export const heroState = {
  /** Normalised pointer position, -1..1 */
  pointer: { x: 0, y: 0 },
  /** 0..1 how far the hero has scrolled out */
  scroll: 0,
  /** Whether the hero is in view (scene pauses otherwise) */
  visible: true,
};
