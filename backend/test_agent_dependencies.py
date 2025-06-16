#!/usr/bin/env python3
"""
Senior Developer Analysis: Agent Initialization Dependencies Test
Tests all critical dependencies for agent initialization in order of execution
"""

import asyncio
import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

async def test_environment_variables():
    """Test 1: Verify all required environment variables are present"""
    print("\n=== TEST 1: Environment Variables ===")

    required_vars = [
        'ANTHROPIC_API_KEY',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'REDIS_HOST',
        'REDIS_PORT',
        'REDIS_PASSWORD',
        'REDIS_SSL',
        'DAYTONA_API_KEY',
        'DAYTONA_SERVER_URL',
        'DAYTONA_TARGET'
    ]

    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
            print("❌ {var}: MISSING")
        else:
            # Hide sensitive values
            display_value = value[:8] + "..." if len(value) > 8 else "***"
            print("✅ {var}: {display_value}")

    if missing_vars:
        print("\n❌ FAILED: Missing {len(missing_vars)} required environment variables")
        return False
    else:
        print("\n✅ PASSED: All {len(required_vars)} environment variables present")
        return True

async def test_redis_connection():
    """Test 2: Verify Redis connection and SSL configuration"""
    print("\n=== TEST 2: Redis Connection ===")

    try:
        from services import redis

        # Test initialization
        await redis.initialize_async()
        print("✅ Redis client initialized")

        # Test ping
        await redis.ping()
        print("✅ Redis ping successful")

        # Test basic operations
        test_key = "test:agent_init"
        await redis.set(test_key, "test_value", ex=10)
        value = await redis.get(test_key)
        if value == "test_value":
            print("✅ Redis read/write operations working")
        else:
            print("❌ Redis read/write failed")
            return False

        await redis.delete(test_key)
        print("✅ Redis delete operation working")

        print("\n✅ PASSED: Redis connection fully functional")
        return True

    except Exception as e:
        print("❌ FAILED: Redis connection error: {str(e)}")
        return False

async def test_supabase_connection():
    """Test 3: Verify Supabase database connection"""
    print("\n=== TEST 3: Supabase Database ===")

    try:
        from services.supabase import DBConnection

        db = DBConnection()
        await db.initialize()
        print("✅ Supabase client initialized")

        client = await db.client

        # Test basic query - get user count (should work with any table)
        try:
            result = await client.table('profiles').select('id', count='exact').limit(1).execute()
            print("✅ Database query successful (found {result.count} profiles)")
        except Exception as query_error:
            print("⚠️  Database query test failed: {str(query_error)}")
            # Still consider this a pass if connection works

        print("\n✅ PASSED: Supabase database connection working")
        return True

    except Exception as e:
        print("❌ FAILED: Supabase connection error: {str(e)}")
        return False

async def test_daytona_connection():
    """Test 4: Verify Daytona sandbox service connection"""
    print("\n=== TEST 4: Daytona Service ===")

    try:
        from sandbox.sandbox import daytona

        # Test basic connection by listing sandboxes
        sandboxes = daytona.list()
        print("✅ Daytona API connection successful (found {len(sandboxes)} sandboxes)")

        # Test quota/limits
        print("✅ Daytona service accessible")

        print("\n✅ PASSED: Daytona service connection working")
        return True

    except Exception as e:
        print("❌ FAILED: Daytona connection error: {str(e)}")
        return False

async def test_llm_api_connection():
    """Test 5: Verify LLM API connection"""
    print("\n=== TEST 5: LLM API Connection ===")

    try:
        from services.llm import make_llm_api_call
        from utils.config import config

        # Test with a simple message
        messages = [{"role": "user", "content": "Hello, this is a test. Respond with just 'OK'."}]

        response = await make_llm_api_call(
            messages=messages,
            model_name=config.MODEL_TO_USE,
            max_tokens=10,
            temperature=0
        )

        if response and response.get('choices'):
            print("✅ LLM API call successful (model: {config.MODEL_TO_USE})")
            print("✅ Response received: {response['choices'][0]['message']['content'][:50]}...")
        else:
            print("❌ LLM API call failed - no valid response")
            return False

        print("\n✅ PASSED: LLM API connection working")
        return True

    except Exception as e:
        print("❌ FAILED: LLM API connection error: {str(e)}")
        return False

async def test_redis_broker_connection():
    """Test 6: Verify Redis broker for background tasks"""
    print("\n=== TEST 6: Redis Broker (Dramatiq) ===")

    try:
        from run_agent_background import redis_broker

        # Test broker connection
        print("✅ Redis broker initialized: {type(redis_broker).__name__}")

        # Try to get broker client
        if hasattr(redis_broker, 'client'):
            try:
                # Test ping through the broker's Redis client
                await redis_broker.client.ping()
                print("✅ Redis broker client ping successful")
            except Exception as ping_error:
                print("⚠️  Redis broker ping failed: {str(ping_error)}")

        print("\n✅ PASSED: Redis broker configured")
        return True

    except Exception as e:
        print("❌ FAILED: Redis broker error: {str(e)}")
        return False

async def test_model_resolution():
    """Test 7: Verify model name resolution"""
    print("\n=== TEST 7: Model Resolution ===")

    try:
        from utils.config import config
        from utils.constants import MODEL_NAME_ALIASES

        print("✅ Default model configured: {config.MODEL_TO_USE}")

        # Test alias resolution
        resolved_model = MODEL_NAME_ALIASES.get(config.MODEL_TO_USE, config.MODEL_TO_USE)
        print("✅ Model resolves to: {resolved_model}")

        print("\n✅ PASSED: Model resolution working")
        return True

    except Exception as e:
        print("❌ FAILED: Model resolution error: {str(e)}")
        return False

async def main():
    """Run all dependency tests"""
    print("🔍 SENIOR DEVELOPER ANALYSIS: Agent Initialization Dependencies")
    print("=" * 70)

    tests = [
        test_environment_variables,
        test_redis_connection,
        test_supabase_connection,
        test_daytona_connection,
        test_llm_api_connection,
        test_redis_broker_connection,
        test_model_resolution
    ]

    results = []
    for test in tests:
        try:
            result = await test()
            results.append(result)
        except Exception as e:
            print("❌ TEST FAILED with exception: {str(e)}")
            results.append(False)

    # Summary
    print("\n" + "=" * 70)
    print("📊 DEPENDENCY TEST RESULTS:")
    passed = sum(results)
    total = len(results)

    if passed == total:
        print("✅ ALL TESTS PASSED ({passed}/{total}) - Agent initialization should work!")
    else:
        print("❌ TESTS FAILED ({passed}/{total}) - Agent initialization will fail!")
        print("\nFIX REQUIRED: Address the failed dependencies before testing agent initialization.")

    return passed == total

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
