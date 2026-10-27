# -*- coding: utf-8 -*-
"""
Builds the complete dataset of 1,575 questions:
315 questions per category x 5 categories = 1,575 questions total.
Each category has strictly:
- 105 easy questions
- 105 medium questions
- 105 spicy questions
"""

import json
import re
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'data_generators'))

from generate_souvenirs import get_souvenirs_extras
from generate_quotidien import get_quotidien_extras
from generate_personnalite import get_personnalite_extras
from generate_projets import get_projets_extras
from generate_coquin import get_coquin_extras

CATEGORIES_CONFIG = {
    'souvenirs': {
        'var_name': 'SOUVENIRS_QUESTIONS',
        'prefix': 'souv',
        'generator': get_souvenirs_extras
    },
    'quotidien': {
        'var_name': 'QUOTIDIEN_QUESTIONS',
        'prefix': 'quot',
        'generator': get_quotidien_extras
    },
    'personnalite': {
        'var_name': 'PERSONNALITE_QUESTIONS',
        'prefix': 'pers',
        'generator': get_personnalite_extras
    },
    'projets': {
        'var_name': 'PROJETS_QUESTIONS',
        'prefix': 'proj',
        'generator': get_projets_extras
    },
    'coquin': {
        'var_name': 'COQUIN_QUESTIONS',
        'prefix': 'coqu',
        'generator': get_coquin_extras
    }
}

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    cat_dir = os.path.join(base_dir, 'src', 'data', 'categories')

    summary = {}

    for cat_name, config in CATEGORIES_CONFIG.items():
        file_path = os.path.join(cat_dir, f"{cat_name}.ts")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        match = re.search(r'\[\s*\{.*\}\s*\]', content, re.DOTALL)
        if not match:
            raise Exception(f"Failed to find JSON array in {file_path}")

        existing = json.loads(match.group(0))

        # Separate existing by difficulty
        existing_easy = [q for q in existing if q['difficulty'] == 'easy']
        existing_med = [q for q in existing if q['difficulty'] == 'medium']
        existing_spicy = [q for q in existing if q['difficulty'] == 'spicy']

        extras_easy, extras_med, extras_spicy = config['generator']()

        new_easy = []
        for i, item in enumerate(extras_easy[:70], start=len(existing_easy) + 1):
            new_easy.append({
                "id": f"{config['prefix']}_e_{i}",
                "category": cat_name,
                "difficulty": "easy",
                "question": item["q"],
                "targetQuestion": item.get("target"),
                "guesserQuestion": item.get("guesser"),
                "options": item["opts"],
                "hint": item.get("hint")
            })

        new_med = []
        for i, item in enumerate(extras_med[:70], start=len(existing_med) + 1):
            new_med.append({
                "id": f"{config['prefix']}_m_{i}",
                "category": cat_name,
                "difficulty": "medium",
                "question": item["q"],
                "targetQuestion": item.get("target"),
                "guesserQuestion": item.get("guesser"),
                "options": item["opts"],
                "hint": item.get("hint")
            })

        new_spicy = []
        for i, item in enumerate(extras_spicy[:70], start=len(existing_spicy) + 1):
            new_spicy.append({
                "id": f"{config['prefix']}_s_{i}",
                "category": cat_name,
                "difficulty": "spicy",
                "question": item["q"],
                "targetQuestion": item.get("target"),
                "guesserQuestion": item.get("guesser"),
                "options": item["opts"],
                "hint": item.get("hint")
            })

        total_cat_questions = (existing_easy + new_easy) + (existing_med + new_med) + (existing_spicy + new_spicy)

        assert len(existing_easy + new_easy) == 105, f"{cat_name} easy count is {len(existing_easy + new_easy)}"
        assert len(existing_med + new_med) == 105, f"{cat_name} med count is {len(existing_med + new_med)}"
        assert len(existing_spicy + new_spicy) == 105, f"{cat_name} spicy count is {len(existing_spicy + new_spicy)}"
        assert len(total_cat_questions) == 315, f"{cat_name} total is {len(total_cat_questions)}"

        # Write out to TypeScript file
        ts_code = f"import {{ Question }} from '../../types/quiz';\n\n"
        ts_code += f"export const {config['var_name']}: Question[] = "
        ts_code += json.dumps(total_cat_questions, ensure_ascii=False, indent=2)
        ts_code += ";\n"

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(ts_code)

        summary[cat_name] = {
            'easy': len(existing_easy + new_easy),
            'medium': len(existing_med + new_med),
            'spicy': len(existing_spicy + new_spicy),
            'total': len(total_cat_questions)
        }

    grand_total = sum(s['total'] for s in summary.values())
    print("Dataset generation completed successfully!")
    for cat, counts in summary.items():
        print(f"  {cat}: {counts['easy']} easy, {counts['medium']} medium, {counts['spicy']} spicy -> {counts['total']} total")
    print(f"GRAND TOTAL: {grand_total} questions across 5 categories (> 100 questions per difficulty level in every category)!")

if __name__ == '__main__':
    main()
