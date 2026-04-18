import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from main import app


def generate_openapi(output_path: str = "openapi.json"):
    openapi_schema = app.openapi()
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(openapi_schema, f, indent=2, ensure_ascii=False)
    
    print(f"OpenAPI schema generated: {output_path}")
    return openapi_schema


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate OpenAPI schema")
    parser.add_argument(
        "-o", "--output",
        default="openapi.json",
        help="Output file path (default: openapi.json)"
    )
    
    args = parser.parse_args()
    generate_openapi(args.output)
