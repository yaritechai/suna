#!/usr/bin/env python3
"""
Debug script to check environment variables on Render
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=== REDIS ENVIRONMENT VARIABLES ===")
print("REDIS_HOST: {os.getenv('REDIS_HOST', 'NOT SET')}")
print("REDIS_PORT: {os.getenv('REDIS_PORT', 'NOT SET')}")
print("REDIS_PASSWORD: {'SET' if os.getenv('REDIS_PASSWORD') else 'NOT SET'}")
print("REDIS_SSL: {os.getenv('REDIS_SSL', 'NOT SET')}")

print("\n=== ALL ENVIRONMENT VARIABLES ===")
for key, value in os.environ.items():
    if key.startswith('REDIS'):
        print("{key}: {'SET' if value else 'NOT SET'}")

print("\n=== REDIS CONNECTION TEST ===")
try:
    import redis.asyncio as redis
    redis_host = os.getenv('REDIS_HOST', 'redis')
    redis_port = int(os.getenv('REDIS_PORT', 6379))
    redis_password = os.getenv('REDIS_PASSWORD', '')
    redis_ssl_str = os.getenv('REDIS_SSL', 'False')
    redis_ssl = redis_ssl_str.lower() == 'true'

    print("Attempting connection to: {redis_host}:{redis_port} (SSL: {redis_ssl})")

    client = redis.Redis(
        host=redis_host,
        port=redis_port,
        password=redis_password,
        ssl=redis_ssl,
        decode_responses=True,
        socket_timeout=5.0,
        socket_connect_timeout=5.0
    )
    print("Redis client created successfully")

except Exception as e:
    print("Redis connection error: {e}")
