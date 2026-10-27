#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Duo Quiz 1,575 Questions Generator.
Generates 105 easy, 105 medium, and 105 spicy questions for each of the 5 categories.
"""

import json
import os

with open('/tmp/existing_questions.json', 'r', encoding='utf-8') as f:
    existing_all = json.load(f)

# Group existing by (category, difficulty)
existing_by_cat_diff = {}
for q in existing_all:
    key = (q['category'], q['difficulty'])
    if key not in existing_by_cat_diff:
        existing_by_cat_diff[key] = []
    existing_by_cat_diff[key].append(q)

print("Existing counts per (cat, diff):")
for k, v in existing_by_cat_diff.items():
    print(f"  {k}: {len(v)}")
