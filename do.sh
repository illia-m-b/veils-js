#!/usr/bin/env bash

find src test -type f | while read -r file; do
  cat << 'EOF' > "$file"
/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */
EOF
done

