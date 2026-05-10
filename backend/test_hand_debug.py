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
    print("=== Hand Debug Test ===\n")

    # Start game
    data = request('POST', '/game/start', {'character': 'ironclad'})
    game_id = data['game_id']
    print(f'Game ID: {game_id}')

    # Check initial state
    gs = data['game_state']
    print(f"\n--- Initial State ---")
    print(f"Phase: {gs['phase']}")
    print(f"Deck draw_pile count: {len(gs['deck']['draw_pile'])}")
    print(f"Deck hand count: {len(gs['deck']['hand'])}")
    print(f"Deck discard_pile count: {len(gs['deck']['discard_pile'])}")

    # Find battle room
    floors = gs['map']['floors']
    battle_idx = None
    for idx, room in enumerate(floors[0]['rooms']):
        if room['type'] in ('battle', 'elite', 'boss'):
            battle_idx = idx
            break

    if battle_idx is None:
        print("No battle room found!")
        return

    # Enter battle
    state = request('POST', f'/game/{game_id}/action', {
        'type': 'select_map_room',
        'payload': {'room_index': battle_idx}
    })

    print(f"\n--- After Entering Battle ---")
    print(f"Phase: {state['phase']}")
    print(f"Battle Turn: {state.get('battle_turn', 'N/A')}")

    deck = state.get('deck', {})
    print(f"Deck keys: {list(deck.keys())}")
    print(f"Draw pile count: {len(deck.get('draw_pile', []))}")
    print(f"Hand count: {len(deck.get('hand', []))}")
    print(f"Discard pile count: {len(deck.get('discard_pile', []))}")

    hand = deck.get('hand', [])
    if hand:
        print(f"\n--- Hand Cards ---")
        for i, card in enumerate(hand):
            print(f"  [{i}] {card.get('name', 'UNKNOWN')} (cost:{card.get('cost', '?')}, dmg:{card.get('damage', 'N/A')}, blk:{card.get('block', 'N/A')})")
    else:
        print("\n!!! HAND IS EMPTY !!!")

    # Check first card detail
    if hand:
        print(f"\n--- First Card Detail ---")
        card = hand[0]
        for k, v in card.items():
            print(f"  {k}: {v}")

if __name__ == '__main__':
    main()
