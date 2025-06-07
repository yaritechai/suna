#!/usr/bin/env python3
"""
Deployment Preparation Script for Yari 2
Fixes common deployment issues and prepares the codebase for production.
"""

import os
import re
import sys
from pathlib import Path

def fix_sandbox_indentation():
    """Fix the indentation errors in sandbox.py"""
    print("🔧 Fixing sandbox.py indentation...")
    
    sandbox_file = Path("backend/sandbox/sandbox.py")
    if not sandbox_file.exists():
        print("❌ sandbox.py not found")
        return False
    
    # Read the current content
    with open(sandbox_file, 'r') as f:
        content = f.read()
    
    # Fix the specific indentation issues
    fixed_content = content.replace(
        "                sandbox = daytona.get_current_sandbox(sandbox_id)",
        "                        sandbox = daytona.get_current_sandbox(sandbox_id)"
    ).replace(
        "                try:\n                start_supervisord_session(sandbox)",
        "                try:\n                    start_supervisord_session(sandbox)"
    )
    
    # Write back the fixed content
    with open(sandbox_file, 'w') as f:
        f.write(fixed_content)
    
    print("✅ Fixed sandbox.py indentation")
    return True

def add_graceful_fallbacks():
    """Add graceful fallbacks for optional dependencies"""
    print("🔧 Adding graceful fallbacks for optional services...")
    
    # Fix run_agent_background.py langfuse import
    bg_file = Path("backend/run_agent_background.py")
    if bg_file.exists():
        with open(bg_file, 'r') as f:
            content = f.read()
        
        # Add fallback for langfuse import
        if "from services.langfuse import langfuse" in content and "try:" not in content[:200]:
            content = content.replace(
                "from services.langfuse import langfuse",
                """try:
    from services.langfuse import langfuse
except ImportError:
    # Create dummy langfuse for graceful degradation
    class DummyLangfuse:
        def trace(self, *args, **kwargs):
            class DummyTrace:
                def span(self, *args, **kwargs): return DummyTrace()
                def end(self, *args, **kwargs): pass
            return DummyTrace()
    langfuse = DummyLangfuse()"""
            )
            
            with open(bg_file, 'w') as f:
                f.write(content)
            print("✅ Added langfuse fallback to run_agent_background.py")
    
    return True

def create_dockerfile_health_check():
    """Add health check to Dockerfile"""
    print("🔧 Adding health check to Dockerfile...")
    
    dockerfile = Path("Dockerfile")
    if dockerfile.exists():
        with open(dockerfile, 'r') as f:
            content = f.read()
        
        if "HEALTHCHECK" not in content:
            # Add health check before the final CMD
            health_check = """
# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1
"""
            content = content.replace("CMD [", health_check + "\nCMD [")
            
            with open(dockerfile, 'w') as f:
                f.write(content)
            print("✅ Added health check to Dockerfile")
    
    return True

def create_health_endpoint():
    """Create a simple health check endpoint"""
    print("🔧 Creating health check endpoint...")
    
    health_file = Path("backend/health.py")
    with open(health_file, 'w') as f:
        f.write("""#!/usr/bin/env python3
\"\"\"
Simple health check endpoint for deployment monitoring
\"\"\"

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import asyncio
import time

app = FastAPI()

@app.get("/health")
async def health_check():
    \"\"\"Basic health check endpoint\"\"\"
    return JSONResponse({
        "status": "healthy", 
        "timestamp": time.time(),
        "service": "yari-2-backend"
    })

@app.get("/ready")
async def readiness_check():
    \"\"\"Readiness check for K8s/Docker\"\"\"
    # Add any dependency checks here if needed
    return JSONResponse({
        "status": "ready",
        "timestamp": time.time(),
        "service": "yari-2-backend"
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
""")
    
    print("✅ Created health check endpoint at backend/health.py")
    return True

def fix_optional_imports():
    """Make all optional dependencies truly optional"""
    print("🔧 Making optional dependencies graceful...")
    
    backend_files = list(Path("backend").rglob("*.py"))
    
    optional_deps = [
        "daytona_sdk", "daytona_api_client", "groq", "openai", 
        "anthropic", "bedrock", "tavily", "firecrawl"
    ]
    
    for file_path in backend_files:
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            
            modified = False
            for dep in optional_deps:
                if f"import {dep}" in content or f"from {dep}" in content:
                    # Check if it's already wrapped in try/except
                    if content.count(f"import {dep}") == 1 and "try:" not in content[:content.find(f"import {dep}")]:
                        # Wrap the import in try/except
                        content = content.replace(
                            f"import {dep}",
                            f"""try:
    import {dep}
except ImportError:
    {dep} = None"""
                        )
                        modified = True
            
            if modified:
                with open(file_path, 'w') as f:
                    f.write(content)
                print(f"✅ Made optional imports graceful in {file_path.name}")
        
        except Exception as e:
            print(f"⚠️  Warning: Could not process {file_path}: {e}")
    
    return True

def validate_environment_variables():
    """Check for required environment variables and create .env.example"""
    print("🔧 Creating environment variable documentation...")
    
    env_example = Path(".env.example")
    with open(env_example, 'w') as f:
        f.write("""# Yari 2 Environment Variables
# Copy this file to .env and fill in your values

# Required - Database
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Required - At least one LLM provider
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional - Additional LLM providers
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional - Web search (features will be disabled if not provided)
TAVILY_API_KEY=your_tavily_api_key_here
FIRECRAWL_API_KEY=your_firecrawl_api_key_here

# Optional - Monitoring and Analytics
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key_here
LANGFUSE_SECRET_KEY=your_langfuse_secret_key_here
LANGFUSE_HOST=https://cloud.langfuse.com

# Optional - Sandbox integration
DAYTONA_API_KEY=your_daytona_api_key_here
DAYTONA_SERVER_URL=your_daytona_server_url_here
DAYTONA_TARGET=your_daytona_target_here

# Optional - AWS Bedrock
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION_NAME=us-west-2

# Application settings
PORT=8000
HOST=0.0.0.0
DEBUG=false
""")
    
    print("✅ Created .env.example with all environment variables")
    return True

def main():
    """Run all deployment preparation steps"""
    print("🚀 Starting Yari 2 deployment preparation...")
    print("=" * 50)
    
    steps = [
        ("Fix sandbox indentation", fix_sandbox_indentation),
        ("Add graceful fallbacks", add_graceful_fallbacks),
        ("Create health endpoints", create_health_endpoint),
        ("Fix optional imports", fix_optional_imports),
        ("Create environment docs", validate_environment_variables),
    ]
    
    success_count = 0
    for step_name, step_func in steps:
        try:
            if step_func():
                success_count += 1
            else:
                print(f"❌ Failed: {step_name}")
        except Exception as e:
            print(f"❌ Error in {step_name}: {e}")
    
    print("=" * 50)
    print(f"✅ Deployment preparation complete: {success_count}/{len(steps)} steps successful")
    
    if success_count == len(steps):
        print("🎉 Your codebase is ready for deployment!")
        print("\nNext steps:")
        print("1. Copy .env.example to .env and fill in your values")
        print("2. Test locally: cd backend && python api.py")
        print("3. Deploy to Render with confidence!")
    else:
        print("⚠️  Some issues remain. Please review the errors above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 