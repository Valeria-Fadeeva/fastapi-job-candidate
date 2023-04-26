#!/bin/bash

source .venv/bin/activate
hypercorn candidate_db.main:app --reload -w $(nproc) --bind 0.0.0.0:8000
