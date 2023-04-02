import Robot from '../../Scene/Main/Sprite/Collidable/Static/Enemy/Robot';
import Player from '../../Scene/Main/Sprite/Player/Player';
import * as EventDispatcher from '../EventDispatcher';

export default function listenEnemyEvents(player: Player): void {
  function setTarget(robot: Robot): void {
    robot.setTarget(player);
  }

  function removeTarget(robot: Robot): void {
    robot.removeTarget();
  }

  EventDispatcher.on('playerEnterRobotDangerArea', setTarget);
  EventDispatcher.on('playerLeavesRobotDangerArea', removeTarget);
}
