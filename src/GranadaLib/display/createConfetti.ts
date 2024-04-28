import Config from "../../config/config.json";

export const createConfetti = (
  scene: Phaser.Scene
): Phaser.GameObjects.Particles.ParticleEmitter => {
  const particles = scene.make.particles({
    x: { min: 0, max: Config.size.x }, // Confetti starting x range
    y: -20, // Confetti starting y position
    config: {
      lifespan: 4000, // Duration of life
      speed: { min: 40, max: 80 }, // Speed range
      angle: { min: 0, max: 360 }, // Direction range of particles
      rotate: { min: 0, max: 360 }, // Rotation range of particles
      gravityY: 20, // Gravity effect on particles
      quantity: 10, // Number of particles emitted per burst
      frequency: 100, // Low frequency for continuous effect
      blendMode: "ADD", // Blend mode for visual effect
      alpha: { start: 1, end: 0 }, // Alpha range for particles
      tint: {
        // Apply random tint to each particle
        onEmit: function () {
          return Phaser.Display.Color.RandomRGB().color; // This will choose a random color
        },
      },
    },
  });

  return particles;
};
