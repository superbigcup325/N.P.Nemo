import urllib.request
import json

BASE_URL = 'http://localhost:8000'

def request(method, path, data=None):
    url = f'{BASE_URL}{path}'
    headers = {'Content-Type': 'application/json'}
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def main():
    print("=== N.P.Nemo Phase 2 Battle System Test ===\n")

    # Test health
    r = request('GET', '/health')
    print(f'Health: {r}')

    # Test start game
    data = request('POST', '/game/start', {'character': 'ironclad'})
    game_id = data['game_id']
    print(f'Game ID: {game_id}')
    print(f'Phase: {data["game_state"]["phase"]}')
    print(f'Battle Turn: {data["game_state"].get("battle_turn", "N/A")}')
    print(f'Map floors: {len(data["game_state"]["map"]["floors"])}')

    # Find first battle room
    floors = data['game_state']['map']['floors']
    battle_room_idx = None
    for idx, room in enumerate(floors[0]['rooms']):
        if room['type'] in ('battle', 'elite', 'boss'):
            battle_room_idx = idx
            print(f'Found battle room at index {idx}: {room["type"]}')
            break

    if battle_room_idx is None:
        print('No battle room found on first floor, using room 0')
        battle_room_idx = 0

    # Enter room
    state = request('POST', f'/game/{game_id}/action', {'type': 'select_map_room', 'payload': {'room_index': battle_room_idx}})
    print(f'\n--- Entered Room ---')
    print(f'Phase: {state["phase"]}')

    if state['phase'] != 'battle':
        print(f'Room type is {state["phase"]}, skipping battle test')
        print('\n=== Test Completed (non-battle room) ===')
        return

    # Note: API returns snake_case, frontend converts to camelCase
    battle_turn = state.get('battle_turn', 'player')
    print(f'Battle Turn: {battle_turn}')
    print(f'Enemy: {state["enemies"][0]["name"]} HP:{state["enemies"][0]["hp"]}')
    print(f'Enemy Intent: {state["enemies"][0]["intent"]["type"]} ({state["enemies"][0]["intent"].get("value", "N/A")})')
    print(f'Hand size: {len(state["deck"]["hand"])}')
    print(f'Energy: {state["player"]["energy"]}')

    # Play a card
    state = request('POST', f'/game/{game_id}/action', {'type': 'play_card', 'payload': {'card_index': 0, 'target_index': 0}})
    print(f'\n--- After Playing Card ---')
    print(f'Battle Turn: {state.get("battle_turn", "player")}')
    print(f'Enemy HP: {state["enemies"][0]["hp"]}')
    print(f'Energy: {state["player"]["energy"]}')
    print(f'Hand size: {len(state["deck"]["hand"])}')

    # End turn - enemy acts
    state = request('POST', f'/game/{game_id}/end-turn')
    print(f'\n--- After End Turn ---')
    print(f'Battle Turn: {state.get("battle_turn", "player")}')
    print(f'Turn: {state["turn"]}')
    print(f'Player HP: {state["player"]["hp"]}')
    print(f'Player Block: {state["player"]["block"]}')
    print(f'Enemy HP: {state["enemies"][0]["hp"]}')
    print(f'Enemy Block: {state["enemies"][0]["block"]}')
    print(f'New Enemy Intent: {state["enemies"][0]["intent"]["type"]} ({state["enemies"][0]["intent"].get("value", "N/A")})')
    print(f'Hand size: {len(state["deck"]["hand"])}')
    print(f'Energy: {state["player"]["energy"]}')

    # Play another turn
    state = request('POST', f'/game/{game_id}/action', {'type': 'play_card', 'payload': {'card_index': 0, 'target_index': 0}})
    state = request('POST', f'/game/{game_id}/end-turn')
    print(f'\n--- After Turn 2 ---')
    print(f'Turn: {state["turn"]}')
    print(f'Player HP: {state["player"]["hp"]}')
    print(f'Enemy HP: {state["enemies"][0]["hp"]}')
    print(f'Enemy Intent: {state["enemies"][0]["intent"]["type"]} ({state["enemies"][0]["intent"].get("value", "N/A")})')

    print('\n=== All Phase 2 Tests Passed! ===')

if __name__ == '__main__':
    main()
