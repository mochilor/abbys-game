export default function closeUIElement(
  scene: Phaser.Scene,
  members: Phaser.GameObjects.GameObject[],
): void {
  scene.tweens.add({
    targets: members,
    duration: 300,
    ease: 'linear',
    props: {
      y: '-=10',
      alpha: 0,
    },
    onComplete: () => {
      members.forEach((member) => member.destroy());
    },
  });
}
