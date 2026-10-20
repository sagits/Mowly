// Assembles the single static web dist: landing at the root, each app under its base URL.
import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
cpSync('apps/landing', 'dist', { recursive: true });
cpSync('apps/customer/dist', 'dist/customer', { recursive: true });
cpSync('apps/pro/dist', 'dist/pro', { recursive: true });
