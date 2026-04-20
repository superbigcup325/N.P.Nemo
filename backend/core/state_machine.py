from enum import Enum
from typing import Optional


class GamePhase(str, Enum):
    MAP = "map"
    BATTLE = "battle"
    REWARD = "reward"
    SHOP = "shop"
    REST = "rest"
    EVENT = "event"
    VICTORY = "victory"
    GAME_OVER = "game_over"


class BattleTurn(str, Enum):
    PLAYER_TURN = "player_turn"
    ENEMY_TURN = "enemy_turn"


class GameStateMachine:
    def __init__(self):
        self._current_phase: GamePhase = GamePhase.MAP
        self._battle_turn: Optional[BattleTurn] = None
        
        self._valid_transitions: dict[GamePhase, list[GamePhase]] = {
            GamePhase.MAP: [GamePhase.BATTLE, GamePhase.REST, GamePhase.SHOP, GamePhase.EVENT],
            GamePhase.BATTLE: [GamePhase.REWARD, GamePhase.VICTORY, GamePhase.GAME_OVER, GamePhase.MAP],
            GamePhase.REWARD: [GamePhase.MAP],
            GamePhase.SHOP: [GamePhase.MAP],
            GamePhase.REST: [GamePhase.MAP],
            GamePhase.EVENT: [GamePhase.MAP]
        }
    
    @property
    def current_phase(self) -> GamePhase:
        return self._current_phase
    
    @property
    def battle_turn(self) -> Optional[BattleTurn]:
        return self._battle_turn
    
    def can_transition(self, target_phase: GamePhase) -> bool:
        valid_targets = self._valid_transitions.get(self._current_phase, [])
        return target_phase in valid_targets
    
    def transition(self, target_phase: GamePhase) -> bool:
        if not self.can_transition(target_phase):
            raise ValueError(f"Invalid transition: {self._current_phase} -> {target_phase}")
        
        if target_phase == GamePhase.BATTLE and self._current_phase != GamePhase.BATTLE:
            self._battle_turn = BattleTurn.PLAYER_TURN
        elif target_phase != GamePhase.BATTLE:
            self._battle_turn = None
        
        self._current_phase = target_phase
        return True
    
    def switch_battle_turn(self) -> BattleTurn:
        if self._current_phase != GamePhase.BATTLE:
            raise ValueError("Not in battle phase")
        
        self._battle_turn = (
            BattleTurn.ENEMY_TURN 
            if self._battle_turn == BattleTurn.PLAYER_TURN 
            else BattleTurn.PLAYER_TURN
        )
        return self._battle_turn
    
    def reset(self):
        self._current_phase = GamePhase.MAP
        self._battle_turn = None
